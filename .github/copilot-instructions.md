# vue-chrts Instructions

You are an agent working on `vue-chrts`, a monorepo providing responsive chart components for Vue 3, Nuxt, and Angular, inspired by Tremor and built on [Unovis](https://unovis.dev).

## Big Picture Architecture

- **`packages/vue`**: Core library `vue-chrts`. Components wrap Unovis Vue components.
- **`packages/nuxt`**: Nuxt module `nuxt-charts` that wraps `vue-chrts`.
- **`packages/angular`**: Angular library version.
- **Unovis Foundation**: All charts are thin layers over `@unovis/ts`, `@unovis/vue`, or `@unovis/angular`. Styling relies heavily on CSS variables used by Unovis.

## Coding Conventions

### Vue (@packages/vue)
- **Script Setup**: Use `<script setup lang="ts">`.
- **Generics**: Use `generic="T"` for data-driven components to support flexible data structures.
- **Props**: Use `withDefaults(defineProps<Props<T>>(), { ... })`. Define interfaces in a local `types.ts` file within the component directory.
- **Style**: Use Tailwind CSS (v4) and CSS variables. Unovis internal styling is controlled via `--vis-*` CSS variables.
- **Ref**: Use `useTemplateRef` for DOM references.

### Angular (@packages/angular)
- **Signals-First**: Use `signal()`, `computed()`, `input()`, `output()`, and `resource()`. (Refer to `.claude/skills/angular-best-practices.md` for details).
- **Standalone**: All components must be `standalone: true`. Avoid `NgModules`.
- **Naming**: Selector prefix is `ngx-`. Files use kebab-case. 
- **Dependency Injection**: Use `inject()` instead of constructor injection.

### Shared Patterns
- **Colors**: Derived from `categories` prop. Default colors indexed as `var(--vis-color[index])`.
- **Types**: Shared enums like `LegendPosition` and `CurveType` are in `packages/vue/lib/types.ts`.
- **Utilities**: Chart-specific logic (e.g., SVG markers, axis formatting) should be in `utils.ts`.
- **Unique IDs**: Use `getCurrentInstance()?.uid` (Vue) or unique IDs for SVG elements (gradients, markers) to avoid ID collisions across multiple chart instances.

## Critical Workflows

- **Develop Vue**: `pnpm dev` in root or `pnpm --filter vue-chrts dev`.
- **Develop Nuxt**: `pnpm dev:nuxt`.
- **Develop Angular**: `ng serve example-app` in `packages/angular`.
- **Build All**: `pnpm build` (Turbo).
- **Sync Versions**: `node scripts/sync-versions.js` to align versions across packages.

## Key Files
- [packages/vue/lib/index.ts](packages/vue/lib/index.ts): Main entry point for Vue exports.
- [packages/vue/lib/types.ts](packages/vue/lib/types.ts): Global types and enums.
- [.claude/skills/angular-best-practices.md](.claude/skills/angular-best-practices.md): Mandatory guidelines for Angular development.
- [packages/vue/lib/components/AreaChart/AreaChart.vue](packages/vue/lib/components/AreaChart/AreaChart.vue): Good reference for complex chart implementation.
