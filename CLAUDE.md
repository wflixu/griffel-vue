# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

griffel-vue is a Vue 3 port of Microsoft's Griffel CSS-in-JS library. It provides high-performance styling solutions for Vue applications with SSR support, maintaining API compatibility with React's Griffel while adapting to Vue 3's composition API patterns.

## Development Commands

### Building and Development
```bash
npm run build        # Build the library using tsdown
npm run dev         # Watch mode development with tsdown
npm run play        # Run Vite playground for development
npm run typecheck   # Type checking with vue-tsc
```

### Testing
```bash
npm run test        # Run tests with Vitest
npm run coverage    # Run tests with coverage report
```

### Release
```bash
npm run release     # Version bump and publish to npm
npm run prepublishOnly  # Build before publishing
```

## Architecture

### Core Components

**Main Exports:**
- `makeStyles()` - Creates style hooks similar to React Griffel
- `makeResetStyles()` - For CSS reset styles
- `makeStaticStyles()` - For global static styles
- `RendererProvider` - Vue 3 provider component for renderer management
- `useRenderer_unstable()` - Hook to access the renderer
- `useInsertionEffect()` - Vue equivalent of React's useInsertionEffect

**Key Files:**
- [`src/index.ts`](src/index.ts) - Main exports and public API
- [`src/makeStyles.ts`](src/makeStyles.ts) - Core makeStyles implementation
- [`src/RendererContext.tsx`](src/RendererContext.tsx) - Vue provide/inject for renderer
- [`src/insertionFactory.ts`](src/insertionFactory.ts) - CSS insertion logic
- [`src/renderToStyleElements.ts`](src/renderToStyleElements.ts) - Style rendering utilities

### Architecture Patterns

**Vue 3 Composition API:**
- All functionality uses Vue 3's composition API and `<script setup>`
- Context pattern with Vue's `provide`/`inject` for renderer management
- SSR support through `canUseDOM()` environment checks

**Performance Optimizations:**
- CSS rule deduplication
- On-demand style insertion
- Cache-based rendering from core Griffel engine

**TypeScript Integration:**
- Strict TypeScript configuration with full type safety
- Declaration generation for TypeScript users

## Usage Pattern

**Required Initialization:**
```vue
<!-- Main app (e.g., App.vue) -->
<script setup>
import { useRenderer_unstable } from 'griffel-vue'
useRenderer_unstable() // Initialize renderer
</script>
```

**Component Usage:**
```vue
<!-- css.ts -->
import { makeStyles } from 'griffel-vue'

export default makeStyles({
  button: {
    color: 'blue',
  },
})
```

```vue
<!-- Component.vue -->
<script setup>
import { useClasses } from './css'
const classes = useClasses()
</script>

<template>
  <button :class="classes.button">Button</button>
</template>
```

## Testing

- **Framework**: Vitest with Happy DOM
- **Test Files**: Located in `tests/` directory with comprehensive coverage
- **Coverage**: V8 coverage provider
- **Key Test Areas**: Core functionality, SSR support, rendering, RTL support

## Build System

- **Primary Tool**: `tsdown` for TypeScript builds
- **Development**: Vite for playground and development
- **Package**: Uses pnpm for package management
- **Module System**: ES modules with modern `type: "module"` configuration

## Important Notes

- The library depends on `@griffel/core` for the underlying CSS-in-JS engine
- Must call `useRenderer_unstable()` at the root of the application
- Maintains API compatibility with React Griffel where possible
- Handles both client-side and server-side rendering scenarios