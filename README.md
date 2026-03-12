## React + Zustand Template (Auth, Theme, Toast, Tests)

This is a reusable frontend template for future projects built with:

- **React 19 + TypeScript**
- **Zustand** for state management
- **Google + email auth** implemented in Zustand
- **React Router** with **public** and **protected** routes
- **Framer Motion** for page / UI transitions
- **Tailwind CSS + shadcn-style components**
- **Theme switcher** (light / dark / system) using CSS variables + `localStorage`
- **Toast system** for global success/error messages
- **Vitest + Testing Library** for unit/integration tests

---

## 1. Getting started

### Prerequisites

- Node 18+ (recommended)
- npm or pnpm/yarn (scripts assume `npm`)

### Install dependencies

```bash
npm install
```

### Run dev server

```bash
npm run dev
```

Vite will print a `localhost` URL (typically `http://localhost:5173`).

### Build for production

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Tests (Vitest)

```bash
npm run test        # run once
npm run test:watch  # watch mode
npm run test:ui     # Vitest UI
```

---

## 2. Environment variables

Create a `.env.local` file in the project root for local development:

```bash
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

- This must be a **Web application** OAuth client from Google Cloud Console.
- Add `http://localhost:5173` (or your dev origin) as an **Authorized JavaScript origin**.

---

## 3. Auth: email + Google (Zustand)

Auth is completely frontend-driven and lives under `src/features/auth`:

- `auth.types.ts` – shared TypeScript types for `AuthUser`, `AuthSession`, `AuthStatus`.
- `auth.service.ts`
  - **Email auth**:
    - Stores users in `localStorage` under `template_email_users`.
    - `registerWithEmail` validates, checks duplicates, and saves `{ id, email, name, passwordHash }`.
    - `loginWithEmail` checks credentials and returns an `AuthSession`.
  - **Google auth**:
    - Uses **Google Identity Services** directly (no Firebase).
    - Retrieves an `access_token`, then calls `https://www.googleapis.com/oauth2/v3/userinfo`.
    - Maps Google user info to `AuthUser` with `provider: 'google'`.
- `googleClient.ts`
  - Loads the `https://accounts.google.com/gsi/client` script on demand.
  - Uses `google.accounts.oauth2.initTokenClient` for the real OAuth token flow.
- `auth.store.ts`
  - Zustand store with:
    - `status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated'`
    - `session: AuthSession | null`
    - `error: string | null`
  - Actions:
    - `bootstrap` – rehydrates from persisted session and sets `status`.
    - `loginWithEmail`, `registerWithEmail`, `loginWithGoogle`, `logout`.
    - `clearError`.
  - Uses `persist` middleware to store the session in `localStorage` (`template_auth`).
- `useAuth.ts`
  - Convenience hook to read `status`, `user`, and call auth actions.

### Auth pages

UI for auth lives under `src/features/auth/components` and `src/features/auth/pages`:

- `components/AuthCard.tsx` – shadcn-style card wrapper for auth forms.
- `components/LoginForm.tsx`
  - Google button + email form.
  - On success: redirects to previous URL or `/app`.
  - Shows inline error text and toasts.
- `components/RegisterForm.tsx`
  - Email/password/name registration.
  - On success: redirects to `/app`.
- `components/GoogleLoginButton.tsx` – “Continue with Google” button.
- `pages/LoginPage.tsx` / `pages/RegisterPage.tsx` – page shells that wrap forms.
- `pages/AuthCallbackPage.tsx` – placeholder for future OAuth callback handling (currently just redirects).

---

## 4. Routing: public + protected

Routing is defined in `src/App.tsx` with **React Router**:

- Public routes:
  - `/` – landing page (`src/pages/LandingPage.tsx`)
  - `/login`, `/register` – auth pages, wrapped in `PublicOnlyRoute`.
- Protected routes:
  - `/app` – dashboard (`src/pages/DashboardPage.tsx`), wrapped in `ProtectedRoute`.
- Other:
  - `/auth/callback` – OAuth callback placeholder.

Shared routing helpers live in `src/shared/routes`:

- `ProtectedRoute.tsx`
  - Reads auth status from Zustand.
  - While `idle`/`loading` → shows `FullScreenLoader`.
  - If not authenticated → redirects to `/login` with `from` state.
  - If authenticated → renders nested route via `<Outlet />`.
- `PublicOnlyRoute.tsx`
  - While `idle`/`loading` → shows `FullScreenLoader`.
  - If authenticated → redirects to `/app`.
  - Otherwise → renders `<Outlet />`.

Route transitions use **Framer Motion**’s `<AnimatePresence>` in `App.tsx`.

---

## 5. UI: Tailwind + shadcn-style components

### Tailwind configuration

