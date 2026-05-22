---
title: "Mastering Tailwind CSS Dark Mode: System Detection to Manual Toggle"
date: "2025-03-20"
description: "A complete walkthrough of implementing dark mode in a Next.js app using Tailwind CSS class strategy and next-themes — from system detection to localStorage persistence."
categories: ["Frontend", "Design"]
tags: ["tailwind", "css", "design", "dark-mode", "nextjs"]
draft: false
---

# Mastering Tailwind CSS Dark Mode

Dark mode isn't just a trend — it's an accessibility feature. Getting it right means: respecting system preference by default, allowing manual override, and persisting the choice across visits without flash.

## The Strategy: Class-Based Dark Mode

Tailwind supports two dark mode strategies: `media` (follows system preference only) and `class` (controlled by adding `.dark` to `<html>`). Use `class` — it gives you control:

```typescript
// tailwind.config.ts
const config: Config = {
  darkMode: 'class',
  // ...
}
```

With this, any utility prefixed with `dark:` applies when the `html` element has class `dark`:

```html
<div class="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
  Content that adapts to dark mode
</div>
```

## next-themes: The Right Tool

`next-themes` handles the hard parts: system detection, localStorage persistence, and preventing the flash of wrong theme (FOWT):

```bash
npm install next-themes
```

Wrap your app in a `ThemeProvider`:

```tsx
// components/ThemeProvider.tsx
'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
```

```tsx
// app/layout.tsx
import { ThemeProvider } from '@/components/ThemeProvider'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

The `suppressHydrationWarning` on `<html>` suppresses the React warning that occurs when next-themes modifies the class attribute on the server-rendered HTML.

## The Toggle Component

```tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch — only render after mount
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />  // placeholder

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
```

The `mounted` guard is critical. Without it, the server renders with the wrong theme and React's hydration fails. The placeholder `div` with the same dimensions prevents layout shift.

## Styling Code Blocks for Both Themes

Shiki's dual-theme mode outputs CSS custom properties:

```css
/* globals.css */
.shiki,
.shiki span {
  color: var(--shiki-light);
  background-color: var(--shiki-light-bg);
}

.dark .shiki,
.dark .shiki span {
  color: var(--shiki-dark);
  background-color: var(--shiki-dark-bg);
}
```

This pairs with the `themes: { light: 'github-light', dark: 'github-dark' }` configuration in your rehype-shiki setup.

## Smooth Transitions

Add theme transitions to the root element:

```css
html {
  transition: background-color 0.2s ease, color 0.2s ease;
}
```

But be careful: `disableTransitionOnChange` in next-themes prevents the flash that happens when switching themes — it temporarily disables transitions, then re-enables them. This is the correct approach over CSS-only transitions.

## Debugging the Flash

If you see a flash of wrong theme:

1. Check `suppressHydrationWarning` is on `<html>`
2. Check `attribute="class"` in ThemeProvider
3. Make sure ThemeProvider wraps children in the server layout, not inside a client component tree that renders late
4. Verify `disableTransitionOnChange` is set

The flash happens when the server renders with the wrong class and the client corrects it after hydration. `next-themes` inserts an inline script in `<head>` to apply the theme class before React hydrates, eliminating the flash.
