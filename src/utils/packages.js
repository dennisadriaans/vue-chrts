import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

/**
 * Get paths to all packages defined in configuration
 * @param {Object} config - Config object
 * @returns {Promise<Array<string>>} Array of package paths
 */
export async function getPackagePaths(config) {
  // Validate packages paths
  const validPackages = [];
  
  for (const packagePath of config.packages) {
    try {
      const fullPath = path.resolve(process.cwd(), packagePath);
      await fs.access(fullPath);
      validPackages.push(packagePath);
    } catch (error) {
      console.warn(chalk.yellow(`Package path not found: ${packagePath}`));
    }
  }
  
  if (validPackages.length === 0) {
    throw new Error('No valid package paths found in configuration');
  }
  
  return validPackages;
}

/**
 * Update the version in all package.json files
 * @param {Array<string>} packagePaths - Array of package paths
 * @param {string} newVersion - New version to set
 * @returns {Promise<void>}
 */
export async function updatePackageVersions(packagePaths, newVersion) {
  const changedFiles = [];
  
  // First, load and parse all package.json files
  const packageJsons = await Promise.all(
    packagePaths.map(async (pkgPath) => {
      const pkgJsonPath = path.resolve(process.cwd(), pkgPath, 'package.json');
      const content = await fs.readFile(pkgJsonPath, 'utf-8');
      return { path: pkgJsonPath, content: JSON.parse(content) };
    })
  );
  
  // Update dependencies between the packages if needed
  for (const pkg of packageJsons) {
    // Update version
    pkg.content.version = newVersion;
    
    // Update dependencies on other packages in the monorepo
    const otherPackages = packageJsons.filter(p => p.path !== pkg.path);
    
    for (const section of ['dependencies', 'devDependencies', 'peerDependencies']) {
      if (!pkg.content[section]) continue;
      
      for (const otherPkg of otherPackages) {
        const otherPkgName = otherPkg.content.name;
        if (pkg.content[section][otherPkgName]) {
          pkg.content[section][otherPkgName] = newVersion;
        }
      }
    }
    
    // Write updated package.json back to disk
    await fs.writeFile(pkg.path, JSON.stringify(pkg.content, null, 2) + '\n', 'utf-8');
    changedFiles.push(pkg.path);
  }
  
  return changedFiles;
}
