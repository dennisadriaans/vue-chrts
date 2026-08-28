/**
 * Semver bump helpers. No external dependencies — implements only the subset
 * needed here (parse, compare, bump).
 *
 * Release kinds:
 *   patch / minor / major  → stable bump
 *   prerelease-beta        → x.y.z-beta.N
 *   prerelease-rc          → x.y.z-rc.N
 *
 * Prerelease bump rules:
 *   - current 1.2.3            → next 1.2.4-{tag}.0
 *   - current 1.2.4-{tag}.N    → next 1.2.4-{tag}.{N+1}
 *   - current 1.2.4-other.N    → next 1.2.4-{tag}.0
 */

const SEMVER =
  /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/

export function isSemver(version) {
  return SEMVER.test(version)
}

export function parse(version) {
  const match = SEMVER.exec(version)
  if (!match) throw new Error(`Invalid semver: ${version}`)
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ?? null,
    build: match[5] ?? null
  }
}

export function format(parts) {
  let out = `${parts.major}.${parts.minor}.${parts.patch}`
  if (parts.prerelease) out += `-${parts.prerelease}`
  if (parts.build) out += `+${parts.build}`
  return out
}

function comparePrerelease(a, b) {
  if (a === null && b === null) return 0
  if (a === null) return 1
  if (b === null) return -1
  const left = a.split('.')
  const right = b.split('.')
  for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
    const l = left[i]
    const r = right[i]
    if (l === undefined) return -1
    if (r === undefined) return 1
    const ln = /^\d+$/.test(l) ? Number(l) : null
    const rn = /^\d+$/.test(r) ? Number(r) : null
    if (ln !== null && rn !== null) {
      if (ln !== rn) return ln < rn ? -1 : 1
      continue
    }
    if (ln !== null) return -1
    if (rn !== null) return 1
    if (l !== r) return l < r ? -1 : 1
  }
  return 0
}

/** Semver precedence: -1 if a < b, 0 if equal, 1 if a > b. Build metadata ignored. */
export function compare(a, b) {
  const left = parse(a)
  const right = parse(b)
  for (const field of ['major', 'minor', 'patch']) {
    if (left[field] !== right[field]) return left[field] < right[field] ? -1 : 1
  }
  return comparePrerelease(left.prerelease, right.prerelease)
}

/** The highest version by semver precedence, or null for an empty list. */
export function highest(versions) {
  let best = null
  for (const version of versions) {
    if (best === null || compare(version, best) > 0) best = version
  }
  return best
}

export function isPrerelease(version) {
  return parse(version).prerelease !== null
}

/** The identifier of a prerelease: `1.0.0-beta.2` → `beta`. Null when stable. */
export function prereleaseId(version) {
  const { prerelease } = parse(version)
  if (!prerelease) return null
  const head = prerelease.split('.')[0]
  return /^\d+$/.test(head) ? null : head
}

/**
 * The npm dist-tag a version should publish under. Publishing a prerelease as
 * `latest` is the classic way to break every `npm install` of a package.
 */
export function distTagFor(version) {
  return prereleaseId(version) ?? (isPrerelease(version) ? 'next' : 'latest')
}

export function bumpStable(version, kind) {
  const p = parse(version)
  const stable = {
    major: p.major,
    minor: p.minor,
    patch: p.patch,
    prerelease: null,
    build: null
  }
  if (kind === 'patch') {
    // A prerelease promotes to its own stable number rather than skipping one.
    if (p.prerelease) return format(stable)
    return format({ ...stable, patch: stable.patch + 1 })
  }
  if (kind === 'minor') {
    return format({ ...stable, minor: stable.minor + 1, patch: 0 })
  }
  if (kind === 'major') {
    return format({
      major: stable.major + 1,
      minor: 0,
      patch: 0,
      prerelease: null,
      build: null
    })
  }
  throw new Error(`Unknown stable kind: ${kind}`)
}

export function bumpPrerelease(version, tag) {
  const p = parse(version)
  if (p.prerelease) {
    const dotIdx = p.prerelease.lastIndexOf('.')
    const head = dotIdx === -1 ? p.prerelease : p.prerelease.slice(0, dotIdx)
    const tail = dotIdx === -1 ? '' : p.prerelease.slice(dotIdx + 1)
    const counter = parseInt(tail, 10)
    if (head === tag && Number.isFinite(counter)) {
      return format({ ...p, prerelease: `${tag}.${counter + 1}` })
    }
    return format({ ...p, prerelease: `${tag}.0` })
  }
  return format({ ...p, patch: p.patch + 1, prerelease: `${tag}.0` })
}

export function nextVersion(current, kind) {
  if (kind === 'prerelease-beta') return bumpPrerelease(current, 'beta')
  if (kind === 'prerelease-rc') return bumpPrerelease(current, 'rc')
  return bumpStable(current, kind)
}

export const RELEASE_KIND_OPTIONS = [
  { label: 'patch', value: 'patch', hint: 'x.y.Z bug fix' },
  { label: 'minor', value: 'minor', hint: 'x.Y.0 feature' },
  { label: 'major', value: 'major', hint: 'X.0.0 breaking' },
  {
    label: 'prerelease — beta',
    value: 'prerelease-beta',
    hint: 'x.y.z-beta.N, marked pre-release on GitHub'
  },
  {
    label: 'prerelease — rc',
    value: 'prerelease-rc',
    hint: 'x.y.z-rc.N, marked pre-release on GitHub'
  }
]
