export function useDashboardFaqs() {
  const faqs = [
    {
      question: 'What is included in the Nuxt Dashboard purchase?',
      answer:
        'You get access to a private GitHub repository containing the full Nuxt Dashboard template. This includes all the pages and components you see in the demo, plus documentation to help you get started.'
    },
    {
      question: 'Can I use this template for commercial projects?',
      answer:
        'Yes, absolutely! Your purchase includes a license to use the template for any number of commercial projects.'
    },
    {
      question: 'What if I am not satisfied with my purchase?',
      answer:
        'We offer a 30-day money-back guarantee. If you are not satisfied with the template, just let us know and we will issue a full refund.'
    },
    {
      question: 'How do I get access to the GitHub repository?',
      answer:
        'After your purchase, you will receive an email with a link to access the private GitHub repository. Make sure to check your spam folder if you do not see it.'
    }
  ]

  return { faqs }
}
