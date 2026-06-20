import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["../src/module"],

  css: ["~/assets/main.css"],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  devtools: { enabled: true },
  compatibilityDate: "2025-04-08",
});
