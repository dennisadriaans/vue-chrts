/**
 * Paths + release constants for the vue-chrts monorepo.
 *
 * One git repository, several publishable packages under `packages/*`, so every
 * release is scoped to a single package: its own tag, its own CHANGELOG section,
 * its own npm publish, its own GitHub Release.
 */

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
export const PACKAGES_DIR = resolve(REPO_ROOT, 'packages')

export const GITHUB_REPO = 'dennisadriaans/vue-chrts'
export const RELEASE_BRANCH = 'main'

/**
 * `name@version` — the npm/changesets convention. A flat `vX.Y.Z` cannot say
 * which of three packages it belongs to, and this repo already carries 29 flat
 * tags from the single-package era.
 */
export function tagFor(name, version) {
  return `${name}@${version}`
}

/**
 * A tag inside a GitHub URL path. `@` stays readable (GitHub's own monorepo
 * links keep it); the `/` of a scoped name would otherwise split the path.
 */
export function tagPath(tag) {
  return encodeURIComponent(tag).replace(/%40/g, '@')
}

export function parseTag(tag) {
  const at = tag.lastIndexOf('@')
  if (at <= 0) return null
  return { name: tag.slice(0, at), version: tag.slice(at + 1) }
}

/**
 * Tags that predate the `name@version` scheme, per package. Without this the
 * first scoped release of vue-chrts would report every commit ever made as
 * "since the last release".
 */
export const LEGACY_TAG_GLOBS = {
  'vue-chrts': 'v*'
}

/** Verification gates, run through turbo and scoped to the released package. */
export const VERIFY_STEPS = [
  { id: 'typecheck', label: 'typecheck', task: 'typecheck' },
  { id: 'test', label: 'test', task: 'test' },
  { id: 'build', label: 'build', task: 'build' }
]

/**
 * Files every published package should ship. npm puts README, LICENSE and
 * package.json in the tarball regardless of `files`, but only if they sit in
 * the package directory — a root-only LICENSE never reaches the registry.
 */
export const REQUIRED_PACKAGE_FILES = ['README.md', 'CHANGELOG.md', 'LICENSE']

/** package.json fields npm surfaces on the package page. */
export const RECOMMENDED_MANIFEST_FIELDS = [
  'description',
  'license',
  'repository',
  'homepage',
  'bugs',
  'keywords',
  'author'
]

/** Repo-level files a public release is expected to have. */
export const REQUIRED_REPO_FILES = ['LICENSE', 'README.md']
