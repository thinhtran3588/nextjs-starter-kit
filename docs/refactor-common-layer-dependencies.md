# Refactor: Remove common → modules and common/modules → application

**Goal:** So that `common` does not depend on `modules`, and neither `common` nor `modules` depend on `application`, except at composition/wiring points (app layouts and container registration).

**Principles:**

- **common**: Shared UI, routing, utils, domain types. No imports from `modules` or `application`.
- **modules**: Feature code. No imports from `application`; infrastructure may receive app-level config via DI.
- **application**: App-level config, i18n, container registration. Wires modules and provides config (menu, Firebase, messages) to the app.

---

## 1. Common → modules

### 1.1 MainHeader (common) → auth module

**Current:** `MainHeader` imports `useAuthUserStore`, `SignOutUseCase`, and uses `useContainer()` to resolve sign-out.

**Proposal:** Make the header auth-agnostic by accepting an **auth slot**.

- **MainHeader** (common):
  - Add optional prop: `authSlot?: ReactNode`.
  - Remove: `useAuthUserStore`, `useContainer`, `SignOutUseCase`, and any `@/modules/auth` imports.
  - In the header nav (desktop and mobile), render `authSlot` where the current user/sign-in/sign-out UI is. When `authSlot` is missing, render nothing (or a placeholder) in that area.

- **AuthHeaderSlot** (new, in `modules/auth`):
  - Client component that uses `useAuthUserStore`, `useContainer`, and `SignOutUseCase`.
  - Receives labels as props: `signInLabel`, `profileLabel`, `signOutLabel`.
  - Renders the same dropdown/sign-in button UI that today lives inside MainHeader (loading state, user menu, sign-in link).

- **Composition:** The layout that uses `MainLayout` (e.g. `app/[locale]/(marketing)/layout.tsx`) imports `MainLayout` from common and `AuthHeaderSlot` from `modules/auth`, and passes `authSlot={<AuthHeaderSlot signInLabel={...} profileLabel={...} signOutLabel={...} />}` into `MainLayout` (see 2.1). So common never imports modules.

**Files:**

- `src/common/components/main-header.tsx`: add `authSlot?: ReactNode`, remove auth hooks/container/use-case, render `authSlot`.
- New: `src/modules/auth/components/auth-header-slot.tsx`: current auth UI + `useAuthUserStore` + `useContainer` + sign-out.
- `src/common/components/main-layout.tsx`: accept `authSlot?: ReactNode` and pass it to `MainHeader`.

---

### 1.2 AppInitializer (common) → auth module

**Current:** `AppInitializer` calls `initializeContainer()` and `useSyncAuthState()` (from `@/modules/auth`).

**Proposal:** Split bootstrap from auth sync; keep common free of modules.

- **AppInitializer** (common):
  - Only runs `initializeContainer()` when the container is not set.
  - Remove any import from `@/modules/auth` (e.g. `useSyncAuthState`).

- **SyncAuthState** (new, in `modules/auth`):
  - Client component that only calls `useSyncAuthState()` and returns `null`.
  - Rendered next to `AppInitializer` by the app layout.

- **Composition:** The layout that renders the app shell (e.g. `app/[locale]/layout.tsx`) renders both `AppInitializer` and `SyncAuthState`. So either:
  - **Option A:** `RootLayout` (common) accepts an optional `afterInitSlot?: ReactNode` and renders `<> <AppInitializer /> {afterInitSlot} {children} </>`. The app layout passes `afterInitSlot={<SyncAuthState />}` and imports `SyncAuthState` from `modules/auth`.
  - **Option B:** Do not use `RootLayout` for this; in `app/[locale]/layout.tsx` render `<> <AppInitializer /> <SyncAuthState /> <RootLayout>{children}</RootLayout> </>` (or equivalent) and import both from common and modules.

Recommendation: **Option A** so a single root layout component stays in common and composition stays in app.

**Files:**

- `src/common/components/app-initializer.tsx`: remove `useSyncAuthState`, keep only container init.
- New: `src/modules/auth/components/sync-auth-state.tsx`: `export function SyncAuthState() { useSyncAuthState(); return null; }`.
- `src/common/components/root-layout.tsx`: add optional `afterInitSlot?: ReactNode`, render it after `AppInitializer`.
- `app/[locale]/layout.tsx`: import `SyncAuthState` from `@/modules/auth`, pass `afterInitSlot={<SyncAuthState />}` to `RootLayout`.

---

## 2. Common → application

### 2.1 MainLayout (common) → application (main menu)

**Current:** `MainLayout` imports `getMainMenuConfig` from `@/application/config/main-menu` and resolves menu items internally.

**Proposal:** MainLayout receives already-resolved data; the caller gets menu config from application.

- **MainLayout** (common):
  - Remove import of `getMainMenuConfig`.
  - Accept **resolved** `menuItems: ResolvedMenuItem[]` (and any other needed props like `badge`, `localeOptions`, labels, `authSlot`) from the parent. No call to `getMainMenuConfig()` inside common.

