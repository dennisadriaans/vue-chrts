export function createXFormatter<T extends Record<string, unknown>>(data: T[], key: keyof T & string) {
  return (i: number): string => {
    return String(data[i]?.[key] ?? '')
  }
}