- `tailwind.config.js`
  - Scans `./index.html` and `./src/**/*.{ts,tsx}`.
  - Defines CSS variable-driven colors for background, text, borders, etc.
  - Includes `tailwindcss-animate` plugin.
- `src/index.css`
  - Registers `@tailwind base/components/utilities`.
  - Defines `:root` and `.dark` color tokens for light/dark themes.
  - Applies `bg-background` and `text-foreground` to `body`.

### Shared UI components

Located under `src/shared/ui`:

- `button.tsx` – variant-based button using `class-variance-authority`.
- `input.tsx` – text input styled with Tailwind/shadcn conventions.
- `label.tsx` – Radix-based label.
- `card.tsx` – card + header + content + footer components.
- `separator.tsx` – Radix separator wrapper.
- `index.ts` – re-exports for ergonomics.

Utility:

- `src/shared/lib/utils.ts` – `cn()` helper combining `clsx` + `tailwind-merge`.

Layout helpers:

- `src/shared/components/Container.tsx` – responsive max-width container.
- `src/shared/components/AppShell.tsx`
  - Top header with navigation, auth actions, and theme toggle.
- `src/shared/components/FullScreenLoader.tsx`
  - Simple full-height loader using Framer Motion.

Landing and dashboard pages:

- `src/pages/LandingPage.tsx`
  - Public landing with animated hero and feature cards.
- `src/pages/DashboardPage.tsx`
  - Protected dashboard showing the current `user` object from the auth store.

---

## 6. Theme: light / dark / system

Theme support lives in `src/shared/theme/ThemeProvider.tsx`:

- `ThemeProvider`
  - Manages `theme: 'light' | 'dark' | 'system'`.
  - Persists choice in `localStorage` under `template_theme`.
  - Applies or removes the `dark` class on `<html>` depending on:
    - Explicit theme, or
    - System preference when theme is `"system"`.
- `useTheme()`
  - Returns `{ theme, resolvedTheme, setTheme }`.

Header toggle:

- `src/shared/components/ThemeToggle.tsx`
  - Small icon button that toggles between light/dark (respecting system for initial value).

Provider usage:

- `App.tsx` wraps the entire app with `<ThemeProvider>`.

---

## 7. Toasts: global success/error notifications

Toast system is in `src/shared/toast/ToastProvider.tsx`:

- `ToastProvider`
  - Holds an internal list of toasts in React state.
  - Auto-dismisses toasts after a timeout (~3.5s).
  - Renders `<Toaster>` overlay with Framer Motion animations.
- `useToast()`
  - `show({ title, description, variant })`
  - `success(description, title?)`
  - `error(description, title?)`

Provider usage:

- `App.tsx` wraps the app with `<ToastProvider>` inside `<ThemeProvider>`.

Examples:

- `AppShell.tsx`
  - On logout → `success('You have been logged out.')`.
- `LoginForm.tsx`
  - On successful login → `success('Logged in successfully.')`.
  - On error → `error(state.error)`.
- `RegisterForm.tsx`
  - On successful registration → `success('Account created and logged in.')`.
  - On error → `error(state.error)`.

---

## 8. Tests: Vitest + Testing Library

Testing setup:

- **Runner**: Vitest
- **DOM environment**: jsdom
- **React Testing Library**: `@testing-library/react`, `@testing-library/user-event`
- **Matchers**: `@testing-library/jest-dom`

Config:

- `vite.config.ts` includes:

```ts
test: {
  environment: 'jsdom',
  setupFiles: './src/test/setupTests.ts',
  css: true,
}
```

Setup:

- `src/test/setupTests.ts`
  - Imports `@testing-library/jest-dom/vitest`.
- `src/test/testUtils.tsx`
  - `renderWithProviders` utility that wraps components in:
    - `ThemeProvider`
    - `ToastProvider`
    - `BrowserRouter`

Example tests:

- `src/features/auth/__tests__/auth.store.test.ts`
  - Basic bootstrap behavior for the auth store.
- `src/shared/theme/__tests__/ThemeProvider.test.tsx`
  - Ensures `ThemeProvider` + `useTheme` provide values.
- `src/features/auth/components/__tests__/LoginForm.test.tsx`
  - Ensures fields render and can be typed into.

---

## 9. How to reuse this template

For a new project:

1. **Clone or copy** this repo into a new folder.
2. Update `name` in `package.json` and any branding text (e.g. header “Template” label).
3. Configure `VITE_GOOGLE_CLIENT_ID` in `.env.local`.
4. Start dev server: `npm install && npm run dev`.
5. Add new features under `src/features/*` and routes in `App.tsx`, following the existing patterns:
   - Feature folder with `service`, `store`, `components`, `pages`.
   - Shared UI in `src/shared`.
   - Tests alongside features in `__tests__` subfolders.

From there, you can plug in a real backend or API client while keeping auth, theme, toast, and layout foundations intact.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
