/**
 * Registry queries and the publish step.
 *
 * Publishing goes through `pnpm publish` rather than `npm publish` because the
 * workspace uses the `workspace:*` protocol — pnpm rewrites those ranges to real
 * versions while packing, npm does not, and an unrewritten `workspace:*` in a
 * published tarball is uninstallable.
 */

import { run, tryCapture } from './exec.mjs'
import { highest, isSemver } from './version.mjs'

async function view(name, field) {
  const out = await tryCapture('npm', ['view', name, field, '--json'])
  if (out === null) return null
  try {
    return JSON.parse(out)
  } catch {
    return null
  }
}

/** Every published version, or null when the package is not on the registry yet. */
export async function publishedVersions(name) {
  const versions = await view(name, 'versions')
  if (versions === null) return null
  const list = Array.isArray(versions) ? versions : [versions]
  return list.filter((v) => typeof v === 'string' && isSemver(v))
}

export async function distTags(name) {
  return (await view(name, 'dist-tags')) ?? null
}

/** Highest published version by semver precedence, ignoring dist-tags. */
export async function highestPublished(name) {
  const versions = await publishedVersions(name)
  return versions?.length ? highest(versions) : null
}

export async function isPublished(name, version) {
  const versions = await publishedVersions(name)
  return Boolean(versions?.includes(version))
}

/**
 * `--no-git-checks` disables pnpm's own branch/clean-tree/up-to-date gate: the
 * release tool already ran those checks before touching anything, and pnpm's
 * version of them fails whenever the release tag has not been pushed yet.
 */
export async function publishPackage(pkg, { tag, access = 'public', dryRun = false } = {}) {
  const args = ['publish', '--access', access, '--no-git-checks']
  if (tag) args.push('--tag', tag)
  if (dryRun) args.push('--dry-run')

  const code = await run('pnpm', args, { cwd: pkg.root })
  if (code !== 0) throw new Error(`pnpm publish failed with code ${code}`)
}

export async function setDistTag(name, version, tag) {
  const code = await run('npm', ['dist-tag', 'add', `${name}@${version}`, tag])
  if (code !== 0) throw new Error(`npm dist-tag add failed with code ${code}`)
}
