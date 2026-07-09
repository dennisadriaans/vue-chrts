<script setup lang="ts">
const testimonials = ref([
  {
    user: {
      name: 'Soraia',
      description: '@SoraiaDev',
      avatar: {
        src: 'https://pbs.twimg.com/profile_images/1982762414153015296/pzcLWsua_400x400.jpg',
        alt: 'Soraia'
      }
    },
    quote: 'I love your work! I use Nuxt for almost all my projects, and your charts are absolutely beautiful. You’ve actually inspired me to start building my own Nuxt module too!'
  },
  {
    user: {
      name: 'Michael Hoffmann',
      description: '@Mokkapps',
      avatar: {
        src: 'https://pbs.twimg.com/profile_images/1825498937911889920/FtBqvqgK_400x400.jpg',
        alt: 'Michael Hoffmann'
      }
    },
    quote: 'If you need beautiful charts in your Vue or Nuxt app, Nuxt Charts is a  no-brainer for me - it\'s my go-to library for all such use cases!'
  },
  {
    user: {
      name: 'Hugo',
      description: '@HugoRCD__',
      avatar: {
        src: 'https://pbs.twimg.com/profile_images/1989017357910466560/7pg7wTop_400x400.jpg',
        alt: 'Hugo'
      }
    },
    quote: 'Nuxt Charts is the simple, beautiful, and customizable charting library the Nuxt/Vue ecosystem was desperately missing.'
  },
  {
    user: {
      name: 'Fayaz Ahmed',
      description: '@Fayazara',
      avatar: {
        src: 'https://pbs.twimg.com/profile_images/1960563225742991360/qBN5JBek_400x400.jpg',
        alt: 'Fayaz Ahmed'
      }
    },
    quote: 'One of the best chart libraries for the Vue/Nuxt ecosystem. It\'s customizable, very modular, and its charts look good by default.'
  },
  {
    user: {
      name: 'Sébastien Chopin',
      description: '@Atinux',
      avatar: {
        src: 'https://pbs.twimg.com/profile_images/1862505215624142848/7tSrng8r_400x400.jpg',
        alt: 'Sébastien Chopin'
      }
    },
    quote: 'My favorite way to add charts to Nuxt. Clean, simple and beautiful.'
  },
  {
    user: {
      name: 'Matthewtyleraylward',
      description: '@Matthewtylerayl',
      avatar: {
        src: 'https://pbs.twimg.com/profile_images/1075521898144923649/vSKG9Wn8_400x400.jpg',
        alt: 'Matthewtyleraylward'
      }
    },
    quote: 'The Nuxt charts and dashboards are a breeze to use, it\'s so easy to implement them into my projects I can spend time on other things because I know I\'ll always have beautiful components at my disposal!'
  },
  {
    user: {
      name: 'Volkan',
      description: '@Volkanuikielle',
      avatar: {
        src: 'https://pbs.twimg.com/profile_images/1874316343316484096/wCgJ0bhj_400x400.jpg',
        alt: 'Volkan'
      }
    },
    quote: 'Had the chance to try NuxtCharts, it makes adding charts to Nuxt projects effortless. Clean, fast, and feels native to the framework 💚'
  },
  {
    user: {
      name: 'Daniel Kelly',
      description: '@danielkelly_io',
      avatar: {
        src: 'https://pbs.twimg.com/profile_images/1543113237415215104/6MUa5Tta_400x400.jpg',
        alt: 'Daniel Kelly'
      }
    },
    quote: 'Nuxt Charts is just TOO easy to use and looks beautiful! We\'ve incorporated it into our Nuxt UI course over at Vue School. Its just such an essential addition for any dashboard'
  },
  {
    user: {
      name: 'Thomas Sanlis',
      description: '@T_Zahil',
      avatar: {
        src: 'https://pbs.twimg.com/profile_images/1996166822823866368/l5DCWSdX_400x400.jpg',
        alt: 'Thomas Sanlis'
      }
    },
    quote: 'I was looking for a quick and easy way to create charts in Nuxt for a homemade dashboard. Nuxt Charts was the obvious choice: incredibly beautiful, great documentation, lots of templates. I feel like I\'m going to use it on all my projects 😍'
  }
])
</script>

<template>
  <UPageColumns>
    <UPageCard
      v-for="(testimonial, index) in testimonials"
      :key="index"
      variant="subtle"
      :description="testimonial.quote"
      :ui="{
        description: 'before:content-[open-quote] after:content-[close-quote]',
        root: 'bg-default dark:bg-elevated/20 shadow-md'
      }"
    >
      <template #leading>
        <div class="mb-4 flex gap-1 transition-transform duration-300">
          <svg
            v-for="star in 5"
            :key="star"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="transition-all duration-300 group-hover:drop-shadow-sm"
          >
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill="#FFD700"
              stroke="#FFA500"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </template>
      <template #footer>
        <NuxtLink
          :to="`https://x.com/${testimonial.user.description.replace(/^@/, '').toLowerCase()}`"
          target="_blank"
          rel="noopener noreferrer"
          class=" focus-visible:underline outline-none"
        >
          <UUser
            v-bind="testimonial.user"
            size="xl"
          />
        </NuxtLink>
      </template>
    </UPageCard>
    <div class="text-center opacity-20 group-hover:opacity-100 transition-opacity duration-300">
      Want to add one? Submit <NuxtLink
        target="_blank"
        to="https://x.com/DennisAdriaans"
      >here</NuxtLink>
    </div>
  </UPageColumns>
</template>
