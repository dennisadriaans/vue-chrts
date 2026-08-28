/**
 * Spawn helpers. capture() returns stdout; run() streams stdio.
 */

import { spawn } from 'node:child_process'
import process from 'node:process'

export function capture(cmd, args, opts = {}) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd: opts.cwd ?? process.cwd(),
      env: opts.env ?? process.env,
      stdio: ['ignore', 'pipe', 'pipe']
    })
    let stdout = ''
    let stderr = ''
    child.stdout.on('data', (b) => (stdout += b.toString()))
    child.stderr.on('data', (b) => (stderr += b.toString()))
    child.on('close', (code) => resolve({ code: code ?? 1, stdout, stderr }))
    child.on('error', () => resolve({ code: 1, stdout, stderr }))
  })
}

export function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: opts.cwd ?? process.cwd(),
      env: opts.env ?? process.env,
      stdio: opts.stdio ?? 'inherit'
    })
    child.on('error', reject)
    child.on('close', (code) => resolve(code ?? 1))
  })
}

export async function tryCapture(cmd, args, opts = {}) {
  const result = await capture(cmd, args, opts)
  return result.code === 0 ? result.stdout.trim() : null
}

/** Run a command and throw with its exit code when it fails. */
export async function runOrThrow(cmd, args, opts = {}) {
  const code = await run(cmd, args, opts)
  if (code !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} failed with code ${code}`)
  }
}
