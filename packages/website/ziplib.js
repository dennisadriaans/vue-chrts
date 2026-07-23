import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'
import archiver from 'archiver'

import fetch from 'node-fetch'

export async function getNextVersion() {
  // Fetch current version from npm registry
  const res = await fetch('https://registry.npmjs.org/nuxt-charts-cli')
  if (!res.ok) throw new Error('Failed to fetch npm version')
  const data = await res.json()
  const current = data['dist-tags']?.latest || '0.0.0'
  const [major, minor, patch] = current.split('.').map(Number)

  // Prompt user for version bump
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  const question = q => new Promise(resolve => rl.question(q, resolve))
  const answer = await question('Bump (m)ajor, (n)minor, or (p)atch? [p]: ')
  rl.close()
  let next
  if (answer === 'm') next = `${major + 1}.0.0`
  else if (answer === 'n') next = `${major}.${minor + 1}.0`
  else next = `${major}.${minor}.${patch + 1}`
  return next
}

;(async () => {
  if (process.env.NODE_ENV === 'production') {
    console.error('Not allowed in production.')
    process.exit(1)
  }

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const sourceDir = path.resolve(__dirname, 'app/components/lib')
  const releaseDir = path.resolve(__dirname, '.releases')

  if (!fs.existsSync(sourceDir)) {
    console.error(`Source directory not found: ${sourceDir}`)
    process.exit(1)
  }

  if (!fs.existsSync(releaseDir)) {
    fs.mkdirSync(releaseDir, { recursive: true })
  }

  const nextVersion = await getNextVersion()
  const versionDir = path.join(releaseDir, `v${nextVersion}`)
  if (!fs.existsSync(versionDir)) {
    fs.mkdirSync(versionDir, { recursive: true })
  }

  const files = fs.readdirSync(sourceDir)
  if (!files.length) {
    console.error(`No files or folders found in ${sourceDir}`)
    process.exit(1)
  }

  let foundDir = false
  for (const file of files) {
    const filePath = path.join(sourceDir, file)
    const stats = fs.statSync(filePath)
    if (stats.isDirectory()) {
      foundDir = true
      const zipBuffer = await new Promise((resolve, reject) => {
        const chunks = []
        const archive = archiver('zip', { zlib: { level: 9 } })
        archive.on('data', chunk => chunks.push(chunk))
        archive.on('end', () => {
          const buffer = Buffer.concat(chunks)
          resolve(buffer)
        })
        archive.on('error', reject)
        archive.directory(filePath, false)
        archive.finalize()
      })
      // Save zipBuffer to release/v1 folder
      const outPath = path.join(versionDir, `${file}.zip`)
      fs.writeFileSync(outPath, zipBuffer)
      console.log(`Zipped ${file} to ${outPath}`)
    }
  }
  if (!foundDir) {
    console.error(`No directories found in ${sourceDir} to zip.`)
    process.exit(1)
  }
  console.log(`Success. Version: ${nextVersion}`)
})()