- **resolveMenuItems** (common):
  - Extract the current `resolveMenuItems` from `main-layout.tsx` into a shared util (e.g. `src/common/utils/menu.ts` or next to menu types) and export it. Signature: `(items: MenuItem[], t: (key: string) => string) => ResolvedMenuItem[]`. It only depends on `MenuItem` / `ResolvedMenuItem` and a translate function.

- **Composition:** The layout that uses MainLayout (e.g. `app/[locale]/(marketing)/layout.tsx`) is a server component that:
  - Imports `getMainMenuConfig` from `@/application/config/main-menu`.
  - Imports `resolveMenuItems` (and types) from common, `getTranslations`, `getLocale`, `routing` from common.
  - Computes `menuConfig = getMainMenuConfig()`, `menuItems = resolveMenuItems(menuConfig, t)`.
  - Imports `AuthHeaderSlot` from `modules/auth`.
  - Renders `<MainLayout menuItems={menuItems} ... authSlot={<AuthHeaderSlot ... />} />`.

So common does not import application; the app layout does.

**Files:**

- `src/common/components/main-layout.tsx`: remove `getMainMenuConfig`, accept `menuItems` (and `authSlot`) as props; optionally use shared `resolveMenuItems` internally if you still want to pass raw config in one place, but recommended: caller passes `menuItems` and common does not import application.
- New or existing: `src/common/utils/menu.ts` (or `routing/menu.ts`): export `resolveMenuItems(MenuItem[], t) => ResolvedMenuItem[]`.
- `app/[locale]/(marketing)/layout.tsx`: call `getMainMenuConfig()`, `resolveMenuItems()`, pass `menuItems` and `authSlot` to `MainLayout`.

---

### 2.2 request.ts (common/routing) → application (localization)

**Current:** `src/common/routing/request.ts` imports `en.json`, `vi.json`, `zh.json` from `@/application/localization` and uses them in `getRequestConfig` for next-intl.

**Proposal:** Move next-intl request config into application so that message loading stays an application concern.

- Move the **file** (and its logic) from `src/common/routing/request.ts` to e.g. `src/application/i18n/request.ts` (or `src/application/routing/request.ts`).
  - New file imports messages from `@/application/localization/...` and uses `isSupportedLocale` / `routing` from `@/common/routing/routing` (application may depend on common for routing types and config).
  - Export the same `requestConfig` and default `getRequestConfig(requestConfig)`.

- **next.config.ts:** Point the next-intl plugin to the new path, e.g. `./src/application/i18n/request.ts`.

- **Tests:** Move or duplicate `src/__tests__/common/routing/request.test.ts` to e.g. `src/__tests__/application/i18n/request.test.ts` and update imports.

**Files:**

- New: `src/application/i18n/request.ts` (content from current `common/routing/request.ts`).
- Delete or deprecate: `src/common/routing/request.ts`.
- `next.config.ts`: update plugin path.
- Tests: adjust path and imports.

---

### 2.3 AppInitializer (common) → application (register-container)

**Current:** `AppInitializer` imports `initializeContainer` from `@/application/register-container`.

**Proposal:** Keep container initialization in application, but avoid common importing application.

- **Option A – Callback:** RootLayout (or the app layout) receives an optional `onMount?: () => void`. The app layout passes `onMount` that calls `initializeContainer()`. AppInitializer (common) only runs something like “ensure init ran once” and calls that callback if provided. So the callback is provided by the app layout (which imports application). Problem: someone still has to call `initializeContainer`; if AppInitializer doesn’t import it, the app layout must run it. So the app layout could do: `<> <AppInitializer onInit={initializeContainer} /> ... </>`. Then AppInitializer receives `onInit?: () => void`, and when container is null it calls `onInit?.()`. So common only knows “call this callback”; application supplies the implementation.

- **Option B – Move AppInitializer to application:** Put `AppInitializer` in `src/application/components/app-initializer.tsx`; it imports `initializeContainer` and optionally `useSyncAuthState` (or you keep SyncAuthState separate in auth module). Then common has no dependency on application for this. The app layout imports AppInitializer from application.

Recommendation: **Option B** – move `AppInitializer` to application. Then:
- Common’s `RootLayout` only receives `children` (and optionally `afterInitSlot` for SyncAuthState). The app layout renders `AppInitializer` (from application) and `SyncAuthState` (from modules/auth) and `RootLayout` (from common).
- Or RootLayout stays in common and accepts optional `beforeChildrenSlot?: ReactNode`; app layout passes `beforeChildrenSlot={<> <AppInitializer /> <SyncAuthState /> </>}`. Then RootLayout stays dumb and common still doesn’t import application.

