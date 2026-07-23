<script setup lang="ts">
const props = defineProps<{
  testimonials?: Array<{
    name: string
    role: string
    avatar: string
    content: string
    rating: number
  }>
}>()

const defaultTestimonials = [
  {
    name: 'David',
    role: 'E-commerce Developer',
    avatar: '/images/avatars/sarah.jpg',
    content:
      'The e-commerce dashboard template is a game changer! It made tracking sales and inventory so much easier for our team.',
    rating: 5
  },
  {
    name: 'Matthew',
    role: 'Shop Owner',
    avatar: '/images/avatars/mike.jpg',
    content:
      'I love the analytics and charts. The dashboard is intuitive and beautiful. Highly recommended for any e-commerce business!',
    rating: 5
  },
  {
    name: 'Emma',
    role: 'E-commerce Marketer',
    avatar: '/images/avatars/emma.jpg',
    content:
      'The sales and customer insights are fantastic. Integration was seamless and support is top-notch.',
    rating: 5
  }
]

const testimonials = computed(() => props.testimonials || defaultTestimonials)
</script>

<template>
  <div
    class="grid gap-8"
    :class="
      props.testimonials?.length === 2 ? 'md:grid-cols-1' : 'md:grid-cols-3'
    "
  >
    <UCard
      v-for="testimonial in testimonials"
      :key="testimonial.name"
      class="group hover:shadow-primary/5 hover:border-primary/15 dark:bg-elevated/20 p-2 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div class="mb-4 flex gap-1 transition-transform duration-300">
        <svg
          v-for="star in testimonial.rating"
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
      <p
        class="group-hover:text-default mb-6 leading-relaxed text-(--ui-text-toned) transition-colors duration-300"
      >
        {{ testimonial.content }}
      </p>
      <div class="flex items-center gap-3">
        <div
          class="group-hover:bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full bg-(--ui-bg-elevated) transition-all duration-300 group-hover:scale-105"
        >
          <UIcon
            name="i-lucide-user"
            class="group-hover:text-primary/80 text-muted h-5 w-5 transition-colors duration-300"
          />
        </div>
        <div>
          <div
            class="group-hover:text-primary font-semibold text-(--ui-text-highlighted) transition-colors duration-300"
          >
            {{ testimonial.name }}
          </div>
          <div
            class="text-dimmed text-sm transition-colors duration-300 group-hover:text-(--ui-text-toned)"
          >
            {{ testimonial.role }}
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
