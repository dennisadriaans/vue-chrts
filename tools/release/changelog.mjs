/**
 * CHANGELOG.md assembly, per package.
 *
 * Three sources can feed a release section and they overlap by design, so the
 * choice is the operator's — the tool never silently concatenates them, because
 * that double-lists every entry:
 *
 *   commits      — conventional commits since the last tag, grouped by type.
 *                  This repo already writes `fix(vue): …` / `feat: …`, which is
 *                  what commit-and-tag-version used to consume.
 *   unreleased   — a hand-written `## Unreleased` section in CHANGELOG.md.
 *   fragments    — one long-form markdown file per change in `changelog.d/`.
 *
 * The rendered heading matches what commit-and-tag-version already wrote into
 * these files (`## [2.2.1](compare-url) (2026-07-23)`) so a package's history
 * stays visually consistent across the switch.
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'
import { runOrThrow } from './exec.mjs'
import { GITHUB_REPO, REPO_ROOT, tagPath } from './config.mjs'

const UNRELEASED_HEADING = '## Unreleased'

const AREA_LABELS = {
  feature: 'Features',
  ui: 'UI',
  fix: 'Fixes',
  project: 'Project',
  docs: 'Docs',
  other: 'Other'
}
const AREA_ORDER = ['feature', 'ui', 'fix', 'project', 'docs', 'other']

/** Conventional-commit types worth publishing, in the order they are rendered. */
const COMMIT_TYPES = [
  { type: 'feat', label: 'Features' },
  { type: 'fix', label: 'Bug Fixes' },
  { type: 'perf', label: 'Performance' },
  { type: 'revert', label: 'Reverts' },
  { type: 'refactor', label: 'Refactors' },
  { type: 'docs', label: 'Documentation' }
]
const PUBLISHED_TYPES = new Set(COMMIT_TYPES.map((t) => t.type))

const CONVENTIONAL = /^(\w+)(?:\(([^)]*)\))?(!)?:\s*(.+)$/

// ── conventional commits ────────────────────────────────────────────────────

export function parseConventional(commit) {
  const match = CONVENTIONAL.exec(commit.subject)
  const breakingFooter = /^BREAKING[ -]CHANGE:/m.test(commit.body ?? '')
  if (!match) {
    return { type: null, scope: null, breaking: breakingFooter, subject: commit.subject, commit }
  }
  return {
    type: match[1].toLowerCase(),
    scope: match[2] || null,
    breaking: Boolean(match[3]) || breakingFooter,
    subject: match[4].trim(),
    commit
  }
}

function commitLink(commit) {
  return `([${commit.short}](https://github.com/${GITHUB_REPO}/commit/${commit.sha}))`
}

