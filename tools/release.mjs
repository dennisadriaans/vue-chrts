#!/usr/bin/env node
/**
 * Guided release CLI for the vue-chrts monorepo.
 *
 * One git repository, several publishable packages under `packages/*`, so a
 * release is always scoped to a single package: a semver number, a CHANGELOG
 * section, the verification gates, a commit, an annotated `name@version` tag, a
 * push, an npm publish and a GitHub Release.
 *
 * Walks the operator chronologically through:
 *   0. Preflight (repo, remote, branch, clean tree, credentials, metadata)
 *   1. Package selection
 *   2. Change detection (commits touching the package since its last tag)
 *   3. Version plan (git tag · npm · package.json, then a bump kind)
 *   4. Release notes (conventional commits, ## Unreleased, or changelog.d/)
 *   5. Verification (turbo typecheck · test · build, scoped to the package)
 *   6. Commit + annotated tag
 *   7. Push branch + tag
 *   8. npm publish (dist-tag derived from the version)
 *   9. GitHub Release from the same notes
 *
 * Flags:
 *   --package <name>  Skip the picker (`vue-chrts`, `nuxt-charts`, …).
 *   --bump <kind>     staged | patch | minor | major | prerelease-beta | prerelease-rc.
 *   --version <x.y.z> An explicit version, overriding --bump.
 *   --notes <source>  existing | commits | unreleased | fragments | none.
 *   --dry-run         No writes, no git writes, no network. Walks the prompts.
 *   --skip-verify     Skip typecheck/test/build.
 *   --no-push         Commit and tag locally, push nothing (implies --no-npm).
 *   --no-npm          Do everything except publish to the registry.
 *   --all-commits     Do not filter change detection to the package directory.
 *   --yes             Answer prompts with their defaults (needed without a TTY).
 */

import process from 'node:process'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

import {
  allowNonInteractive,
  ask,
  closePrompts,
  color,
  confirm,
  divider,
  fail,
  heading,
  info,
  ok,
  openInEditor,
  panic,
  select,
  warn
} from './release/ui.mjs'
import {
  checkBranch,
  checkCleanTree,
  checkGhCli,
  checkGitRepo,
  checkLicenseFilled,
  checkManifestFields,
  checkNpmAuth,
  checkOrigin,
  checkPackageFiles,
  checkRepoFiles,
  checkTrackedSecrets,
  checkUpToDateWithRemote
} from './release/preflight.mjs'
import { findPackage, listPackages, workspaceDependencies } from './release/workspace.mjs'
import { detectChanges, highestReleasedVersion } from './release/detect-changes.mjs'
import { compare, distTagFor, isSemver, nextVersion, RELEASE_KIND_OPTIONS } from './release/version.mjs'
import {
  archiveFragments,
  buildReleaseBody,
  compareUrl,
  extractSection,
  notesForGithub,
  readChangelog,
  readFragments,
  releaseHeading,
  renderChangelog,
  skippedCommits,
  splitChangelog,
  writeChangelog
} from './release/changelog.mjs'
import {
  commitRelease,
  createGithubRelease,
  dirtyFiles,
  ensureTagFree,
  githubReleaseExists,
  pushBranchAndTag,
  runVerify,
  tagRelease,
  writeNotesFile,
  writeVersion
} from './release/publish.mjs'
import { distTags, highestPublished, isPublished, publishPackage } from './release/npm.mjs'
import { GITHUB_REPO, RELEASE_BRANCH, tagFor, tagPath, VERIFY_STEPS } from './release/config.mjs'

const argv = process.argv.slice(2)
const DRY_RUN = argv.includes('--dry-run')
const SKIP_VERIFY = argv.includes('--skip-verify')
const NO_PUSH = argv.includes('--no-push')
// An unpushed tag makes a published version unreproducible, so skipping the
// push skips the registry too.
const NO_NPM = argv.includes('--no-npm') || NO_PUSH
const ALL_COMMITS = argv.includes('--all-commits')

