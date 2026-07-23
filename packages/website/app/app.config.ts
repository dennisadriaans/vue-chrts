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
          copy: 'hidden',
          base: 'group font-mono text-sm/6 border border-muted bg-default dark:bg-elevated/40 rounded-md px-4 py-3 whitespace-pre-wrap wrap-break-word overflow-x-auto outline-primary/25 focus-visible:outline-3 focus-visible:border-primary **:[.line]:block **:[.line.highlight]:-mx-4 **:[.line.highlight]:px-4 **:[.line.highlight]:bg-accented/50!'
        }
      },
      codeGroup: {
        slots: {
          root: 'relative group *:not-first:my-0! *:not-first:static! my-5 [&_pre]:rounded-t-none',
          list: 'relative flex items-center gap-1 border border-muted bg-default dark:bg-elevated/40 border-b-0 rounded-t-md overflow-x-auto p-2',
          indicator: 'absolute left-0 inset-y-2 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) transition-[translate,width] duration-200 bg-elevated rounded-md shadow-xs',
          trigger: [
            'relative inline-flex items-center gap-1.5 text-default data-[state=active]:text-highlighted hover:bg-elevated/50 px-2 py-1.5 text-sm rounded-md disabled:cursor-not-allowed disabled:opacity-75 outline-primary/25 focus-visible:outline-3',
            'transition-colors'
          ],
          triggerIcon: 'size-4 shrink-0',
          triggerLabel: 'truncate'
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
        root: 'overflow-visible bg-elevated/50 dark:bg-elevated/20',
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
