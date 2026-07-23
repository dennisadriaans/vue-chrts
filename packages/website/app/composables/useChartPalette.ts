interface PaletteOption {
  label: string
  value: string
}

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
    else if (max === g) h = ((b - r) / d + 2) / 6
    else h = ((r - g) / d + 4) / 6
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100
  const lNorm = l / 100
  const a = sNorm * Math.min(lNorm, 1 - lNorm)
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

export function useChartPalette() {
  const paletteOptions: PaletteOption[] = [
    { label: 'Emerald', value: '#22c55e' },
    { label: 'Cyan', value: '#06b6d4' },
    { label: 'Violet', value: '#8b5cf6' },
    { label: 'Orange', value: '#f97316' },
    { label: 'Pink', value: '#ec4899' }
  ]

  function generateShades(hex: string, count: number = 5): string[] {
    if (!hex) return []

    const [h, s] = hexToHsl(hex)
    const lightnessMap: Record<number, number[]> = {
      1: [48],
      2: [62, 32],
      3: [72, 50, 30],
      4: [78, 60, 42, 26],
      5: [82, 66, 50, 36, 22]
    }
    const levels = lightnessMap[count] || lightnessMap[5]!
    return levels.map(l => (h !== undefined && s !== undefined && l !== undefined) ? hslToHex(h, s, l) : '')
  }

  return { paletteOptions, generateShades }
}
