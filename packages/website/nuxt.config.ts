// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    // nuxt-charts v3 (vccs) — standalone chart module, no vue-chrts/Unovis.
    'nuxt-charts',
    'nuxt-auth-utils',
    'nuxt-shiki',
    '@nuxt/scripts',
    '@nuxtjs/turnstile',
    '@nuxthub/core'
  ],

  $production: {
    routeRules: {
      '/': { prerender: true },
      '/login': { prerender: true },
      '/charts': { prerender: true },
      '/angular-charts': { prerender: true },
      '/laravel-charts': { prerender: true },
      '/blocks/**': { prerender: true },
      '/templates': { prerender: true },
      '/templates/**': { prerender: true },
      '/docs/**': { prerender: true },
      '/blocks-and-templates': {
        redirect: '/blocks'
      },
      '/playground': {
        redirect: '/storybook'
      },
      '/dashboard': {
        redirect: '/templates/nuxt-dashboard'
      },
      '/blocks/sections': {
        redirect: '/blocks/pricing-tables'
      },
      '/docs': {
        redirect: '/docs/getting-started/installation'
      },
      '/docs/cli': {
        redirect: '/docs/getting-started/cli'
      },
      '/docs/vue-chrts': {
        redirect: '/docs/getting-started/installation'
      },
      '/docs/getting-started/vue-chrts': {
        redirect: '/docs/getting-started/installation'
      },
      '/docs/area-chart': {
        redirect: '/docs/charts/area-chart'
      },
      '/docs/bar-chart': {
        redirect: '/docs/charts/bar-chart'
      },
      '/docs/line-chart': {
        redirect: '/docs/charts/line-chart'
      },
      '/docs/donut-chart': {
        redirect: '/docs/charts/donut-chart'
      },
      '/docs/markers': {
        redirect: '/docs/customize/markers'
      },
      '/docs/server-side-rendering': {
        redirect: '/docs/customize/server-side-rendering'
      },
      '/docs/customize': {
        redirect: '/docs/customize/tooltips'
      },
      '/docs/tracker': {
        redirect: '/docs/components/status-tracker'
      },
      '/docs/progress-circle': {
        redirect: '/docs/components/progress-circle'
      },
      '/docs/charts/gantt-chart': {
        redirect: '/docs/getting-started/upgrade-to-v3'
      },
      '/docs/charts/dual-chart': {
        redirect: '/docs/getting-started/upgrade-to-v3'
      },
      '/docs/maps/dotted-map': {
        redirect: '/docs/getting-started/upgrade-to-v3'
      },
      '/docs/maps/topojson-map': {
        redirect: '/docs/getting-started/upgrade-to-v3'
      },
      '/docs/maps': {
        redirect: '/docs/getting-started/upgrade-to-v3'
      },
      '/blocks/combo-charts': {
        redirect: '/blocks'
      },
      '/nuxt-dashboard': {
        redirect: '/templates/nuxt-dashboard'
      }
    },
    scripts: {
      registry: {
        googleTagManager: true
      }
    }
  },

  components: {
    dirs: [
      {
        path: '~/components/Blocks',
        prefix: 'Blocks',
        global: true
      },
      '~/components'
    ]
  },

  imports: {
    dirs: [
      // Scan all modules within the app/utils directory
      'app/utils/**'
      // Or scan specific sub-folders if you prefer
      // 'app/utils'
    ]
  },

  devtools: {
    enabled: false
  },

  app: {
    baseURL: '/'
  },

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'dark'
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-dark',
          langs: ['vue', 'typescript', 'javascript', 'css', 'json', 'bash']
        },
        toc: {
          searchDepth: 3
        }
      }
    }
  },

  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'indigo',
        'info',
        'success',
        'warning',
        'error',
        'black'
      ]
    }
  },

  runtimeConfig: {
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    gaApiSecret: '',
    githubToken: '',
    plunkApiToken: '',
    // Admin/notification identities — never hardcode these in source.
    adminEmail: '',
    notificationEmail: '',
    // Comma-separated list of emails permitted to join the affiliate program.
    affiliateAllowedEmails: '',
    // Verified "nuxt" affiliate secrets (Stripe Connect account id + contact
    // email used for reverse-charge invoicing). Kept out of source.
    affiliateNuxtAccountId: '',
    affiliateNuxtEmail: '',
    turnstile: {
      secretKey: ''
    },
    oauth: {
      google: {
        clientId: '',
        clientSecret: ''
      },
      github: {
        clientId: '',
        clientSecret: ''
      }
    },
    public: {
      stripePublishableKey: '',
      gaMeasurementId: '',
      googleTagManager: '',
      lockCode: process.env.NUXT_PUBLIC_LOCK_CODE || '',
      // Exposed to the client for UI gating only (server routes re-check).
      adminEmail: '',
      affiliateAllowedEmails: ''
    },
    session: {
      password: '',
      maxAge: 60 * 60 * 24 * 7,
      cookie: {
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },

  routeRules: {
    '/docs/charts/gantt-chart': {
      redirect: '/docs/getting-started/upgrade-to-v3'
    },
    '/docs/charts/dual-chart': {
      redirect: '/docs/getting-started/upgrade-to-v3'
    },
    '/docs/charts/dual-axes-chart': {
      redirect: '/docs/getting-started/upgrade-to-v3'
    },
    '/docs/maps/dotted-map': {
      redirect: '/docs/getting-started/upgrade-to-v3'
    },
    '/docs/maps/topojson-map': {
      redirect: '/docs/getting-started/upgrade-to-v3'
    },
    '/docs/maps': {
      redirect: '/docs/getting-started/upgrade-to-v3'
    },
    '/blocks/combo-charts': {
      redirect: '/blocks'
    }
  },

  sourcemap: {
    // Disable client-side maps in production to prevent reverse-engineering
    // Set to 'hidden' if you use Sentry (it generates maps but hides the link)
    client: process.env.NODE_ENV === 'development',

    // Server maps can stay true if you want better logs in Cloudflare
    // but can also be set to false for maximum privacy
    server: process.env.NODE_ENV === 'development'
  },

  experimental: {
    asyncContext: true,
    payloadExtraction: false
  },

  compatibilityDate: '2025-12-16',
  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true
    },
    experimental: {
      wasm: true
    },
    serverAssets: [
      {
        baseName: 'components',
        dir: './app/components'
      }
    ]
  },

  hub: {
    db: 'sqlite',
    cache: {
      driver: 'cloudflare-kv-binding',
      binding: 'CACHE',
      namespaceId: '967132cf65f14d0aadd6fa0231e9957a'
    },
    blob: true
  },

  // Maximum minification settings for Vite
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Optional: removes console.logs
          drop_debugger: true
        }
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    provider: 'iconify'
  },

  shiki: {
    bundledThemes: ['github-dark', 'github-light'],
    bundledLangs: ['vue', 'html', 'typescript', 'javascript', 'css', 'json', 'bash'],
    defaultTheme: 'github-dark'
  },

  turnstile: {
    siteKey: '0x4AAAAAABknRKABNxVcv9bw'
  }
})
