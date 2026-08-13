/**
 * The steps that actually change something: version write, verification gates,
 * commit, tag, push and GitHub Release. Each is its own export so the
 * orchestrator can sequence them with a confirmation in between.
 */

import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { run, runOrThrow, tryCapture } from './exec.mjs'
import { GITHUB_REPO, REPO_ROOT, VERIFY_STEPS } from './config.mjs'
import { isPrerelease } from './version.mjs'

/**
 * Write `version` into a package.json, preserving key order and the trailing
 * newline. A manifest without a `version` gets one right after `name` rather
 * than appended, to match how the rest of the file reads.
 */
export function writeVersion(pkgJsonPath, nextVersion) {
  const raw = readFileSync(pkgJsonPath, 'utf-8')
  const trailingNewline = raw.endsWith('\n')
  const pkg = JSON.parse(raw)

  let next
  if ('version' in pkg) {
    pkg.version = nextVersion
    next = pkg
  } else {
    next = {}
    for (const [key, value] of Object.entries(pkg)) {
      next[key] = value
      if (key === 'name') next.version = nextVersion
    }
    if (!('version' in next)) next.version = nextVersion
  }

  writeFileSync(pkgJsonPath, JSON.stringify(next, null, 2) + (trailingNewline ? '\n' : ''))
}

/**
 * Run one gate through turbo, scoped to the released package. turbo skips a
 * package that has no such task (packages/vue has no `test` script), and its
 * `^build` dependencies mean the package's workspace deps get built first.
 */
export async function runVerifyStep(pkg, step) {
  const code = await run('pnpm', ['exec', 'turbo', 'run', step.task, `--filter=${pkg.name}`], {
    cwd: REPO_ROOT
  })
  if (code !== 0) throw new Error(`${step.label} failed with code ${code}`)
}

export async function runVerify(pkg, steps = VERIFY_STEPS) {
  for (const step of steps) await runVerifyStep(pkg, step)
}

/** Paths dirty in the repo, relative to the repo root. */
export async function dirtyFiles() {
  const out = await tryCapture('git', ['status', '--porcelain'], { cwd: REPO_ROOT })
  if (!out) return []
  return out
    .split('\n')
    .filter(Boolean)
    .map((line) => line.slice(3).trim())
}

export async function ensureTagFree(tag) {
  const local = await tryCapture('git', ['tag', '--list', tag], { cwd: REPO_ROOT })
  if (local && local.length > 0) {
    throw new Error(`Git tag ${tag} already exists locally. Delete it or pick another version.`)
  }
  const remote = await tryCapture('git', ['ls-remote', '--tags', 'origin', `refs/tags/${tag}`], {
    cwd: REPO_ROOT
  })
  if (remote && remote.length > 0) {
    throw new Error(`Git tag ${tag} already exists on origin — ${tag} shipped.`)
  }
}

export async function commitRelease({ files, message }) {
  await runOrThrow('git', ['add', '--', ...files], { cwd: REPO_ROOT })

  // Nothing staged happens when a previous run wrote the same content and was
  // aborted after the commit; tag the existing HEAD rather than failing.
  const staged = await run('git', ['diff', '--cached', '--quiet'], {
    cwd: REPO_ROOT,
    stdio: 'ignore'
  })
  if (staged === 0) return false

  await runOrThrow('git', ['commit', '-m', message], { cwd: REPO_ROOT })
  return true
}

export async function tagRelease(tag, message) {
  await runOrThrow('git', ['tag', '-a', tag, '-m', message], { cwd: REPO_ROOT })
}

export async function pushBranchAndTag(branch, tag) {
  await runOrThrow('git', ['push', 'origin', branch], { cwd: REPO_ROOT })
  await runOrThrow('git', ['push', 'origin', tag], { cwd: REPO_ROOT })
}

export function writeNotesFile(notes) {
  const dir = mkdtempSync(resolve(tmpdir(), 'vue-chrts-release-'))
  const file = resolve(dir, 'notes.md')
  writeFileSync(file, notes)
  return file
}

export async function createGithubRelease({ tag, title, notesFile, version }) {
  const args = [
    'release',
    'create',
    tag,
    '--repo',
    GITHUB_REPO,
    '--title',
    title,
    '--notes-file',
    notesFile,
    '--verify-tag'
  ]
  // A prerelease must never take the repo's "Latest release" badge, and in a
  // monorepo neither should a release of a package that is not the flagship.
  if (isPrerelease(version)) args.push('--prerelease', '--latest=false')
  await runOrThrow('gh', args, { cwd: REPO_ROOT })
}

export async function githubReleaseExists(tag) {
  const out = await tryCapture('gh', ['release', 'view', tag, '--repo', GITHUB_REPO])
  return out !== null
}
