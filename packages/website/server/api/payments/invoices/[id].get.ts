export default defineEventHandler(async (event) => {
  const invoiceId = getRouterParam(event, 'id')
  const { getInvoiceById } = useStripePayments()

  try {
    const { hosted_invoice_url } = await getInvoiceById(invoiceId!)
    return hosted_invoice_url
  } catch (error) {
    return createError({
      statusCode: 500,
      statusMessage: 'Failed to retrieve payments by email'
    })
  }
})
