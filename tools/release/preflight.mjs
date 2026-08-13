/**
 * Preflight checks. Each returns { ok, message, hint? }; the orchestrator
 * decides which failures are fatal and which are warnings.
 *
 * A release here pushes to a public GitHub repository and publishes to the
 * public npm registry, so the checks cover git hygiene, credentials, and the
 * package metadata npm renders on the package page.
 */

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { tryCapture } from './exec.mjs'
import {
  GITHUB_REPO,
  RECOMMENDED_MANIFEST_FIELDS,
  REPO_ROOT,
  REQUIRED_PACKAGE_FILES,
  REQUIRED_REPO_FILES
} from './config.mjs'

export async function checkGitRepo(cwd = REPO_ROOT) {
  const out = await tryCapture('git', ['rev-parse', '--is-inside-work-tree'], { cwd })
  return out === 'true'
    ? { ok: true }
    : { ok: false, message: `Not inside a git repository: ${cwd}` }
}

export async function checkOrigin() {
  const url = await tryCapture('git', ['remote', 'get-url', 'origin'], { cwd: REPO_ROOT })
  if (!url) return { ok: false, message: 'No `origin` remote.' }
  return url.toLowerCase().includes(GITHUB_REPO.toLowerCase())
    ? { ok: true, url }
    : {
        ok: false,
        url,
        message: `origin is ${url}, expected ${GITHUB_REPO}.`,
        hint: 'Releasing would push the tag to the wrong repository.'
      }
}

export async function checkCleanTree(cwd = REPO_ROOT, label = 'Working tree') {
  const out = await tryCapture('git', ['status', '--porcelain'], { cwd })
  if (out === null) return { ok: false, message: `git status failed in ${cwd}` }
  return out.length === 0
    ? { ok: true }
    : {
        ok: false,
        message: `${label} has uncommitted changes.`,
        hint: 'Commit or stash first — the release creates its own commit.'
      }
}

export async function checkBranch(expected, cwd = REPO_ROOT) {
  const branch = await tryCapture('git', ['branch', '--show-current'], { cwd })
  if (!branch) return { ok: false, message: 'Could not determine the current branch.' }
  return branch === expected
    ? { ok: true, branch }
    : {
        ok: false,
        branch,
        message: `On '${branch}', expected '${expected}'.`,
        hint: `Switch with \`git checkout ${expected}\` or continue at the prompt.`
      }
}

export async function checkUpToDateWithRemote(branch, cwd = REPO_ROOT) {
  const fetched = await tryCapture('git', ['fetch', 'origin', branch], { cwd })
  if (fetched === null) {
    return { ok: false, message: 'Could not fetch origin.', hint: 'Offline? The tag would be pushed later.' }
  }
  const counts = await tryCapture(
    'git',
    ['rev-list', '--left-right', '--count', `origin/${branch}...HEAD`],
    { cwd }
  )
  if (!counts) return { ok: true }
  const [behind, ahead] = counts.split(/\s+/).map(Number)
  if (behind > 0) {
    return {
      ok: false,
      message: `Local ${branch} is ${behind} commit(s) behind origin.`,
      hint: 'Pull before releasing so the tag points at the published history.'
    }
  }
  return { ok: true, ahead }
}

/** Tracked env files would ship secrets to a public repo. */
export async function checkTrackedSecrets() {
  const tracked = await tryCapture('git', ['ls-files'], { cwd: REPO_ROOT })
  if (tracked === null) return { ok: false, message: 'git ls-files failed.' }
  const suspects = tracked
    .split('\n')
    .filter(Boolean)
    .filter((f) => {
      const base = f.split('/').pop() ?? ''
      if (base === '.env.example') return false
      return base === '.env' || base.startsWith('.env.') || base === '.dev.vars'
    })
  return suspects.length === 0
    ? { ok: true }
    : {
        ok: false,
        message: `Env files tracked: ${suspects.join(', ')}`,
        hint: 'Remove them from the index before publishing.'
      }
}

export async function checkGhCli() {
  const version = await tryCapture('gh', ['--version'])
  if (!version) {
    return {
      ok: false,
      message: '`gh` CLI not found.',
      hint: 'Install it to publish GitHub Releases; the git tag still works without it.'
    }
  }
  const auth = await tryCapture('gh', ['auth', 'status'])
  return auth === null
    ? { ok: false, message: '`gh` is installed but not authenticated.', hint: 'Run `gh auth login`.' }
    : { ok: true, version: version.split('\n')[0] }
}

export async function checkNpmAuth() {
  const who = await tryCapture('npm', ['whoami'])
  return who
    ? { ok: true, user: who }
    : {
        ok: false,
        message: 'Not authenticated with the npm registry.',
        hint: 'Run `npm login` before the publish step (the rest of the release still works).'
      }
}

export function checkRepoFiles() {
  const missing = REQUIRED_REPO_FILES.filter((f) => !existsSync(resolve(REPO_ROOT, f)))
  return missing.length === 0
    ? { ok: true }
    : { ok: false, message: `Repo root is missing: ${missing.join(', ')}` }
}

/** An MIT LICENSE still carrying its template placeholders grants nothing clearly. */
export function checkLicenseFilled() {
  const path = resolve(REPO_ROOT, 'LICENSE')
  if (!existsSync(path)) return { ok: false, message: 'No LICENSE file.' }
  const text = readFileSync(path, 'utf-8')
  const placeholders = ['[year]', '[fullname]', '<year>', '<name of author>'].filter((p) =>
    text.includes(p)
  )
  return placeholders.length === 0
    ? { ok: true }
    : {
        ok: false,
        message: `LICENSE still contains placeholders: ${placeholders.join(', ')}`,
        hint: 'Fill in the copyright year and holder.'
      }
}

export function checkPackageFiles(pkg) {
  const missing = REQUIRED_PACKAGE_FILES.filter((f) => !existsSync(resolve(pkg.root, f)))
  return missing.length === 0
    ? { ok: true }
    : {
        ok: false,
        message: `${pkg.relDir} is missing: ${missing.join(', ')}`,
        hint: 'npm renders README.md on the package page and only ships a LICENSE found in the package directory.'
      }
}

/** Metadata npm renders on the package page; missing fields are a warning. */
export function checkManifestFields(pkg) {
  const missing = RECOMMENDED_MANIFEST_FIELDS.filter((field) => {
    const value = pkg.manifest[field]
    if (value === undefined || value === null) return true
    if (Array.isArray(value)) return value.length === 0
    return String(value).trim() === ''
  })
  return missing.length === 0
    ? { ok: true }
    : {
        ok: false,
        message: `${pkg.name} package.json has no ${missing.join(', ')}`,
        hint: 'npm falls back to "UNLICENSED" and hides repo/issue links without these.'
      }
}

export { REPO_ROOT }
