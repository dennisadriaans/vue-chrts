/**
 * Unit tests for the pure parts of the release tool — semver bumps, dist-tag
 * derivation, tag parsing, CHANGELOG assembly, workspace discovery and the
 * package.json version write. The interactive orchestrator is covered by
 * `pnpm release:dry`.
 *
 *   node --test tools/release/release.test.mjs
 */

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'

import {
  bumpPrerelease,
  compare,
  distTagFor,
  highest,
  isSemver,
  nextVersion,
  prereleaseId
} from './version.mjs'
import { parseTag, tagFor } from './config.mjs'
import {
  buildReleaseBody,
  commitSections,
  compareUrl,
  parseConventional,
  releaseHeading,
  renderChangelog,
  skippedCommits,
  splitChangelog
} from './changelog.mjs'
import { writeVersion } from './publish.mjs'
import { listPackages, workspaceDependencies, workspaceDependents } from './workspace.mjs'

const CHANGELOG_WITH_UNRELEASED = `# Changelog

All notable changes are documented in this file.

## Unreleased

- Donut type is reactive again.
- Multi-axis support landed.

## [2.2.0](https://example.test/compare) (2026-07-18)

Older notes.
`

// What commit-and-tag-version left behind in this repo: no Unreleased heading.
const CHANGELOG_GENERATED = `# Changelog

All notable changes to this project will be documented in this file.

## [2.2.1](https://github.com/dennisadriaans/vue-chrts/compare/a...b) (2026-07-23)

### Bug Fixes

* merge ([879b390](https://example.test/commit/879b390))
`

const COMMITS = [
  { sha: 'a'.repeat(40), short: 'aaaaaaa', subject: 'feat(vue): multi-axis support (#134)', body: '' },
  { sha: 'b'.repeat(40), short: 'bbbbbbb', subject: 'fix: make DonutChart type reactive', body: '' },
  { sha: 'c'.repeat(40), short: 'ccccccc', subject: 'chore: bump deps', body: '' },
  { sha: 'd'.repeat(40), short: 'ddddddd', subject: 'feat!: drop Vue 2 support', body: '' },
  { sha: 'e'.repeat(40), short: 'eeeeeee', subject: 'refactor: split renderer', body: 'BREAKING CHANGE: renderer moved.' },
  { sha: 'f'.repeat(40), short: 'fffffff', subject: 'merge branch main', body: '' }
]

const FRAGMENTS = [
  { file: 'a.md', slug: 'a', title: 'Checks', status: 'done', area: 'feature', body: 'Body A.' },
  { file: 'b.md', slug: 'b', title: 'Tool rows', status: null, area: 'ui', body: 'Body B.' }
]

test('semver bumps', () => {
  assert.equal(nextVersion('0.1.0', 'patch'), '0.1.1')
  assert.equal(nextVersion('0.1.0', 'minor'), '0.2.0')
  assert.equal(nextVersion('0.1.0', 'major'), '1.0.0')
  assert.equal(nextVersion('0.1.0', 'prerelease-beta'), '0.1.1-beta.0')
  assert.equal(nextVersion('0.1.1-beta.0', 'prerelease-beta'), '0.1.1-beta.1')
  assert.equal(nextVersion('3.0.0-beta.2', 'prerelease-beta'), '3.0.0-beta.3')
  assert.equal(nextVersion('0.1.1-beta.3', 'prerelease-rc'), '0.1.1-rc.0')
  // A prerelease promotes to its own number rather than skipping one.
  assert.equal(nextVersion('0.1.1-rc.2', 'patch'), '0.1.1')
  assert.equal(bumpPrerelease('1.0.0', 'beta'), '1.0.1-beta.0')
})

test('semver ordering', () => {
  assert.equal(compare('1.0.0', '1.0.1'), -1)
  assert.equal(compare('1.0.0-beta.1', '1.0.0'), -1)
  assert.equal(compare('1.0.0-beta.2', '1.0.0-beta.10'), -1)
  assert.equal(highest(['0.9.0', '1.2.0', '1.10.0', '1.2.0-rc.1']), '1.10.0')
  assert.equal(isSemver('v1.0.0'), false)
  assert.equal(isSemver('1.0.0'), true)
})

