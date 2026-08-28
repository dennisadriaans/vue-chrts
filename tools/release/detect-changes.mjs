/**
 * What has landed for one package since its last release tag.
 *
 * Tags are `name@version`, so every query is scoped to a single package, and
 * commits are filtered to that package's directory — a nuxt-charts release
 * should not list vue-chrts commits. Conservative: when the answer cannot be
 * determined (git unavailable), report "changed" so the operator is still
 * prompted rather than silently skipped.
 */

import { tryCapture } from './exec.mjs'
import { parseTag, REPO_ROOT } from './config.mjs'
import { compare, isSemver } from './version.mjs'

// Unit/record separators: commit bodies contain blank lines, so a line-based
// format would lose `BREAKING CHANGE:` footers.
const FIELD = '\x1f'
const RECORD = '\x1e'

function versionOfTag(tag, pkg) {
  const parsed = parseTag(tag)
  if (parsed) return parsed.name === pkg.name ? parsed.version : null
  // Legacy flat tags (`v2.2.0`) predate the scoped scheme.
  const bare = tag.replace(/^v/, '')
  return isSemver(bare) ? bare : null
}

async function tagsMatching(glob) {
  const out = await tryCapture('git', ['tag', '--list', glob], { cwd: REPO_ROOT })
  return out ? out.split('\n').map((t) => t.trim()).filter(Boolean) : []
}

/** Release tags for a package, newest first by semver precedence. */
export async function releaseTags(pkg) {
  const globs = [`${pkg.name}@*`]
  if (pkg.legacyTagGlob) globs.push(pkg.legacyTagGlob)

  const seen = new Map()
  for (const glob of globs) {
    for (const tag of await tagsMatching(glob)) {
      const version = versionOfTag(tag, pkg)
      if (version && !seen.has(tag)) seen.set(tag, version)
    }
  }
  return [...seen.entries()]
    .map(([tag, version]) => ({ tag, version }))
    .sort((a, b) => compare(b.version, a.version))
}

export async function lastReleaseTag(pkg) {
  const tags = await releaseTags(pkg)
  return tags[0] ?? null
}

/** Highest released version by semver precedence, or null before the first release. */
export async function highestReleasedVersion(pkg) {
  return (await lastReleaseTag(pkg))?.version ?? null
}

/**
 * Commits since `ref`, optionally narrowed to a pathspec. Returns null when git
 * fails so callers can tell "no commits" from "could not tell".
 */
export async function commitsSince(ref, pathspec) {
  const args = [
    'log',
    '--no-merges',
    `--pretty=format:%H${FIELD}%h${FIELD}%s${FIELD}%b${RECORD}`,
    ref ? `${ref}..HEAD` : 'HEAD'
  ]
  if (pathspec) args.push('--', pathspec)

  const out = await tryCapture('git', args, { cwd: REPO_ROOT })
  if (out === null) return null
  return out
    .split(RECORD)
    .map((record) => record.replace(/^\n/, ''))
    .filter((record) => record.trim())
    .map((record) => {
      const [sha, short, subject, body = ''] = record.split(FIELD)
      return { sha, short, subject: subject.trim(), body: body.trim() }
    })
}

export async function detectChanges(pkg, { scoped = true } = {}) {
  const last = await lastReleaseTag(pkg)
  const commits = await commitsSince(last?.tag, scoped ? pkg.relDir : null)
  const all = scoped ? await commitsSince(last?.tag, null) : commits
  return {
    lastTag: last?.tag ?? null,
    lastVersion: last?.version ?? null,
    changed: commits === null ? true : commits.length > 0,
    commits: commits ?? [],
    totalCommits: all?.length ?? 0
  }
}

export async function tagExists(tag) {
  const out = await tryCapture('git', ['tag', '--list', tag], { cwd: REPO_ROOT })
  return Boolean(out)
}

/** Remote tags too — a tag deleted locally but present on origin still collides. */
export async function remoteTagExists(tag) {
  const out = await tryCapture('git', ['ls-remote', '--tags', 'origin', `refs/tags/${tag}`], {
    cwd: REPO_ROOT
  })
  return Boolean(out && out.length > 0)
}