function flagValue(name) {
  const inline = argv.find((a) => a.startsWith(`${name}=`))
  if (inline) return inline.slice(name.length + 1)
  const idx = argv.indexOf(name)
  return idx !== -1 ? argv[idx + 1] : null
}

// A dry run writes nothing, so answering its prompts with defaults is safe;
// a real headless run has to say --yes on purpose.
if (DRY_RUN || argv.includes('--yes')) allowNonInteractive()

function today() {
  const now = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function preview(body, maxLines = 24) {
  const lines = body.split('\n')
  for (const line of lines.slice(0, maxLines)) console.log(color.dim(`  │ ${line}`))
  if (lines.length > maxLines) {
    console.log(color.dim(`  │ … ${lines.length - maxLines} more line(s)`))
  }
}

/** Fatal on failure. */
function must(result, okMessage) {
  if (!result.ok) panic(`${result.message} ${color.dim(result.hint ?? '')}`)
  ok(okMessage)
}

/** Warn on failure and let the operator decide. */
async function soft(result, okMessage, { question = 'Continue anyway?', defaultYes = false } = {}) {
  if (result.ok) {
    ok(okMessage)
    return true
  }
  warn(result.message)
  if (result.hint) info(result.hint)
  if (!(await confirm(question, defaultYes))) process.exit(1)
  return false
}

;(async function main() {
  console.log(color.bold('\nvue-chrts — guided release\n'))
  if (DRY_RUN) warn('DRY RUN — nothing is written, committed, pushed or published.\n')

  // ── 0. Preflight ─────────────────────────────────────────────────────────
  heading('Preflight')

  must(await checkGitRepo(), 'Inside a git repository')
  const remote = await checkOrigin()
  must(remote, `origin → ${remote.url}`)
  must(await checkTrackedSecrets(), 'No env files tracked')
  must(checkRepoFiles(), 'LICENSE + README present')
  await soft(checkLicenseFilled(), 'LICENSE has a real copyright holder')

  const branchCheck = await checkBranch(RELEASE_BRANCH)
  await soft(branchCheck, `On branch ${branchCheck.branch}`, {
    question: 'Release from this branch?'
  })
  const branch = branchCheck.branch ?? RELEASE_BRANCH

  if (DRY_RUN) info('Skipped clean-tree check (dry run)')
  else await soft(await checkCleanTree(), 'Working tree clean')

  await soft(await checkUpToDateWithRemote(branch), `Up to date with origin/${branch}`)

  const gh = await checkGhCli()
  if (gh.ok) ok(`gh ready (${gh.version})`)
  else {
    warn(gh.message)
    if (gh.hint) info(gh.hint)
  }

  const npmAuth = await checkNpmAuth()
  if (npmAuth.ok) ok(`npm ready (${npmAuth.user})`)
  else {
    warn(npmAuth.message)
    if (npmAuth.hint) info(npmAuth.hint)
  }

  // ── 1. Package ───────────────────────────────────────────────────────────
  heading('Package')

  const packages = listPackages()
  if (!packages.length) panic('No publishable packages found under packages/*.')

  const requested = flagValue('--package')
  let pkg
  if (requested) {
    pkg = findPackage(requested)
    if (!pkg) panic(`Unknown package: ${requested} (have ${packages.map((p) => p.name).join(', ')})`)
  } else if (packages.length === 1) {
    pkg = packages[0]
  } else {
    const name = await select(
      'Which package?',
      packages.map((p) => ({
        label: p.name,
        value: p.name,
        hint: `${p.relDir} · ${p.version ?? 'no version'}`
      }))
    )
    pkg = findPackage(name)
  }
  ok(`Releasing ${color.bold(pkg.name)} ${color.dim(`(${pkg.relDir})`)}`)

  await soft(checkPackageFiles(pkg), `${pkg.relDir} has README + CHANGELOG`)
  await soft(checkManifestFields(pkg), `${pkg.name} package.json metadata complete`)

  // pnpm rewrites `workspace:*` to the dependency's current version while
  // packing, so publishing ahead of a workspace dependency ships a tarball that
  // resolves to a version nobody can install.
  for (const dep of workspaceDependencies(pkg, packages)) {
    if (!dep.version) continue
    if (await isPublished(dep.name, dep.version)) {
      ok(`Dependency ${dep.name}@${dep.version} is on npm`)
    } else {
      warn(`${pkg.name} depends on ${dep.name} (${dep.range}); ${dep.name}@${dep.version} is not published.`)
      info(`pnpm will pin it to ${dep.version} while packing — release ${dep.name} first.`)
      if (!(await confirm('Continue anyway?', false))) process.exit(1)
    }
  }

  // ── 2. Changes ───────────────────────────────────────────────────────────
  heading('Changes since the last release')

  const change = await detectChanges(pkg, { scoped: !ALL_COMMITS })
  const fragments = readFragments(pkg)
  const changelogText = readChangelog(pkg)
  // Re-split once the version is known: a section already staged for it is
  // lifted out of the file rather than left to collide with the new heading.
  let split = splitChangelog(changelogText)

  info(`Last tag:          ${change.lastTag ?? color.dim('(none — first scoped release)')}`)
  info(
    `Commits:           ${change.commits.length}` +
      (ALL_COMMITS ? '' : color.dim(` in ${pkg.relDir} (${change.totalCommits} repo-wide)`))
  )
  info(`changelog.d files: ${fragments.length}`)
  info(
    `## Unreleased:     ${split.unreleased ? `${split.unreleased.split('\n').filter(Boolean).length} line(s)` : color.dim('(empty)')}`
  )

  if (!change.changed) {
    warn('No commits touching this package since its last release tag.')
    if (!(await confirm('Release anyway?', false))) process.exit(0)
  }

  for (const commit of change.commits.slice(0, 15)) {
    info(color.dim(`${commit.short} ${commit.subject}`))
  }
  if (change.commits.length > 15) info(color.dim(`… ${change.commits.length - 15} more`))

  // ── 3. Version ───────────────────────────────────────────────────────────
  heading('Version')

  const taggedVersion = await highestReleasedVersion(pkg)
  const publishedVersion = await highestPublished(pkg.name)
  const tags = await distTags(pkg.name)
  const manifestVersion = pkg.version

  info(`git tag:      ${taggedVersion ? color.bold(taggedVersion) : color.dim('(none)')}`)
  info(
    `npm:          ${publishedVersion ? color.bold(publishedVersion) : color.dim('(not published)')}` +
      (tags ? color.dim(`  ${Object.entries(tags).map(([t, v]) => `${t}=${v}`).join(' ')}`) : '')
  )
  info(`package.json: ${manifestVersion ? color.bold(manifestVersion) : color.dim('(none)')}`)

  // Only a tag or a registry entry burns a version. package.json is often
  // staged ahead of a release (a rewrite carrying its own version through
  // several unpublished betas), so it seeds the suggestion, never the floor.
  const released = [taggedVersion, publishedVersion].filter(Boolean)
  const base = released.length
    ? released.reduce((best, v) => (compare(v, best) > 0 ? v : best))
    : null

  if (base && released.some((v) => v !== base)) {
    warn(`Tag and registry disagree; bumping from the highest (${base}) so no version is burned twice.`)
  }

  const ahead =
    manifestVersion && (!base || compare(manifestVersion, base) > 0) ? manifestVersion : null
  const staged = ahead && !(await isPublished(pkg.name, ahead)) ? ahead : null
  if (staged) info(`package.json is staged at ${color.bold(staged)}, ahead of anything released.`)

  const kindOptions = staged
    ? [
        { label: `staged — ${staged}`, value: 'staged', hint: 'ship the version in package.json' },
        ...RELEASE_KIND_OPTIONS
      ]
    : RELEASE_KIND_OPTIONS

  const forcedVersion = flagValue('--version')
  const forcedBump = flagValue('--bump')
  if (forcedBump && !kindOptions.some((o) => o.value === forcedBump)) {
    panic(`Unknown --bump ${forcedBump} (have ${kindOptions.map((o) => o.value).join(', ')})`)
  }

  let suggested
  if (forcedVersion) {
    suggested = forcedVersion
  } else if (base || staged) {
    const kind = forcedBump ?? (await select('Release kind?', kindOptions))
    suggested = kind === 'staged' ? staged : nextVersion(base ?? staged, kind)
  } else {
    suggested = manifestVersion ?? '0.1.0'
    info('First release — pick the starting version.')
  }

  const version = (await ask('Version', suggested)).trim().replace(/^v/, '')
  if (!isSemver(version)) panic(`Not a valid semver version: ${version}`)
  if (base && compare(version, base) <= 0) {
    panic(`${version} is not greater than ${base}.`)
  }
  if (await isPublished(pkg.name, version)) {
    panic(`${pkg.name}@${version} is already on npm. Versions are immutable there.`)
  }

  const tag = tagFor(pkg.name, version)
  if (!DRY_RUN) await ensureTagFree(tag)

  const distTag = distTagFor(version)
  ok(`Releasing ${color.bold(color.green(tag))} ${color.dim(`(npm dist-tag: ${distTag})`)}`)

  if (distTag === 'latest' && publishedVersion && compare(version, publishedVersion) < 0) {
    warn(`npm 'latest' would move backwards from ${publishedVersion}.`)
    if (!(await confirm('Continue?', false))) process.exit(1)
  }

  // ── 4. Release notes ─────────────────────────────────────────────────────
  heading('Release notes')

  const existing = extractSection(changelogText, version)
  if (existing) {
    split = splitChangelog(existing.text)
    info(`CHANGELOG.md already has a ## ${version} section — it will be re-emitted, not duplicated.`)
  }

  const noteOptions = []
  if (existing?.body) {
    noteOptions.push({
      label: `existing ## ${version} section`,
      value: 'existing',
      hint: 'the notes already written for this version'
    })
  }
  if (change.commits.length) {
    noteOptions.push({
      label: 'conventional commits',
      value: 'commits',
      hint: `${change.commits.length} commit(s), grouped by feat/fix/perf`
    })
  }
  if (split.unreleased) {
    noteOptions.push({ label: '## Unreleased', value: 'unreleased', hint: 'the hand-written section' })
  }
  if (fragments.length) {
    noteOptions.push({
      label: 'changelog.d/ fragments',
      value: 'fragments',
      hint: `${fragments.length} long-form entr(ies)`
    })
  }
  noteOptions.push({ label: 'write from scratch', value: 'none', hint: 'opens an empty draft' })

  const forcedNotes = flagValue('--notes')
  if (forcedNotes && !noteOptions.some((o) => o.value === forcedNotes)) {
    panic(`--notes ${forcedNotes} is unavailable here (have ${noteOptions.map((o) => o.value).join(', ')})`)
  }
  const mode =
    forcedNotes ??
    (noteOptions.length === 1 ? 'none' : await select('Build the release section from?', noteOptions))

  const dropped = mode === 'commits' ? skippedCommits(change.commits) : []
  if (dropped.length) {
    info(color.dim(`${dropped.length} commit(s) left out (chore/ci/test/style/build/untyped):`))
    for (const entry of dropped.slice(0, 8)) info(color.dim(`  ${entry.commit.short} ${entry.subject}`))
  }

  const summary = await ask('One-line summary for the top of the section (blank for none)', '')

  let body = buildReleaseBody({
    mode,
    commits: change.commits,
    unreleased: split.unreleased,
    existing: existing?.body,
    fragments,
    summary
  })

  const url = compareUrl(change.lastTag, tag)
  const draftPath = writeNotesFile(body ? `${body}\n` : '')
  divider()
  console.log(color.bold(`  ${releaseHeading(version, today(), url)}`))
  preview(body || '(empty)')
  divider()

  // $EDITOR needs a terminal to hand stdin to.
  const canEdit = Boolean(process.stdin.isTTY && process.stdout.isTTY)
  if (canEdit && (await confirm('Edit the draft in $EDITOR?', mode === 'none'))) {
    await openInEditor(draftPath)
    body = readFileSync(draftPath, 'utf-8').trim()
    divider()
    preview(body || '(empty)')
    divider()
  }

  if (!body) panic('Release notes are empty. Aborting.')
  writeFileSync(draftPath, `${body}\n`)

  let foldFragments = false
  if (fragments.length) {
    foldFragments = await confirm(
      `Delete the ${fragments.length} changelog.d/ file(s) as part of this release?`,
      mode === 'fragments'
    )
    if (!foldFragments) warn('Fragments stay in changelog.d/ and show up again next release.')
  }

  // ── 5. Verification ──────────────────────────────────────────────────────
  heading('Verification')
  const verifyLabel = VERIFY_STEPS.map((s) => s.label).join(' · ')
  if (SKIP_VERIFY) {
    warn(`--skip-verify — ${verifyLabel} not run.`)
  } else if (DRY_RUN) {
    info(`[dry-run] would run turbo ${verifyLabel} --filter=${pkg.name}`)
  } else if (await confirm(`Run ${verifyLabel} for ${pkg.name}?`, true)) {
    await runVerify(pkg)
    ok('All verification steps passed')
  } else {
    warn('Verification skipped by operator.')
  }

  const releaseFiles = [`${pkg.relDir}/package.json`, `${pkg.relDir}/CHANGELOG.md`]
  if (existsSync(pkg.changelogDir)) releaseFiles.push(`${pkg.relDir}/changelog.d`)

  // A build can regenerate committed artefacts (declaration files, lockfile
  // churn); those belong in the release commit rather than dangling after it.
  const extraFiles = []
  if (!DRY_RUN) {
    const dirty = (await dirtyFiles()).filter(
      (f) => !releaseFiles.some((known) => f.startsWith(known))
    )
    if (dirty.length) {
      warn(`${dirty.length} other file(s) are modified:`)
      for (const file of dirty) info(color.dim(file))
      if (await confirm('Include them in the release commit?', true)) extraFiles.push(...dirty)
    }
  }

  // ── 6. Commit + tag ──────────────────────────────────────────────────────
  heading('Commit + tag')

  const commitFiles = [...releaseFiles, ...extraFiles]
  divider()
  console.log(color.bold('  Ready to release:'))
  info(`  Package:   ${pkg.name}`)
  info(`  Version:   ${manifestVersion ?? '—'} → ${version}`)
  info(`  Tag:       ${tag} ${color.dim('(annotated)')}`)
  info(`  Branch:    ${branch}`)
  info(`  Repo:      ${GITHUB_REPO}`)
  info(`  npm:       ${NO_NPM ? color.dim('skipped') : `publish under '${distTag}'`}`)
  info(`  Files:     ${commitFiles.join(', ')}`)
  info(`  Fragments: ${foldFragments ? `${fragments.length} removed` : 'kept'}`)
  divider()

  if (!(await confirm('Write version + changelog, commit and tag?', true))) {
    warn('Aborted before any write. Nothing changed.')
    process.exit(0)
  }

  if (DRY_RUN) {
    ok(`[dry-run] would write ${pkg.relDir}/package.json version → ${version}`)
    ok(`[dry-run] would fold the release section into ${pkg.relDir}/CHANGELOG.md`)
    if (foldFragments) ok(`[dry-run] would git rm ${fragments.length} changelog.d file(s)`)
    ok(`[dry-run] would commit "chore(release): ${tag}" and tag ${tag}`)
  } else {
    writeVersion(pkg.pkgJsonPath, version)
    ok(`${pkg.relDir}/package.json → ${version}`)

    writeChangelog(pkg, renderChangelog({ version, date: today(), body, split, url }))
    ok(`${pkg.relDir}/CHANGELOG.md updated`)

    if (foldFragments) {
      await archiveFragments(pkg, fragments)
      ok(`Removed ${fragments.length} changelog.d file(s)`)
    }

    const committed = await commitRelease({
      files: commitFiles,
      message: `chore(release): ${tag}`
    })
    ok(committed ? `Committed chore(release): ${tag}` : 'Nothing to commit — tagging HEAD')

    await tagRelease(tag, tag)
    ok(`Tagged ${tag}`)
  }

  // ── 7. Push ──────────────────────────────────────────────────────────────
  let pushed = false
  heading('Push')
  if (NO_PUSH) {
    warn('--no-push — branch and tag stay local.')
  } else if (DRY_RUN) {
    ok(`[dry-run] would push ${branch} + ${tag} to ${GITHUB_REPO}`)
  } else {
    console.log(`  ${color.yellow('This publishes the commit and tag to')} ${color.bold(GITHUB_REPO)}.`)
    if (await confirm(`Push ${branch} and ${tag} to origin?`, true)) {
      await pushBranchAndTag(branch, tag)
      ok(`Pushed ${branch} + ${tag}`)
      pushed = true
    } else {
      warn('Not pushed. The commit and tag exist locally.')
    }
  }

  // ── 8. npm ───────────────────────────────────────────────────────────────
  let published = false
  heading('npm')
  if (NO_NPM) {
    warn(NO_PUSH ? '--no-push implies no publish.' : '--no-npm — registry untouched.')
  } else if (DRY_RUN) {
    ok(`[dry-run] would run pnpm publish --tag ${distTag} in ${pkg.relDir}`)
  } else if (!npmAuth.ok) {
    warn('Skipped — not authenticated. Run `npm login`, then:')
    info(`  pnpm --filter ${pkg.name} publish --access public --tag ${distTag} --no-git-checks`)
  } else {
    console.log(
      `  ${color.yellow('This publishes')} ${color.bold(`${pkg.name}@${version}`)} ` +
        `${color.yellow('to the public npm registry under')} ${color.bold(distTag)}${color.yellow('.')}`
    )
    console.log(`  ${color.dim('npm versions are immutable — a mistake here can only be deprecated, not replaced.')}`)
    if (await confirm(`Publish ${pkg.name}@${version} to npm?`, true)) {
      await publishPackage(pkg, { tag: distTag })
      published = await isPublished(pkg.name, version)
      if (published) ok(`Published https://www.npmjs.com/package/${pkg.name}/v/${version}`)
      else warn('Publish command finished but the registry does not list the version yet.')
    } else {
      warn('Not published.')
    }
  }

  // ── 9. GitHub Release ────────────────────────────────────────────────────
  heading('GitHub Release')
  if (!gh.ok) {
    warn('Skipped — gh CLI unavailable or unauthenticated.')
    info(`Create it manually: https://github.com/${GITHUB_REPO}/releases/new?tag=${tagPath(tag)}`)
  } else if (DRY_RUN) {
    ok(`[dry-run] would create GitHub Release ${tag} on ${GITHUB_REPO}`)
  } else if (!pushed) {
    warn('Skipped — the tag has to be on origin before a Release can point at it.')
  } else if (await confirm(`Publish GitHub Release ${tag}?`, true)) {
    if (await githubReleaseExists(tag)) {
      warn(`Release ${tag} already exists on GitHub. Skipped.`)
    } else {
      const notesFile = writeNotesFile(notesForGithub({ body, url }))
      await createGithubRelease({ tag, title: tag, notesFile, version })
      ok(`Published https://github.com/${GITHUB_REPO}/releases/tag/${tagPath(tag)}`)
    }
  }

  // ── Summary ──────────────────────────────────────────────────────────────
  heading('Summary')
  info(`Package:   ${pkg.name}`)
  info(`Version:   ${version}`)
  info(`Tag:       ${tag}`)
  info(`Pushed:    ${pushed ? 'yes' : 'no'}`)
  info(`Published: ${published ? `yes (${distTag})` : 'no'}`)
  info(`Notes:     ${draftPath}`)
  if (!pushed && !DRY_RUN) {
    info(`Finish later with: git push origin ${branch} && git push origin ${tag}`)
  }
  console.log('')
  closePrompts()
})().catch((err) => {
  closePrompts()
  fail(err.message)
  if (err.stack && process.env.DEBUG) console.error(err.stack)
  process.exit(1)
})