test('npm dist-tag follows the prerelease id', () => {
  assert.equal(distTagFor('2.2.3'), 'latest')
  assert.equal(distTagFor('3.0.0-beta.2'), 'beta')
  assert.equal(distTagFor('3.0.0-rc.1'), 'rc')
  // A numeric-only prerelease has no id to name a channel after.
  assert.equal(prereleaseId('3.0.0-1'), null)
  assert.equal(distTagFor('3.0.0-1'), 'next')
})

test('tags are scoped to a package', () => {
  assert.equal(tagFor('vue-chrts', '2.2.3'), 'vue-chrts@2.2.3')
  assert.deepEqual(parseTag('vue-chrts@2.2.3'), { name: 'vue-chrts', version: '2.2.3' })
  assert.deepEqual(parseTag('@scope/pkg@1.0.0'), { name: '@scope/pkg', version: '1.0.0' })
  // A legacy flat tag is not a scoped tag.
  assert.equal(parseTag('v2.2.0'), null)
})

test('conventional commits are parsed and grouped', () => {
  const feat = parseConventional(COMMITS[0])
  assert.equal(feat.type, 'feat')
  assert.equal(feat.scope, 'vue')
  assert.equal(feat.breaking, false)

  assert.equal(parseConventional(COMMITS[3]).breaking, true)
  // A BREAKING CHANGE footer counts even without the `!`.
  assert.equal(parseConventional(COMMITS[4]).breaking, true)
  assert.equal(parseConventional(COMMITS[5]).type, null)

  const sections = commitSections(COMMITS)
  assert.match(sections, /### ⚠ BREAKING CHANGES/)
  assert.match(sections, /### Features/)
  assert.match(sections, /### Bug Fixes/)
  assert.doesNotMatch(sections, /bump deps/)
  assert.ok(sections.indexOf('BREAKING') < sections.indexOf('### Features'))
  assert.ok(sections.indexOf('### Features') < sections.indexOf('### Bug Fixes'))
  // Scope, issue link and commit link.
  assert.match(sections, /\*\*vue:\*\* multi-axis support \(\[#134\]\(.*issues\/134\)\) \(\[aaaaaaa\]\(.*commit\/a{40}\)\)/)
  // A breaking commit appears once, in the breaking section only.
  assert.equal(sections.match(/drop Vue 2 support/g).length, 1)

  const skipped = skippedCommits(COMMITS).map((e) => e.commit.short)
  assert.deepEqual(skipped, ['ccccccc', 'fffffff'])
})

test('splitChangelog isolates the Unreleased body', () => {
  const split = splitChangelog(CHANGELOG_WITH_UNRELEASED)
  assert.match(split.head, /^# Changelog/)
  assert.equal(split.unreleased.split('\n').length, 2)
  assert.match(split.tail, /^## \[2\.2\.0\]/)
})

test('splitChangelog tolerates a file with no Unreleased heading', () => {
  const split = splitChangelog(CHANGELOG_GENERATED)
  assert.equal(split.unreleased, '')
  assert.match(split.head, /^# Changelog/)
  assert.doesNotMatch(split.head, /## \[2\.2\.1\]/)
  assert.match(split.tail, /^## \[2\.2\.1\]/)
})

test('splitChangelog handles a changelog with no sections at all', () => {
  const split = splitChangelog('# Changelog\n')
  assert.equal(split.unreleased, '')
  assert.equal(split.tail, '')
  assert.match(split.head, /^# Changelog/)
})

test('buildReleaseBody honours the chosen source', () => {
  const split = splitChangelog(CHANGELOG_WITH_UNRELEASED)
  const args = { unreleased: split.unreleased, fragments: FRAGMENTS, commits: COMMITS }

  const bullets = buildReleaseBody({ ...args, mode: 'unreleased' })
  assert.match(bullets, /Donut type is reactive/)
  assert.doesNotMatch(bullets, /Body A/)
  assert.doesNotMatch(bullets, /### Features/)

  const fromCommits = buildReleaseBody({ ...args, mode: 'commits' })
  assert.match(fromCommits, /### Features/)
  assert.doesNotMatch(fromCommits, /Donut type is reactive/)

  const long = buildReleaseBody({ ...args, mode: 'fragments' })
  assert.match(long, /### Features\n\n\*\*Checks\*\*\n\nBody A\./)
  assert.match(long, /### UI/)
  assert.doesNotMatch(long, /Donut type is reactive/)

  assert.equal(buildReleaseBody({ ...args, mode: 'none' }), '')

  const withSummary = buildReleaseBody({
    ...args,
    mode: 'unreleased',
    summary: 'Patch release.'
  })
  assert.match(withSummary, /^Patch release\./)
})

test('renderChangelog inserts the section and empties Unreleased', () => {
  const split = splitChangelog(CHANGELOG_WITH_UNRELEASED)
  const url = compareUrl('vue-chrts@2.2.0', 'vue-chrts@2.2.1')
  const out = renderChangelog({
    version: '2.2.1',
    date: '2026-08-13',
    body: buildReleaseBody({ mode: 'unreleased', unreleased: split.unreleased }),
    split,
    url
  })

  assert.match(out, /^# Changelog/)
  assert.match(out, /## Unreleased\n\n## \[2\.2\.1\]\(.*\) \(2026-08-13\)/)
  assert.ok(out.indexOf('## [2.2.1]') < out.indexOf('## [2.2.0]'))
  assert.equal(out.match(/Donut type is reactive/g).length, 1)

  // The result is itself splittable, so consecutive releases keep working.
  const next = splitChangelog(out)
  assert.equal(next.unreleased, '')
  assert.match(next.tail, /^## \[2\.2\.1\]/)
})

test('renderChangelog works on a changelog that never had an Unreleased heading', () => {
  const split = splitChangelog(CHANGELOG_GENERATED)
  const out = renderChangelog({
    version: '2.2.2',
    date: '2026-08-13',
    body: '* something',
    split
  })
  assert.match(out, /^# Changelog/)
  assert.ok(out.indexOf('## [2.2.2]') < out.indexOf('## [2.2.1]'))
  assert.equal(releaseHeading('1.2.3', '2026-01-01'), '## [1.2.3] (2026-01-01)')
  // `@` in a tag has to survive into the compare URL.
  assert.match(compareUrl('a@1.0.0', 'a@1.1.0'), /compare\/a@1\.0\.0\.\.\.a@1\.1\.0$/)
  // The `/` of a scoped name would otherwise split the URL path.
  assert.match(compareUrl('@s/a@1.0.0', '@s/a@1.1.0'), /compare\/@s%2Fa@1\.0\.0\.\.\.@s%2Fa@1\.1\.0$/)
  assert.equal(compareUrl(null, 'a@1.1.0'), null)
})

test('writeVersion inserts a missing version right after name', () => {
  const dir = mkdtempSync(resolve(tmpdir(), 'release-test-'))
  const file = resolve(dir, 'package.json')
  writeFileSync(file, JSON.stringify({ name: 'vue-chrts', private: true }, null, 2) + '\n')

  writeVersion(file, '0.1.0')
  assert.deepEqual(Object.keys(JSON.parse(readFileSync(file, 'utf-8'))), [
    'name',
    'version',
    'private'
  ])

  writeVersion(file, '0.2.0')
  const bumped = JSON.parse(readFileSync(file, 'utf-8'))
  assert.equal(bumped.version, '0.2.0')
  assert.deepEqual(Object.keys(bumped), ['name', 'version', 'private'])
  assert.ok(readFileSync(file, 'utf-8').endsWith('\n'))
})

test('workspace discovery finds the publishable packages', () => {
  const packages = listPackages()
  const names = packages.map((p) => p.name)
  assert.ok(names.includes('vue-chrts'))
  assert.ok(names.includes('nuxt-charts'))
  // packages/angular holds a stale dist/ with no package.json.
  assert.ok(!names.includes('angular'))
  for (const pkg of packages) assert.equal(pkg.private, false)

  const legacy = packages.find((p) => p.name === 'nuxt-charts-legacy')
  const vue = packages.find((p) => p.name === 'vue-chrts')
  assert.deepEqual(
    workspaceDependencies(legacy, packages).map((d) => d.name),
    ['vue-chrts']
  )
  assert.deepEqual(
    workspaceDependents(vue, packages).map((d) => d.name),
    ['nuxt-charts-legacy']
  )
  assert.equal(workspaceDependencies(vue, packages).length, 0)
})
