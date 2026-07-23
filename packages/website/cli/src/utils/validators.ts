import path from 'path'
import { Mapping } from './config.js'

// Input validation
export function validateComponent(
  component: string
): component is keyof typeof Mapping {
  if (typeof component !== 'string') return false
  return component in Mapping
}

export function validatePath(inputPath: string): boolean {
  if (typeof inputPath !== 'string') return false
  if (inputPath.length > 255) return false
  // Disallow dangerous characters and patterns
  const dangerousPatterns = [
    /\.\./, // Parent directory
    /[<>"|*?]/, // Invalid filename characters
    /^\/|^[a-zA-Z]:\\/, // Absolute paths
    /\0/, // Null bytes
    /^\./ // Hidden files (starting with .)
  ]
  return !dangerousPatterns.some(pattern => pattern.test(inputPath))
}

export function isPathSafe(base: string, target: string): boolean {
  try {
    const rel = path.relative(base, target)
    return !rel.startsWith('..') && !path.isAbsolute(rel) && rel !== ''
  } catch {
    return false
  }
}