/** `(#144)` in a subject is a merged PR; link it the way GitHub's UI does. */
function linkIssues(text) {
  return text.replace(
    /\(#(\d+)\)/g,
    (_, n) => `([#${n}](https://github.com/${GITHUB_REPO}/issues/${n}))`
  )
}

function renderEntry(entry) {
  const scope = entry.scope ? `**${entry.scope}:** ` : ''
  return `* ${scope}${linkIssues(entry.subject)} ${commitLink(entry.commit)}`
}

/**
 * Group commits into markdown sections. Commits with no recognised type
 * (`chore:`, `ci:`, bare subjects) are dropped unless they are breaking —
 * release notes are for consumers of the package, not for its history.
 */
export function commitSections(commits) {
  const entries = commits.map(parseConventional)
  const out = []

  const breaking = entries.filter((e) => e.breaking)
  if (breaking.length) {
    out.push('### ⚠ BREAKING CHANGES')
    out.push(breaking.map(renderEntry).join('\n'))
  }

  for (const { type, label } of COMMIT_TYPES) {
    const group = entries.filter((e) => e.type === type && !e.breaking)
    if (!group.length) continue
    out.push(`### ${label}`)
    out.push(group.map(renderEntry).join('\n'))
  }
  return out.join('\n\n')
}

/** Commits that would not appear in the notes, so the operator can see what was dropped. */
export function skippedCommits(commits) {
  return commits.map(parseConventional).filter((e) => !e.breaking && !PUBLISHED_TYPES.has(e.type))
}

// ── changelog.d fragments ───────────────────────────────────────────────────

function titleFromSlug(slug) {
  const words = slug.replace(/[-_]+/g, ' ').trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function parseFrontmatter(raw) {
  if (!raw.startsWith('---\n')) return { meta: {}, body: raw.trim() }
  const end = raw.indexOf('\n---', 4)
  if (end === -1) return { meta: {}, body: raw.trim() }
  const block = raw.slice(4, end)
  const body = raw.slice(raw.indexOf('\n', end + 1) + 1)
  const meta = {}
  for (const line of block.split('\n')) {
    const match = /^([A-Za-z_][A-Za-z0-9_-]*):\s*(.*)$/.exec(line.trim())
    if (match) meta[match[1]] = match[2].replace(/^["']|["']$/g, '').trim()
  }
  return { meta, body: body.trim() }
}

export function readFragments(pkg) {
  if (!existsSync(pkg.changelogDir)) return []
  return readdirSync(pkg.changelogDir)
    .filter((f) => f.endsWith('.md'))
    .sort()
    .map((file) => {
      const path = resolve(pkg.changelogDir, file)
      const slug = basename(file, '.md')
      const { meta, body } = parseFrontmatter(readFileSync(path, 'utf-8'))
      return {
        path,
        file,
        slug,
        title: meta.title || titleFromSlug(slug),
        status: meta.status || null,
        area: (meta.area || 'other').toLowerCase(),
        body
      }
    })
}

function fragmentSections(fragments) {
  const groups = new Map()
  for (const fragment of fragments) {
    const key = AREA_ORDER.includes(fragment.area) ? fragment.area : 'other'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(fragment)
  }
  const out = []
  for (const area of AREA_ORDER) {
    const group = groups.get(area)
    if (!group?.length) continue
    out.push(`### ${AREA_LABELS[area]}`)
    for (const fragment of group) out.push(`**${fragment.title}**\n\n${fragment.body}`)
  }
  return out.join('\n\n')
}

/**
 * Remove folded fragments from the index; `changelog.d/` itself survives with a
 * `.gitkeep` so contributors still have somewhere to drop new files.
 */
export async function archiveFragments(pkg, fragments) {
  if (!fragments.length) return []
  const relPaths = fragments.map((f) => `${pkg.relDir}/changelog.d/${f.file}`)
  await runOrThrow('git', ['rm', '--quiet', '--', ...relPaths], { cwd: REPO_ROOT })

  const remaining = readdirSync(pkg.changelogDir).filter((f) => f !== '.DS_Store')
  if (remaining.length === 0) {
    writeFileSync(resolve(pkg.changelogDir, '.gitkeep'), '')
    await runOrThrow('git', ['add', '--', `${pkg.relDir}/changelog.d/.gitkeep`], { cwd: REPO_ROOT })
  }
  return [`${pkg.relDir}/changelog.d`]
}

// ── CHANGELOG.md ────────────────────────────────────────────────────────────

const EMPTY_CHANGELOG = `# Changelog

All notable changes to this project are documented in this file.
`

export function readChangelog(pkg) {
  return existsSync(pkg.changelogPath)
    ? readFileSync(pkg.changelogPath, 'utf-8')
    : EMPTY_CHANGELOG
}

/**
 * Split CHANGELOG.md around its `## Unreleased` section:
 *   head        — everything before it (title + preamble)
 *   unreleased  — the section body
 *   tail        — the previous release heading onward
 *
 * The heading is optional. None of this repo's changelogs carry one (they were
 * generated by commit-and-tag-version), so a missing heading splits at the
 * first release section instead of failing the release.
 */
export function splitChangelog(text) {
  const headingIdx = text.indexOf(UNRELEASED_HEADING)
  if (headingIdx === -1) {
    const firstSection = text.search(/(^|\n)## /)
    if (firstSection === -1) return { head: text.trimEnd() + '\n\n', unreleased: '', tail: '' }
    const cut = text[firstSection] === '\n' ? firstSection + 1 : firstSection
    return { head: text.slice(0, cut), unreleased: '', tail: text.slice(cut) }
  }
  const rest = text.slice(headingIdx + UNRELEASED_HEADING.length)
  const nextHeading = rest.search(/\n## /)
  const unreleased = nextHeading === -1 ? rest.trim() : rest.slice(0, nextHeading).trim()
  const tail = nextHeading === -1 ? '' : rest.slice(nextHeading + 1)
  return { head: text.slice(0, headingIdx), unreleased, tail }
}

/**
 * @param {'commits'|'unreleased'|'fragments'|'none'} mode
 */
export function buildReleaseBody({ mode, commits = [], unreleased, fragments = [], summary }) {
  const parts = []
  if (summary) parts.push(summary.trim())
  if (mode === 'commits') {
    const sections = commitSections(commits)
    if (sections) parts.push(sections)
  }
  if (mode === 'unreleased' && unreleased) parts.push(unreleased)
  if (mode === 'fragments') {
    const sections = fragmentSections(fragments)
    if (sections) parts.push(sections)
  }
  return parts.join('\n\n').trim()
}

export function compareUrl(previousTag, tag, repo = GITHUB_REPO) {
  if (!previousTag) return null
  return `https://github.com/${repo}/compare/${tagPath(previousTag)}...${tagPath(tag)}`
}

export function releaseHeading(version, date, url) {
  return url ? `## [${version}](${url}) (${date})` : `## [${version}] (${date})`
}

/** CHANGELOG.md with the release section inserted and `## Unreleased` emptied. */
export function renderChangelog({ version, date, body, split, url }) {
  const { head, tail } = split
  const section = `${releaseHeading(version, date, url)}\n\n${body}\n`
  const tailBlock = tail ? `\n${tail.trimEnd()}\n` : ''
  return `${head}${UNRELEASED_HEADING}\n\n${section}${tailBlock}`
}

export function writeChangelog(pkg, text) {
  writeFileSync(pkg.changelogPath, text)
}

/** Release notes for `gh release create`, without the markdown heading. */
export function notesForGithub({ body, url }) {
  return url ? `${body}\n\n**Full changelog**: ${url}\n` : `${body}\n`
}
