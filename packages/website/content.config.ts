import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: {
        include: 'docs/**',
        exclude: ['index.md']
      },
      schema: z.object({
        links: z
          .array(
            z.object({
              label: z.string(),
              icon: z.string(),
              to: z.string(),
              target: z.string().optional()
            })
          )
          .optional()
      })
    }),
    products: defineCollection({
      type: 'page',
      source: {
        include: 'products/**'
      },
      schema: z.object({
        id: z.string(),
        name: z.string(),
        tagline: z.string(),
        price: z.number(),
        originalPrice: z.number(),
        category: z.string().optional(),
        image: z.object({
          light: z.string(),
          dark: z.string(),
          alt: z.string()
        }).optional(),
        badge: z.string().optional(),
        features: z.array(z.string()).optional(),
        technologies: z.array(z.object({
          name: z.string(),
          icon: z.string()
        })).optional(),
        stats: z.object({
          downloads: z.string(),
          rating: z.string(),
          updates: z.string()
        }).optional(),
        slug: z.string(),
        purchaseAction: z.string().optional(),
        demoURL: z.string().optional(),
        logoIcon: z.string().optional(),
        type: z.union([z.literal('dashboard'), z.literal('landing')]).default('dashboard')
      })
    }),
    landing: defineCollection({
      type: 'page',
      source: {
        include: 'landing/**'
      }
    })
  }
})
