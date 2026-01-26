---
name: ui-design-nuxt-ui
description: When adding or editing UI, always use Nuxt UI components by default. Check the Nuxt UI MCP for available components and their APIs."
---

## Core Principle
When adding or editing UI, **always use Nuxt UI components by default**. Check the Nuxt UI MCP for available components and their APIs.

---

## Semantic Colors

Use semantic color names instead of direct color values:

| Color | Purpose |
|-------|---------|
| `primary` | CTAs, active states, brand, important links |
| `secondary` | Secondary buttons, alternatives |
| `success` | Success messages, positive states |
| `info` | Info alerts, help text |
| `warning` | Warnings, pending states |
| `error` | Errors, destructive actions |
| `neutral` | Text, borders, disabled states |

**Usage:**
```vue
<UButton color="primary">Primary Action</UButton>
<UButton color="secondary">Secondary Action</UButton>
<UAlert color="error">Error message</UAlert>
```

---

## Configuring Theme Colors

### In Nuxt Projects (app.config.ts)
```ts
export default defineAppConfig({
  ui: {
    colors: {
      primary: 'indigo',
      secondary: 'violet',
      success: 'emerald',
      error: 'rose'
    }
  }
})
```

### In Vue Projects (vite.config.ts)
```ts
ui({
  ui: {
    colors: {
      primary: 'indigo',
      secondary: 'violet'
    }
  }
})
```

---

## Adding Custom Colors

**3-Step Process:**

### 1. Register in nuxt.config.ts
```ts
export default defineNuxtConfig({
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'tertiary'] // Add new color
    }
  }
})
```

### 2. Define All 11 Shades in CSS
```css
/* assets/css/main.css */
@theme {
  --color-tertiary-50: #fef2f2;
  --color-tertiary-100: #fee2e2;
  --color-tertiary-200: #fecaca;
  --color-tertiary-300: #fca5a5;
  --color-tertiary-400: #f87171;
  --color-tertiary-500: #ef4444;
  --color-tertiary-600: #dc2626;
  --color-tertiary-700: #b91c1c;
  --color-tertiary-800: #991b1b;
  --color-tertiary-900: #7f1d1d;
  --color-tertiary-950: #450a0a;
}
```

### 3. Assign in app.config.ts
```ts
export default defineAppConfig({
  ui: { 
    colors: { 
      tertiary: 'tertiary' 
    } 
  }
})
```

**⚠️ All 11 shades (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950) are required.**

---

## Text Utilities

Semantic text color utilities with automatic dark mode support:

| Class | Light Mode | Dark Mode | Use Case |
|-------|-----------|-----------|----------|
| `text-dimmed` | 400 | 500 | Placeholders, hints |
| `text-muted` | 500 | 400 | Secondary text |
| `text-toned` | 600 | 300 | Subtitles |
| `text-default` | 700 | 200 | Body text |
| `text-highlighted` | 900 | 100 | Headings, emphasis |
| `text-inverted` | 50 | 950 | On dark/light backgrounds |

**Example:**
```vue
<h1 class="text-highlighted">Heading</h1>
<p class="text-default">Body text</p>
<span class="text-muted">Secondary info</span>
```

---

## Background Utilities

| Class | Light | Dark | Use Case |
|-------|-------|------|----------|
| `bg-default` | white | 900 | Page background |
| `bg-muted` | 50 | 800 | Subtle sections |
| `bg-elevated` | white | 800 | Cards, modals |
| `bg-accented` | 100 | 700 | Hover states |
| `bg-inverted` | 900 | 100 | Inverted sections |

---

## Border Utilities

| Class | Light | Dark |
|-------|-------|------|
| `border-default` | 200 | 800 |
| `border-muted` | 100 | 800 |
| `border-accented` | 200 | 700 |
| `border-inverted` | 900 | 100 |

---

## Global CSS Variables

Customize in your CSS file:

```css
:root {
  --ui-radius: 0.25rem;      /* Base border radius */
  --ui-container: 80rem;      /* Container max-width */
  --ui-header-height: 4rem;   /* Header height */
}
```

**Custom variables:**
```css
:root {
  --ui-primary: var(--ui-color-primary-700);
  --ui-radius: 0.5rem;
}

.dark {
  --ui-primary: var(--ui-color-primary-200);
}
```