**Recommended:** Move `AppInitializer` to `src/application/components/app-initializer.tsx`; it only runs `initializeContainer()`. Keep `SyncAuthState` in `modules/auth`. In `app/[locale]/layout.tsx`, render: `<> <AppInitializer /> <SyncAuthState /> <RootLayout>{children}</RootLayout> </>`. Then common has no dependency on application for init.

**Files:**

- Move: `src/common/components/app-initializer.tsx` → `src/application/components/app-initializer.tsx`; remove any remaining use of `useSyncAuthState` (handled by SyncAuthState in auth module).
- `src/common/components/root-layout.tsx`: remove `AppInitializer` from here; it will be rendered by the app layout.
- `app/[locale]/layout.tsx`: import `AppInitializer` from `@/application/components/app-initializer`, `SyncAuthState` from `@/modules/auth`, render them before `RootLayout`.

---

## 3. Modules → application (auth infrastructure)

**Current:** `FirebaseAuthenticationService` (auth infrastructure) imports `getAuthInstance` from `@/application/config/firebase-config`.

**Proposal:** Inject the Firebase Auth instance (or a getter) via the DI container so the auth module does not depend on application.

- **Container (application):** In `register-container.ts` (or wherever the root container is built), register a dependency that exposes the auth getter, e.g. `getAuthInstance`, before registering the auth module:
  - e.g. `container.register({ getAuthInstance: asFunction(getAuthInstance).singleton() });` (or a key like `authGetter` if you want to avoid naming the app function). Use the same key the auth service will expect.

- **FirebaseAuthenticationService** (auth module):
  - Remove the import of `getAuthInstance` from `@/application/config/firebase-config`.
  - In the constructor, accept a getter (e.g. `getAuth: () => Auth | null`) and store it (e.g. `private readonly getAuth: () => Auth | null`). Use it everywhere instead of `getAuthInstance()`.
  - Awilix: register the class with a parameter name that matches the registered key (e.g. `getAuthInstance`), so the container injects the app-registered function. So the service stays in the auth module and has zero imports from application.

- **Auth module registration:** When registering `FirebaseAuthenticationService`, do not import `getAuthInstance` in the auth module. The container is configured in application and already has `getAuthInstance` registered; Awilix will inject it by parameter name (e.g. `getAuthInstance`) into the auth service constructor.

**Files:**

- `src/application/register-container.ts`: register `getAuthInstance` (or `authGetter`) on the container before registering the auth module.
- `src/modules/auth/services/firebase-auth-service.ts`: replace direct `getAuthInstance()` usage with a constructor-injected getter (e.g. `private readonly getAuthInstance: () => Auth | null`). Use `this.getAuthInstance()` (or the chosen name) everywhere. Remove the import from `@/application/config/firebase-config`.

---

## 4. Summary of changes

| Area | Change |
|------|--------|
| **Common → modules** | MainHeader gets `authSlot`; new AuthHeaderSlot in auth. AppInitializer no longer runs useSyncAuthState; new SyncAuthState in auth. RootLayout accepts `afterInitSlot` (or app layout composes init + sync + RootLayout). |
| **Common → application** | MainLayout receives `menuItems` (and `authSlot`); caller uses getMainMenuConfig + resolveMenuItems. request.ts moved to application/i18n. AppInitializer moved to application (or init done via callback from app layout). |
| **Modules → application** | Firebase auth: inject `getAuthInstance` via container; FirebaseAuthenticationService receives it in constructor and has no application imports. |

---

## 5. Dependency direction after refactor

- **common:** No imports from `modules` or `application`. Only routing, utils, domain, UI.
- **modules:** No imports from `application`. Auth (and others) receive app-level config (e.g. Firebase) via DI.
- **application:** May import from `common` (e.g. routing, resolveMenuItems) and from `modules` only at wiring (e.g. register-container). Provides config and i18n; hosts next-intl request config and AppInitializer.
- **app/** (layouts): Compose everything: import MainLayout + getMainMenuConfig + resolveMenuItems + AuthHeaderSlot + AppInitializer + SyncAuthState + RootLayout and wire them together.

---

## 6. Testing

- **MainHeader:** Tests no longer mock `@/modules/auth/hooks/use-auth-user-store`; they pass `authSlot` (e.g. a simple div or a mock component). Sign-out and auth state are tested in AuthHeaderSlot / auth module tests.
- **MainLayout:** Tests pass in `menuItems` (and optionally `authSlot`) instead of relying on getMainMenuConfig; no application mocks in common tests.
- **request.ts:** After moving to application, update test path and any mocks (e.g. for `@/application/localization`).
- **FirebaseAuthenticationService:** Tests inject a mock getter (e.g. `() => mockAuth)` instead of mocking `getAuthInstance` from application.
- **AppInitializer:** If moved to application, move or duplicate its tests under `__tests__/application/` and keep mocking only container/application concerns.

This keeps boundaries clear: common is reusable and dependency-free of app and feature modules, and the app layer composes and configures everything.
