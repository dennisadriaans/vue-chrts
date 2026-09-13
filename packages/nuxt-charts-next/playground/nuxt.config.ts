import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["@nuxt/ui", "../src/module"],

  // Flat component names: `components/dots/DotColumnChart.vue` registers as
  // `<DotColumnChart>` rather than `<DotsDotColumnChart>`.
  components: [{ path: "~/components", pathPrefix: false }],

  css: ["~/assets/main.css"],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  devtools: { enabled: true },
  compatibilityDate: "2025-04-08",
});
