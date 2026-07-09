import { tables } from '~~/server/utils/database'

export const useFilament = () => {
  const config = useAppConfig()
  const collections = Object.keys(tables).filter(key =>
    config.filament?.collections?.includes(key)
  )

  return {
    collections
  }
}