---

## Using Solid Colors (Black/White)

Can't use `primary: 'black'` in config. Set via CSS:

```css
:root {
  --ui-primary: black;
}
.dark {
  --ui-primary: white;
}
```

---

## Component Customization

### Two Theme Structure Patterns

**CRITICAL:** Components use different theme structures. Your `app.config` MUST match the component's structure.

#### Pattern 1: Slots-Based (Most Components)
Used by: Button, Card, Input, Select, Badge, etc.

```ts
// ✅ CORRECT - Use slots
export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: 'font-bold rounded-full'
      },
      variants: {
        size: {
          md: { base: 'px-6 py-3' }
        }
      }
    }
  }
})
```

#### Pattern 2: Flat Base (Container, Skeleton, Form, Main)
Used by: Container, Skeleton, Form, Main, etc.

```ts
// ✅ CORRECT - Use flat base
export default defineAppConfig({
  ui: {
    container: {
      base: 'max-w-lg mx-auto'
    }
  }
})
```

### Common Mistakes

```ts
// ❌ WRONG - Don't use slots for flat-base components
ui: {
  container: {
    slots: { base: 'max-w-lg' }  // TypeScript error!
  }
}

// ❌ WRONG - Don't use flat for slots-based components
ui: {
  button: {
    base: 'font-bold'  // Won't work!
  }
}
```

### How to Check Component Structure
1. Visit: `https://ui.nuxt.com/components/[component]`
2. Check the "Theme" section
3. Match that structure in your `app.config.ts`

---

## Per-Component Overrides

### Global Override (app.config.ts)
```ts
export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: 'font-bold rounded-full'
      },
      variants: {
        size: {
          md: { base: 'px-6 py-3' }
        }
      },
      compoundVariants: [{
        color: 'neutral',
        variant: 'outline',
        class: { base: 'ring-2' }
      }],
      defaultVariants: {
        color: 'neutral',
        variant: 'outline'
      }
    }
  }
})
```

### Component-Level Override
```vue
<!-- ui prop overrides slots -->
<UButton :ui="{ base: 'font-mono' }">Custom</UButton>

<!-- class prop overrides root/base slot -->
<UButton class="rounded-none">Square</UButton>
```

---

## Dark Mode

Nuxt UI uses `@nuxtjs/color-mode` for dark mode:

```ts
// Composable
const colorMode = useColorMode()
colorMode.preference = 'dark' // 'light', 'dark', 'system'
```

```vue
<!-- Built-in components -->
<UColorModeButton /> <!-- Toggle button -->
<UColorModeSelect /> <!-- Dropdown select -->
```

---

## Best Practices Checklist

### ✅ Do
- Use semantic colors (`primary`, `error`, `success`, etc.)
- Override via `app.config.ts` for global changes
- Use CSS variables for custom colors and design tokens
- Define all 11 shades for custom colors
- Use text utilities (`text-default`, `text-muted`, etc.)
- Match component theme structure (slots vs flat)
- Check Nuxt UI MCP for component APIs

### ❌ Don't
- Hardcode hex values directly in components
- Modify source theme files
- Skip dark mode variants in custom CSS
- Use partial shade definitions (missing shades)
- Mix up slots-based and flat-base theme structures
- Forget to check component documentation for correct structure

---

## Quick Reference

```vue
<!-- Semantic Colors -->
<UButton color="primary">Primary</UButton>
<UButton color="secondary">Secondary</UButton>
<UAlert color="error">Error message</UAlert>

<!-- Text Utilities -->
<h1 class="text-highlighted">Heading</h1>
<p class="text-default">Body</p>
<span class="text-muted">Secondary</span>

<!-- Background Utilities -->
<div class="bg-elevated">Card</div>
<div class="bg-muted">Section</div>

<!-- Component Customization -->
<UButton :ui="{ base: 'font-mono' }">Custom</UButton>
<UButton class="rounded-none">Override</UButton>

<!-- Dark Mode -->
<UColorModeButton />
```

---

## Documentation Resources

- **Nuxt UI Docs:** https://ui.nuxt.com
- **Component API:** Check Nuxt UI MCP
- **Theming Guide:** https://ui.nuxt.com/getting-started/theme
- **Color Mode:** https://color-mode.nuxtjs.org