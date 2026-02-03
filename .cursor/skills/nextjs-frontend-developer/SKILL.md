---
name: nextjs-frontend-developer
description: Guides frontend implementation using Next.js (App Router), shadcn/ui, Zustand, React Hook Form, Zod, and next-intl. Use when building or modifying Next.js UI, forms, validation, internationalization (i18n), translations, or when the user mentions Next.js frontend, shadcn, Zustand, React Hook Form, Zod, or next-intl.
---

# Next.js Frontend Developer (Next.js + shadcn/ui + Zustand + React Hook Form + Zod + next-intl)

## Stack Overview

- **Next.js**: App Router, React Server Components by default, file-based routing.
- **shadcn/ui**: Copy-paste components (Radix UI + Tailwind). Code lives in your repo under `components/ui/`. Use the CLI to add components or copy from [ui.shadcn.com](https://ui.shadcn.com).
- **Zustand**: Client-only global state. No provider; use in Client Components only.
- **React Hook Form**: Form state and submission; uncontrolled inputs, minimal re-renders. Use with shadcn form components.
- **Zod**: Schema validation and type inference. Use for form validation (via `@hookform/resolvers/zod`) and for validating API/Server Action input.
- **next-intl**: Internationalization (i18n) and translations. Locale-based routing (`app/[locale]/`), middleware for locale detection, messages per locale; use `getTranslations` (server) or `useTranslations` (client). [next-intl docs](https://next-intl.dev).

---

## Next.js Conventions

### App Router

- **Routes**: `app/[segment]/page.tsx` = page; `app/[segment]/layout.tsx` = layout.
- **Server vs Client**: Default is Server Component. Add `"use client"` at the top only when using hooks, browser APIs, or Zustand.
- **Client boundary**: Keep `"use client"` as low as possible (leaf components or small wrappers).

### File and Folder Conventions

- `app/` – routes, layouts, loading, error, not-found. With **next-intl**, nest under `app/[locale]/` so the first segment is the locale (e.g. `app/[locale]/page.tsx`).
- `components/` – shared components; `components/ui/` – shadcn components.
- `lib/` – utilities (e.g. `lib/utils.ts` with `cn()`), helpers, API clients.
- `stores/` – Zustand stores (optional; can use `lib/stores/`).
- `messages/` – next-intl translation JSON files (e.g. `messages/en.json`, `messages/de.json`). `i18n/` – next-intl routing config and request config (`i18n/request.ts`).

### Data and Actions

- **Server Components**: Fetch directly with `async` or use server-only data sources.
- **Mutations / forms**: Prefer Server Actions in `app/` or next to the feature; call from Client Components via `action` or `formAction`.

---

## shadcn/ui Usage

### Adding Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card dialog dropdown-menu
```

Components are added under `components/ui/` (e.g. `button.tsx`, `card.tsx`). Do not treat them as a black-box npm dependency; edit the copied code as needed.

### Styling and Theming

- Use **Tailwind** for layout and styling. Prefer existing design tokens (e.g. `primary`, `muted`, `destructive`).
- Use the **`cn()`** helper for conditional classes: `cn("base-classes", className)`.
- Theme is configured in `tailwind.config` and/or CSS variables (often in `app/globals.css`). Match shadcn’s expected variable names when customizing.

### Using Components

- Import from `@/components/ui/<component>` (or your configured alias).
- Compose primitives (e.g. `Card`, `CardHeader`, `CardContent`) rather than building one-off markup when a shadcn pattern exists.
- For forms: use shadcn form components with React Hook Form and Zod (see below).

---

## React Hook Form Usage

### Setup with Zod

- Use `@hookform/resolvers` to connect Zod schemas: `zodResolver(schema)`.
- Forms that use hooks need `"use client"` (or live in a Client Component).

### Form Pattern

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Required"),
  email: z.string().email(),
});

type FormValues = z.infer<typeof schema>;

export function MyForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "" },
  });

  return (
    <Form {...form}>
      {/* Use shadcn FormField, FormItem, FormControl, FormMessage */}
    </Form>
  );
}
```

### Conventions

- Define the Zod schema next to the form or in `lib/schemas/`; use `z.infer<typeof schema>` for the form type.
- Prefer shadcn `Form`, `FormField`, `FormItem`, `FormControl`, `FormMessage` with `form` from `useForm()` and `control` for controlled fields.
- Submit via `form.handleSubmit(onSubmit)`; call a Server Action inside `onSubmit` when using Next.js Server Actions.
- Use `mode: "onBlur"` or `mode: "onChange"` when you need validation before submit; default is `onSubmit`.

---

## Zod Usage

### Schema Location and Shape

- Place shared schemas in `lib/schemas/` (e.g. `lib/schemas/auth.ts`, `lib/schemas/user.ts`).
- Use for form validation (with React Hook Form) and for validating request bodies in Server Actions or API routes.

### Defining Schemas

```ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "At least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

### With React Hook Form

- Pass the schema to `zodResolver(schema)` in `useForm({ resolver: zodResolver(schema) })`.
- Type the form with `z.infer<typeof schema>` so inputs and errors are typed.

### With Server Actions

- Parse and validate in the Server Action: `const parsed = schema.safeParse(formData)`; use `parsed.success` and `parsed.data` or `parsed.error.flatten()`.
- Return field errors in a shape the client can map to form fields (e.g. `parsed.error.flatten().fieldErrors`).

### Conventions

- Export both the schema and the inferred type (`z.infer<typeof schema>`).
- Use `.optional()`, `.nullable()`, `.default()` as needed; use `.refine()` or `.superRefine()` for cross-field or custom rules.
- Keep schemas close to the feature or in `lib/schemas/` for reuse.

---

## next-intl Usage

### Setup Overview

- **Routing**: Define supported locales and default in `i18n/routing.ts` with `defineRouting({ locales: ['en', 'de'], defaultLocale: 'en' })`.
- **Proxy**: Root `proxy.ts` uses `createMiddleware(routing)` from `next-intl/middleware` so locale is detected and routes are prefixed (e.g. `/en/about`).
- **Messages**: JSON per locale in `messages/en.json`, `messages/de.json` (nested keys, e.g. `{ "common": { "submit": "Submit" } }`).
- **Request config**: `i18n/request.ts` uses `getRequestConfig` from `next-intl/server` to load messages for the current locale; wire it in `next.config` with the next-intl plugin or pass to `NextIntlClientProvider` in layout.
- **App structure**: All app routes live under `app/[locale]/` (e.g. `app/[locale]/layout.tsx`, `app/[locale]/page.tsx`). Root layout wraps children with `NextIntlClientProvider` when using client translations.

### Using Translations

- **Server Components**: `import { getTranslations } from 'next-intl/server';` then `const t = await getTranslations('namespace');` and `t('key')` or `t('key', { param: value })`. Use the namespace that matches your message structure (e.g. `getTranslations('common')` for `messages/en.json` → `common.submit`).
- **Client Components**: `import { useTranslations } from 'next-intl';` then `const t = useTranslations('namespace');` and `t('key')`. Component must be under the provider (layout wraps with `NextIntlClientProvider` and messages/locale).
- **Links and navigation**: Use `Link` and `useRouter` from `next-intl` (not `next/link` / `next/navigation`) so links and redirects keep the current locale.

### Conventions

- Keep message keys flat or nested consistently (e.g. `common.submit`, `form.email`); use namespaces in `getTranslations`/`useTranslations` to scope.
- For dates/numbers use next-intl formatters (`useFormatter`, or server equivalents) with the current locale.
- Use `generateStaticParams` in layout or page to return `[{ locale: 'en' }, { locale: 'de' }]` for static generation of all locales.

---

## Zustand Usage

### Store Location and Shape

- Place stores in `stores/` or `lib/stores/` (e.g. `stores/ui-store.ts`).
- One store per concern when possible (e.g. UI state, auth state).

### Creating a Store

```ts
// stores/ui-store.ts
"use client";

import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
```

### Using in Components

- **Only in Client Components**: Any file that uses `useUIStore()` (or any Zustand hook) must have `"use client"` at the top.
- Select slices to avoid unnecessary re-renders:

```tsx
"use client";

const sidebarOpen = useUIStore((s) => s.sidebarOpen);
const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
```

### SSR / Hydration

- Zustand is client-only. Do not read store state during server render.
- For persisted state (e.g. localStorage), use `persist` from `zustand/middleware` and ensure UI that depends on it doesn’t assume a value on first paint (handle hydration mismatch if needed).

---

## Quick Decision Guide

| Task | Approach |
|------|----------|
| New page or route | Add `app/.../page.tsx` (and optional `layout.tsx`). Prefer Server Component unless the page needs client state/hooks. |
| New reusable UI piece | Add to `components/`. If it matches a shadcn component, run `npx shadcn@latest add <name>`. |
| Global UI state (sidebar, modals, theme) | Zustand store in `stores/`. Use only in Client Components. |
| Server data on page | Fetch in async Server Component or use Server Action. |
| Form with validation | shadcn Form + React Hook Form + Zod (`zodResolver`); submit via Server Action when possible. |
| Translations / i18n | next-intl: `getTranslations` (server) or `useTranslations` (client); messages in `messages/{locale}.json`; routes under `app/[locale]/`; use next-intl `Link`/`useRouter` for locale-aware nav. |
| Styling | Tailwind + `cn()`. Prefer design tokens and shadcn-compatible variables. |

---

## Checklist for New Features

- [ ] Route lives under `app/` with correct `page.tsx` / `layout.tsx`.
- [ ] `"use client"` only on components that use hooks, browser APIs, or Zustand.
- [ ] UI built from `components/ui/` (shadcn) where applicable; new components added via shadcn CLI when they exist.
- [ ] Global client state in Zustand; store used only in Client Components with selective subscriptions.
- [ ] Data fetching in Server Components or Server Actions; no unnecessary client fetch when server can provide data.
- [ ] Forms use React Hook Form with Zod (`zodResolver`); schemas in `lib/schemas/` or next to feature; Server Actions validate with Zod when handling submit.
- [ ] When using next-intl: routes under `app/[locale]/`; translations via `getTranslations` (server) or `useTranslations` (client); message files in `messages/`; locale-aware `Link`/`useRouter` from `next-intl`.
- [ ] Styling via Tailwind and `cn()`; no inline styles unless required for dynamic values.
