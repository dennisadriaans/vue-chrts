import { resolve } from 'node:path'
import { UserConfig, defineConfig } from 'vite'
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";
import type { ModuleFormat, OutputOptions } from 'rollup'

const outputDefault = (format: ModuleFormat, extension: string): OutputOptions => ({
  globals: {
    vue: 'Vue'
  },
  preserveModules: true,
  preserveModulesRoot: './src',
  format,
  entryFileNames: ({ name }) => {
    return `${name.replace('.vue', '')}.${extension}`
  },
  exports: 'named',
})

export default defineConfig(({ command, mode }): UserConfig => {
  if (command === 'build' && mode !== 'gallery') {
    return {
      plugins: [
        vue(),
        dts({
          cleanVueFileName: true,
        }),
      ],
      build: {
        emptyOutDir: true,
        lib: {
          name: 'vue-chrts',
          fileName: 'index',
          entry: resolve(__dirname, 'src/index.ts'),
        },
        rollupOptions: {
          external: ['vue', '@vueuse/core', 'tailwindcss', 'vue-router', '@unovis/ts', '@unovis/vue'],
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore overloaded issue
          output: [outputDefault('cjs', 'cjs'), outputDefault('es', 'js')],
        },
        sourcemap: true,
      },
    }
  } else {
    return {
      plugins: [
        vue(),
        tailwindcss()
      ],
      build: {
        outDir: 'dist-demo',
      },
    }
  }
})