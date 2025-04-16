import fs from 'fs/promises';
import path from 'path';

export const defaultConfig = {
  packages: ['packages/vue', 'packages/nuxt'],
  changelogFiles: {
    'vue-chrts': 'packages/vue/CHANGELOG.md',
    'nuxt-charts': 'packages/nuxt/CHANGELOG.md'
  },
  npmPublishAccess: 'public',
  commitTypes: {
    feat: 'Features',
    fix: 'Bug Fixes',
    docs: 'Documentation',
    style: 'Styles',
    refactor: 'Code Refactoring',
    perf: 'Performance Improvements',
    test: 'Tests',
    build: 'Build System',
    ci: 'CI',
    chore: 'Chores'
  }
};

export async function getConfig() {
  try {
    const configPath = path.resolve(process.cwd(), '.chrts-release.json');
    const configContent = await fs.readFile(configPath, 'utf-8');
    return { ...defaultConfig, ...JSON.parse(configContent) };
  } catch (error) {
    // If config file doesn't exist, return default config
    if (error.code === 'ENOENT') {
      return defaultConfig;
    }
    throw error;
  }
}
