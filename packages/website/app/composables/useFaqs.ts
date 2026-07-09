// composable for FAQ data, shared between layouts
export function useFaqs() {
  return ref([
    {
      id: 1,
      question: 'How do I get access to the Nuxt Dashboard?',
      answer:
        'You get access to Nuxt Dashboard via invite to private GitHub repository. After purchase, you\'ll receive an email with instructions to join the private repo containing the complete dashboard template.',
      isOpen: false
    },
    {
      id: 2,
      question: 'What\'s included in the All-Access Pass?',
      answer:
        'The All-Access Pass includes access to the Nuxt Dashboard template, 50+ premium Vue charts components and blocks, lifetime updates, commercial license, and priority support. Everything you need to build professional data visualization apps.',
      isOpen: false
    },
    {
      id: 3,
      question: 'Can I customize the charts and components?',
      answer:
        'Absolutely! All components are built with Nuxt UI, Tailwind CSS, and use CSS variables. You can easily customize colors, spacing, themes, and styling to match your brand perfectly.',
      isOpen: false
    },
    {
      id: 4,
      question: 'Do I need specific technical skills?',
      answer:
        'Basic knowledge of Nuxt 3, Vue.js, and Tailwind CSS is recommended. All components come with clear documentation and examples, making them accessible to developers of all skill levels.',
      isOpen: false
    },
    {
      id: 5,
      question: 'What types of Vue charts are available?',
      answer:
        'We offer Area Charts, Bar Charts, Line Charts, Donut Charts, Progress indicators, Heatmaps, Contribution graphs, Sparklines, and Tracker components. All built with the nuxt-charts module using Unovis.',
      isOpen: false
    },
    {
      id: 6,
      question: 'Can I use this for commercial projects?',
      answer:
        'Yes! Both the Nuxt Dashboard and All-Access Pass include commercial licenses. You can use all components in unlimited commercial projects without attribution requirements.',
      isOpen: false
    },
    {
      id: 7,
      question: 'What\'s the difference between the pricing tiers?',
      answer:
        'Nuxt Dashboard ($99) gives you the complete dashboard template. All-Access Pass ($149) includes everything plus 50+ premium blocks and components. Enterprise ($499) adds priority support and custom development.',
      isOpen: false
    },
    {
      id: 8,
      question: 'Do you offer refunds?',
      answer:
        'Yes! I do offer a 30-day money-back guarantee on the All-Access Pass. If you\'re not satisfied with the components, contact me for a full refund within 30 days of purchase.',
      isOpen: false
    }
  ])
}
