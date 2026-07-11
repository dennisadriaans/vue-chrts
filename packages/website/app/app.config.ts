export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'neutral',
      indigo: 'indigo'
    },
    footer: {
      slots: {
        root: 'border-t border-default',
        left: 'text-sm text-muted'
      }
    },
    navigationMenu: {
      slots: {
        linkLeadingIcon: 'size-4'
      }
    },
    slideover: {
      slots: {
        header: 'p-2 sm:px-6',
        overlay: 'fixed inset-0 bg-default/75'
      },

      variants: {
        side: {
          right: {
            content: 'max-w-xl'
          }
        }
      }
    },
    prose: {
      pre: {
        slots: {
          root: 'relative group my-0', // Removed 'my-5' globally
          copy: 'hidden'
        }
      },
      codePreview: {
        slots: {
          preview: 'p-4 rounded-tr-none rounded-tl-none',
          code: 'rounded-none'
        }
      }
    },
    page: {
      slots: {
        root: 'lg:pt-6'
      }
    },
    icons: {
      loading: 'i-lucide-loader'
    },
    button: {
      slots: {
        base: 'cursor-pointer whitespace-nowrap rounded-full'
      },
      variants: {
        size: {
          xs: {
            base: 'px-2.5 py-1.5 text-xs gap-1',
            leadingIcon: 'size-4',
            leadingAvatarSize: '3xs',
            trailingIcon: 'size-4'
          },
          sm: {
            base: 'px-3 py-2 text-xs gap-1.5',
            leadingIcon: 'size-4',
            leadingAvatarSize: '3xs',
            trailingIcon: 'size-4'
          },
          md: {
            base: 'px-3 py-2 text-sm gap-1.5',
            leadingIcon: 'size-5',
            leadingAvatarSize: '2xs',
            trailingIcon: 'size-5'
          },
          lg: {
            base: 'px-3.5 py-2.5 text-sm gap-2',
            leadingIcon: 'size-5',
            leadingAvatarSize: '2xs',
            trailingIcon: 'size-5'
          },
          xl: {
            base: 'px-3.5 py-2.5 text-base gap-2',
            leadingIcon: 'size-6',
            leadingAvatarSize: 'xs',
            trailingIcon: 'size-6'
          }
        }
      }
    },
    pageSection: {
      slots: {
      }
    },
    // select: {
    //   slots: {
    //     base: 'cursor-pointer',
    //   },
    // },
    card: {
      slots: {
        root: 'overflow-visible bg-elevated/50 dark:bg-elevated/10',
      }
    },
    badge: {
      slots: {
        base: '!rounded-full'
      }
    },
    tabs: {
      variants: {
        variant: {
          pill: {
            list: 'rounded-full',
            indicator: 'rounded-full'
          }
        }
      }
    }
  },
  seo: {
    siteName: 'Nuxt Charts'
  },
  header: {
    title: '',
    to: '/',
    logo: {
      alt: '',
      light: '',
      dark: ''
    },
    search: true,
    colorMode: true,
    links: [
      {
        'icon': 'i-simple-icons-github',
        'to': 'https://github.com/nuxt-ui-pro/docs',
        'target': '_blank',
        'aria-label': 'GitHub'
      }
    ]
  },
  footer: {
    credits: `Copyright © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [
      {
        'icon': 'i-simple-icons-nuxtdotjs',
        'to': 'https://nuxt.com',
        'target': '_blank',
        'aria-label': 'Nuxt Website'
      },
      {
        'icon': 'i-simple-icons-discord',
        'to': 'https://discord.com/invite/ps2h6QT',
        'target': '_blank',
        'aria-label': 'Nuxt UI on Discord'
      },
      {
        'icon': 'i-simple-icons-x',
        'to': 'https://x.com/nuxt_js',
        'target': '_blank',
        'aria-label': 'Nuxt on X'
      },
      {
        'icon': 'i-simple-icons-github',
        'to': 'https://github.com/nuxt/ui',
        'target': '_blank',
        'aria-label': 'Nuxt UI on GitHub'
      }
    ]
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Support Nuxt Charts',
      links: [
        {
          icon: 'i-simple-icons-x',
          label: 'Follow on X',
          to: 'https://x.com/DennisAdriaans',
          target: '_blank'
        },
        {
          icon: 'i-lucide-github',
          label: 'Star on GitHub',
          to: 'https://github.com/dennisadriaans/vue-chrts',
          target: '_blank'
        },
        {
          icon: 'i-simple-icons-nuxtdotjs',
          label: 'Purchase a All-Access',
          to: 'https://nuxtcharts.com/pricing',
          target: '_blank'
        }
      ]
    }
  }
})
