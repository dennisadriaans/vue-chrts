// Types (unchanged)
export type RepositoryAccessResult =
  | {
    hasAccess: boolean
    githubUsername: string
    returnUrl: string
    results: Array<{
      hasAccess: boolean
      githubUsername: string
      repositoryUrl: string
      message?: string
      inviteStatus?: any
      repo: string
    }>
  }
  | {
    hasAccess: false
    githubUsername: string
    repositoryUrl: string
    message: string
    inviteStatus: any
  }
  | {
    link: string
  }

// A consistent type for a single repository processing result
type RepoResult = {
  hasAccess: boolean
  githubUsername: string
  repositoryUrl: string
  repo: string
  message?: string
  inviteStatus?: any
  error?: string
}

const GITHUB_OWNER = 'nuxtcharts'

/**
 * Main event handler for granting repository access.
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { user } = await requireUserSession(event)
  const githubUsername = body.githubUsername
  const productSlug = body.product

  const { checkHasPaid } = useStripePayments()

  // if (import.meta.dev) {
  //   user = { email: 'pieter@csoft.co.za' }
  //   githubUsername = 'Pietervdw'
  //   productSlug = body.product
  // }

  // 2. Validate Inputs
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
  if (!githubUsername) {
    throw createError({
      statusCode: 400,
      statusMessage: 'GitHub username is required'
    })
  }
  if (!productSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product slug is required'
    })
  }

  // 3. Check for a Valid Purchase
  const { hasAccess: hasAnyPaidProduct, hasAllAccess, paidProducts } = await checkHasPaid(user.email)
  if (!hasAnyPaidProduct) {
    throw createError({
      statusCode: 403, // 403 Forbidden is more appropriate than 500
      statusMessage:
        'No valid license found. Please purchase a product to gain access.'
    })
  }

  // 4. Specific Product Check
  if (!hasAllAccess) {
    const { ProductMap } = await import('~~/utils/ProductMap')

    // If they are requesting all-access but don't have it
    if (productSlug === 'all-access-pass') {
      throw createError({
        statusCode: 403,
        statusMessage: 'All-Access Pass required for this action.'
      })
    }

    // Check if they have the specific product they are requesting
    const productPriceId = Object.keys(ProductMap).find(
      key => ProductMap[key].slug === productSlug
    )

    if (!productPriceId || !paidProducts.includes(productPriceId)) {
      throw createError({
        statusCode: 403,
        statusMessage: `You do not have a license for this product (${productSlug}). Please purchase it to gain access.`
      })
    }
  }

  return handleRepositoryAccess({ githubUsername, productSlug, user })
})

/**
 * Determines which repositories to process and returns the final result.
 */
async function handleRepositoryAccess({
  githubUsername,
  productSlug,
  user
}: {
  githubUsername: string
  productSlug: string
  user: any
}): Promise<RepositoryAccessResult> {
  const { ProductMap } = await import('~~/utils/ProductMap')

  // Determine which repos need processing based on the productSlug
  const reposToProcess
    = productSlug === 'all-access-pass'
      ? Object.values(ProductMap).filter(
          p => p.slug && p.slug !== 'all-access-pass'
        )
      : [Object.values(ProductMap).find(p => p.slug === productSlug)]

  if (!reposToProcess[0]) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  // Process all repository checks concurrently
  const results: RepoResult[] = await Promise.all(
    reposToProcess.map(product =>
      processRepositoryAccess(githubUsername, product!.slug, user)
    )
  )

  // Handle 'all-access-pass' response
  if (productSlug === 'all-access-pass') {
    return {
      hasAccess: results.some(r => r.hasAccess),
      githubUsername,
      returnUrl: `https://github.com/orgs/${GITHUB_OWNER}/repositories`,
      results
    }
  }

  // Handle single product response
  const singleResult = results[0]
  return { link: singleResult.repositoryUrl }
}

/**
 * Processes a single repository: checks access and invites if needed.
 * This is the core, reusable logic block.
 */
async function processRepositoryAccess(
  githubUsername: string,
  repo: string,
  user: any
): Promise<RepoResult> {
  const repositoryUrl = `https://github.com/${GITHUB_OWNER}/${repo}`
  const checkResponse = await checkRepositoryAccess(githubUsername, repo)

  if (checkResponse !== 'not-found') {
    return {
      hasAccess: true,
      githubUsername,
      repositoryUrl,
      repo,
      message: 'User already has access.'
    }
  }

  try {
    const inviteResponse = await inviteToRepository(githubUsername, repo)

    // const { send } = createPlunkService()

    // await send({
    //   from: 'dennis@nuxtcharts.com',
    //   to: 'mail@adriaansendennis.nl',
    //   subject: 'User Invited to GitHub Repository',
    //   html: `${repositoryUrl}<br><br>Email: ${user.email || 'No email provided'}`
    // })

    return {
      hasAccess: true,
      githubUsername,
      repositoryUrl,
      repo,
      message: 'Invitation sent to repository.',
      inviteStatus: inviteResponse
    }
  } catch (error) {
    console.error(`Failed to invite ${githubUsername} to ${repo}:`, error)
    return {
      hasAccess: false,
      githubUsername,
      repositoryUrl,
      repo,
      error: `Failed to send invitation for ${repo}.`
    }
  }
}
