## Architecture overview

This template follows a **feature-first** structure with a small set of shared primitives.

Top-level source layout:

- `src/features/*` – feature modules (auth, etc.)
- `src/shared/*` – cross-cutting building blocks (UI, theme, routing, toast, utils)
- `src/pages/*` – app-level pages that compose features
- `src/test/*` – test setup and helpers
- `src/App.tsx` – root router + global providers

---

## Features

### Auth feature (`src/features/auth`)

Responsible for user identity, session state, and auth pages.

Files:

- `auth.types.ts`
  - `AuthUser`, `AuthSession`, `AuthStatus`, `AuthProvider`.
- `auth.service.ts`
  - Real implementations for:
    - `loginWithEmail`
    - `registerWithEmail`
    - `loginWithGoogle`
    - `logout`
  - Email users are persisted to `localStorage`.
  - Google auth uses Google Identity Services directly and calls Google userinfo.
- `googleClient.ts`
  - Lazy-loads the Google Identity Services script.
  - Wraps `google.accounts.oauth2.initTokenClient`.
- `auth.store.ts`
  - Central auth **Zustand store**:
    - `status`, `session`, `error`.
    - Action methods that call the service and update state.
  - Uses `persist` middleware to store `session`.
- `useAuth.ts`
  - Hook that reads auth state and exposes convenience helpers.
- `components/*`
  - `AuthCard` – wrapped card layout for login/register.
  - `GoogleLoginButton` – triggers Google auth flow.
  - `LoginForm` – email + password + Google sign-in.
  - `RegisterForm` – name + email + password + Google sign-in.
- `pages/*`
  - `LoginPage` – wraps `LoginForm` in a centered card.
  - `RegisterPage` – wraps `RegisterForm` similarly.
  - `AuthCallbackPage` – placeholder route to handle OAuth callbacks in the future.

Testing:

- `__tests__/auth.store.test.ts` – basic store behavior check.

Guideline:

- For new features, mirror this structure:
  - `service` (API calls), `store` (Zustand), `components`, `pages`, `__tests__`.

---

## Shared modules

### Shared UI (`src/shared/ui`)

Small, composable UI primitives styled with Tailwind and shadcn conventions:

- `button.tsx` – base button with variants (default, secondary, outline, ghost, destructive, link, icon sizes).
- `input.tsx` – text input.
- `label.tsx` – form label built on Radix.
- `card.tsx` – card container + header/content/footer/title/description.
- `separator.tsx` – vertical/horizontal Radix separator.
- `index.ts` – re-exports everything.

These components do not depend on features; features import from `@/shared/ui`.

### Shared components (`src/shared/components`)

- `Container.tsx`
  - Page layout width constraint.
  - Used in header, landing, dashboard, and auth pages.
- `AppShell.tsx`
  - Application header:
    - Logo/link to `/`.
    - Nav links to landing + dashboard.
    - Auth actions (login/register vs user info + logout).
    - Theme toggle button.
  - Uses `useAuth` and `useToast` for logout behavior.
- `ThemeToggle.tsx`
  - Wraps `useTheme`, renders an icon button to toggle theme.
- `FullScreenLoader.tsx`
  - Used by protected/public route wrappers during auth bootstrap.

### Shared lib (`src/shared/lib`)

- `utils.ts`
  - `cn()` utility: `clsx` + `tailwind-merge`.

### Routing helpers (`src/shared/routes`)

- `ProtectedRoute.tsx`
  - Depends on `useAuthStore`.
  - Shows `FullScreenLoader` while status is `idle` or `loading`.
  - Redirects unauthenticated users to `/login` with `from` location.
  - Renders nested routes via `<Outlet />`.
- `PublicOnlyRoute.tsx`
  - Shows `FullScreenLoader` when auth status is `idle`/`loading`.
  - If authenticated, redirects to `/app`.
  - Otherwise renders `<Outlet />`.

### Theme system (`src/shared/theme`)

- `ThemeProvider.tsx`
  - Manages theme state:
    - `theme: 'light' | 'dark' | 'system'`
    - `resolvedTheme: 'light' | 'dark'`
  - Persists setting in `localStorage` (`template_theme`).
  - Applies/removes `dark` class on `<html>` to drive CSS variables in `index.css`.
