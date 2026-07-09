import { blob } from 'hub:blob'

export function useBlob() {
  if (!blob) {
    throw new Error('❌ R2 binding "BLOB" not found. Are you running via `npm run dev` with nitro-cloudflare-dev or `wrangler pages dev`?')
  }

  const put = async (key: string, value: ReadableStream | ArrayBuffer | ArrayBufferView | string | null | Blob, options?: R2PutOptions) => {
    return await blob.put(key, value, options)
  }

  const get = async (key: string) => {
    return await blob.get(key)
  }

  const head = async (key: string) => {
    return await blob.head(key)
  }

  const remove = async (key: string) => {
    return await blob.delete(key)
  }

  const list = async () => {
    return await blob.list()
  }

  return {
    put,
    get,
    head,
    remove,
    list,
    blob
  }
}
