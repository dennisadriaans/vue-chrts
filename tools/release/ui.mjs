/**
 * Minimal prompt helpers built on node:readline/promises. Zero dependencies so
 * the release CLI runs from the private root without installing anything.
 */

import { createInterface } from 'node:readline/promises'
import { spawn } from 'node:child_process'
import process from 'node:process'

const RESET = '\x1b[0m'
const BOLD = '\x1b[1m'
const DIM = '\x1b[2m'
const RED = '\x1b[31m'
const GREEN = '\x1b[32m'
const YELLOW = '\x1b[33m'
const BLUE = '\x1b[34m'
const CYAN = '\x1b[36m'

export const color = {
  bold: (s) => `${BOLD}${s}${RESET}`,
  dim: (s) => `${DIM}${s}${RESET}`,
  red: (s) => `${RED}${s}${RESET}`,
  green: (s) => `${GREEN}${s}${RESET}`,
  yellow: (s) => `${YELLOW}${s}${RESET}`,
  blue: (s) => `${BLUE}${s}${RESET}`,
  cyan: (s) => `${CYAN}${s}${RESET}`
}

export function heading(title) {
  console.log(`\n${color.bold(color.cyan(`▸ ${title}`))}`)
}

export function info(msg) {
  console.log(`  ${color.dim('·')} ${msg}`)
}

export function ok(msg) {
  console.log(`  ${color.green('✔')} ${msg}`)
}

export function warn(msg) {
  console.log(`  ${color.yellow('⚠')} ${msg}`)
}

export function fail(msg) {
  console.log(`  ${color.red('✖')} ${msg}`)
}

export function divider() {
  console.log(color.dim('─'.repeat(64)))
}

function isInteractive() {
  return process.stdin.isTTY && process.stdout.isTTY
}

// Without a TTY there is nobody to confirm a push or a publish, so prompts fail
// closed. `--dry-run` / `--yes` opt into answering them with their defaults.
let nonInteractiveDefaults = false

export function allowNonInteractive(enabled = true) {
  nonInteractiveDefaults = enabled
}

// One interface for the whole run. Opening a fresh readline per question drops
// whatever the previous one had already buffered, which loses answers as soon as
// input arrives faster than the prompts (piped input, or a fast typist).
let rl = null

function prompts() {
  if (!rl) {
    rl = createInterface({ input: process.stdin, output: process.stdout })
    rl.on('close', () => (rl = null))
  }
  return rl
}

export function closePrompts() {
  if (rl) rl.close()
}

export async function ask(question, defaultValue, { showDefault = true } = {}) {
  if (!isInteractive()) {
    if (nonInteractiveDefaults && defaultValue !== undefined) {
      console.log(`  ${color.bold('?')} ${question} ${color.dim(`→ ${defaultValue}`)}`)
      return defaultValue
    }
    throw new Error(`Non-interactive shell; cannot prompt: ${question}`)
  }
  const hint =
    showDefault && defaultValue !== undefined
      ? ` ${color.dim(`[${defaultValue}]`)}`
      : ''
  const answer = (
    await prompts().question(`  ${color.bold('?')} ${question}${hint} `)
  ).trim()
  return answer || defaultValue || ''
}

export async function confirm(question, defaultYes = true) {
  const def = defaultYes ? 'Y/n' : 'y/N'
  const raw = await ask(
    `${question} ${color.dim(`[${def}]`)}`,
    defaultYes ? 'y' : 'n',
    { showDefault: false }
  )
  return /^y(es)?$/i.test(raw)
}

export async function select(question, options) {
  if (!isInteractive()) {
    if (!nonInteractiveDefaults) {
      throw new Error(`Non-interactive shell; cannot select: ${question}`)
    }
    console.log(`  ${color.bold('?')} ${question} ${color.dim(`→ ${options[0].label}`)}`)
    return options[0].value
  }
  console.log(`  ${color.bold('?')} ${question}`)
  for (const [i, opt] of options.entries()) {
    const hint = opt.hint ? color.dim(` — ${opt.hint}`) : ''
    console.log(`    ${color.cyan(String(i + 1))}) ${opt.label}${hint}`)
  }
  const raw = await ask(`Pick 1-${options.length}`, '1')
  const idx = parseInt(raw, 10) - 1
  if (!Number.isFinite(idx) || idx < 0 || idx >= options.length) {
    throw new Error(`Invalid selection: ${raw}`)
  }
  return options[idx].value
}

/** Open a file in $VISUAL/$EDITOR and resolve once the editor exits. */
export function openInEditor(filePath) {
  const editor = process.env.VISUAL || process.env.EDITOR || 'vi'
  // The shared readline holds stdin; a terminal editor needs it back.
  closePrompts()
  return new Promise((resolve, reject) => {
    const child = spawn(editor, [filePath], { stdio: 'inherit', shell: true })
    child.on('error', reject)
    child.on('close', () => resolve())
  })
}

export function panic(msg) {
  fail(msg)
  process.exit(1)
}
