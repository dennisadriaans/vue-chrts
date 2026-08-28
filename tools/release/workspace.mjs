/**
 * Workspace discovery. Reads each `packages/<dir>/package.json` directly rather
 * than asking pnpm, so the tool keeps working when node_modules is cold.
 *
 * A directory without a package.json (`packages/angular` is a leftover build
 * output) is not a package, and `private: true` packages are never released.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { LEGACY_TAG_GLOBS, PACKAGES_DIR, REPO_ROOT } from './config.mjs'

export function readManifest(pkgJsonPath) {
  return JSON.parse(readFileSync(pkgJsonPath, 'utf-8'))
}

function describe(dir) {
  const root = resolve(PACKAGES_DIR, dir)
  const pkgJsonPath = resolve(root, 'package.json')
  if (!existsSync(pkgJsonPath)) return null
  let manifest
  try {
    manifest = readManifest(pkgJsonPath)
  } catch {
    return null
  }
  if (!manifest.name) return null
  return {
    dir,
    name: manifest.name,
    version: manifest.version ?? null,
    private: manifest.private === true,
    root,
    relDir: `packages/${dir}`,
    pkgJsonPath,
    changelogPath: resolve(root, 'CHANGELOG.md'),
    changelogDir: resolve(root, 'changelog.d'),
    manifest,
    legacyTagGlob: LEGACY_TAG_GLOBS[manifest.name] ?? null
  }
}

/** Every publishable package, sorted by name. */
export function listPackages() {
  if (!existsSync(PACKAGES_DIR)) return []
  return readdirSync(PACKAGES_DIR)
    .filter((entry) => {
      const path = resolve(PACKAGES_DIR, entry)
      return !entry.startsWith('.') && statSync(path).isDirectory()
    })
    .map(describe)
    .filter((pkg) => pkg !== null && !pkg.private)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function findPackage(nameOrDir) {
  const packages = listPackages()
  return (
    packages.find((p) => p.name === nameOrDir) ??
    packages.find((p) => p.dir === nameOrDir) ??
    null
  )
}

const DEP_FIELDS = ['dependencies', 'peerDependencies', 'optionalDependencies']

/**
 * Workspace packages this one depends on at runtime. pnpm rewrites
 * `workspace:*` to a concrete version when it packs, so a dependency that has
 * not been published at its current version produces a broken tarball.
 */
export function workspaceDependencies(pkg, packages = listPackages()) {
  const byName = new Map(packages.map((p) => [p.name, p]))
  const out = []
  for (const field of DEP_FIELDS) {
    for (const [name, range] of Object.entries(pkg.manifest[field] ?? {})) {
      const dep = byName.get(name)
      if (dep && dep.name !== pkg.name) out.push({ ...dep, range, field })
    }
  }
  return out
}

/** Workspace packages that depend on this one. */
export function workspaceDependents(pkg, packages = listPackages()) {
  return packages.filter((candidate) =>
    DEP_FIELDS.some((field) => candidate.manifest[field]?.[pkg.name])
  )
}

export { REPO_ROOT }