- `useTheme()`
  - Hook to read and update theme.
- Tests:
  - `__tests__/ThemeProvider.test.tsx` – sanity-checks context.

### Toast system (`src/shared/toast`)

- `ToastProvider.tsx`
  - Internal toasts state, auto-dismiss, and provider.
  - Framer Motion animations for stack of toasts in upper corner.
  - Exposes `show`, `success`, `error`.
- `useToast()`
  - Hook for features/components to trigger toasts.

Usage:

- Wrapped around the app in `App.tsx`.
- Used by auth components and header for login / register / logout messaging.

---

## Pages

Pages at `src/pages` are app-level compositions that stitch features and shared components together.

- `LandingPage.tsx`
  - Public landing page:
    - Hero section introducing the template.
    - CTA buttons to login/register.
    - Cards describing key features (modularity, protected routes, replaceable auth).
  - Uses `Container`, `Card`, `Button`, and Framer Motion.
- `DashboardPage.tsx`
  - Protected page only visible when authenticated.
  - Shows current user data from `useAuth` in a `<pre>` block.

Pattern:

- For new high-level routes, add a page in `src/pages` and connect it in `App.tsx`.
- For feature-specific routes, prefer putting the UI/page in the feature (`src/features/<name>/pages`) and import it into `App.tsx`.

---

## App root (`src/App.tsx`)

Responsibilities:

- Bootstraps auth store once on mount.
- Sets up **global providers**:
  - `ThemeProvider`
  - `ToastProvider`
  - `BrowserRouter`
- Renders:
  - `AppShell` (header)
  - Animated route outlet via `AnimatedRoutes` (`AnimatePresence` + `Routes`).

Route map:

- `/`
  - `LandingPage` (public).
- `/login`, `/register`
  - Wrapped in `PublicOnlyRoute`.
  - Render `LoginPage` / `RegisterPage`.
- `/auth/callback`
  - `AuthCallbackPage`.
- `/app`
  - Wrapped in `ProtectedRoute`.
  - Renders `DashboardPage`.

---

## Tailwind & styling

- `tailwind.config.js`
  - CS  variable-based color system (`--background`, `--foreground`, etc.).
  - Content sources: `index.html`, all TS/TSX in `src`.
  - Uses `tailwindcss-animate`.
- `src/index.css`
  - Light/dark theme tokens defined under `:root` and `.dark`.
  - Applies border + background + text defaults.

Guidelines:

- Prefer Tailwind utility classes for layout and spacing.
- Wrap repeated patterns in small shared components (e.g. `Container`, `Card`, `Button`).

---

## Testing structure

Testing uses **Vitest + Testing Library**:

- Global config in `vite.config.ts` (`test` key).
- Global setup:
  - `src/test/setupTests.ts` – jest-dom registration.
  - `src/test/testUtils.tsx` – `renderWithProviders`.

Tests live next to the code they exercise, under `__tests__` folders:

- `src/features/auth/__tests__/auth.store.test.ts`
- `src/features/auth/components/__tests__/LoginForm.test.tsx`
- `src/shared/theme/__tests__/ThemeProvider.test.tsx`

Pattern:

- Co-locate new tests:
  - `src/features/<feature>/__tests__/*.test.ts(x)` for stores/services.
  - `src/features/<feature>/components/__tests__/*.test.tsx` for UI.
  - `src/shared/<area>/__tests__/*.test.tsx` for shared components/hooks.

---

## Adding new features

Recommended steps for a new feature (e.g. `projects`):

1. Create folder `src/features/projects/`.
2. Add:
   - `projects.types.ts` (domain types).
   - `projects.service.ts` (API calls).
   - `projects.store.ts` (Zustand store if needed).
   - `components/` for UI.
   - `pages/` for feature-specific pages.
   - `__tests__/` for store/service tests.
3. Register routes in `App.tsx`:
   - Use `ProtectedRoute` or `PublicOnlyRoute` as needed.
4. Use shared primitives:
   - UI from `@/shared/ui`.
   - layout components from `@/shared/components`.
   - `useToast` for feedback.
   - `useAuth` and route guards for permissions.

This keeps concerns separated and makes it easy to grow the codebase without dumping everything into a single file or folder.

