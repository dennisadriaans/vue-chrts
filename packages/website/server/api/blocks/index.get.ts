export default defineEventHandler(() => {
  throw createError({
    statusCode: 410,
    statusMessage: 'The /api/blocks endpoint has been removed. Blocks search is now handled client-side.'
  })
})
