# Fosso Frontend

React single-page application for the Fosso e-commerce platform: a public storefront, a customer
account area, a merchant dashboard and an admin console, all in one bundle and gated by role.

It talks to [`fosso_backend`](../fosso_backend) over HTTP with a JWT bearer token.

## Tech stack

| Concern | Choice |
| --- | --- |
| Language | TypeScript 5.8 (`strict`, `noUnusedLocals`, `noUnusedParameters`) |
| UI | React 18.3 |
| Build tool | Vite 6 with `@vitejs/plugin-react` |
| Routing | React Router 6 (`BrowserRouter`) |
| Global state | Redux Toolkit, persisted to `localStorage` with redux-persist |
| Server state | RTK Query (3 slices) and Axios (15 modules) — see [Data layer](#data-layer) |
| Styling | Tailwind CSS 4 via `@tailwindcss/vite`, with a v3-style `tailwind.config.ts` bridged in through `@config` |
| Components | shadcn/ui on Radix primitives, plus Ant Design for data-heavy admin and listing screens |
| Forms | React Hook Form with Yup resolvers |
| Icons | lucide-react |
| Notifications | Radix Toast (`ui/toaster`) and Sonner, both mounted |

## Getting started

```bash
npm install
npm run dev      # Vite dev server on http://localhost:5173, opens a browser
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with HMR (`vite --open`) |
| `npm run build` | `tsc -b` then `vite build` — type errors fail the build |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint 9 flat config over the whole project |

### Backend URL

There are **no environment variables**. The API base URL is hardcoded in two places and must be
changed in both if the backend is not on `http://localhost:8080`:

- `src/api/ApiClient.ts` — the Axios instance
- `src/api/ApiClientSlice.ts` — the RTK Query `fetchBaseQuery`

Moving these to `import.meta.env.VITE_API_BASE_URL` is the obvious next step; it has not been done.

## Project structure

```
src/
├─ api/                    # Server communication — one module per backend domain
│  ├─ ApiClient.ts         # Axios instance: base URL, bearer token, 401/403 → logout
│  ├─ ApiClientSlice.ts    # RTK Query base: same base URL, same auth + logout behaviour
│  ├─ *.tsx                # Axios function modules (Brand, Cart, Category, Order, Review, User, Log)
│  ├─ *ApiSlice.ts         # RTK Query slices (Auth, Image, Product)
│  ├─ admin/               # Admin-only calls
│  └─ merchant/            # Merchant-only calls
├─ components/             # Shared components used across more than one page
│  ├─ header/              # Header and its parts (menus, theme toggle, language, user dropdown)
│  └─ ui/                  # shadcn/ui primitives
├─ hooks/                  # useLanguage, useDebounce, useLoginHandler, useMobile, useToast
├─ layout/                 # Layout (header + footer shell), ProtectedLayout (auth gate)
├─ locales/                # en / ru / uz translation dictionaries
├─ pages/                  # Route targets; one folder per multi-part page
│  ├─ admin/               # Admin console (users, categories, brands, products)
│  ├─ cart/  checkout/  orderDetail/  profile/
│  ├─ merchantDashboard/  merchantOrderedProducts/
│  ├─ productCreate/  productDetails/  productFilter/
│  └─ *.tsx               # Single-file pages (Index, LoginPage, SignupPage, NotFoundPage, …)
├─ slices/                 # Redux slices: auth, theme, language, wishlist
├─ store/                  # Store setup, persistence config, typed hooks
├─ types/                  # Shared TypeScript types, mirroring backend DTOs
├─ utils/                  # translationUtils, dateUtils, statusUtils, cn() helper
├─ App.tsx                 # Route table and theme side effect
├─ main.tsx                # ReactDOM root, Redux Provider
└─ index.css               # Tailwind entry, CSS custom properties, component classes
```

The convention: a page that needs more than one component gets its own folder under `pages/`, and
only genuinely shared components live in `components/`.

## Routes

All routes below the `Layout` element render inside the shared header/footer shell. Routes nested in
`ProtectedLayout` require an authenticated session.

**Public**

| Path | Page |
| --- | --- |
| `/` | Home; `/womenswear` and `/menswear` render the same page with a gender filter |
| `/category`, `/category/:categoryId` | Filterable product listing |
| `/brand/:brandId`, `/brands` | Brand listing and brand-filtered products |
| `/trending` | Popular products |
| `/new-in` | Newest arrivals |
| `/search/:keyword` | Keyword search results |
| `/product/:id` | Product detail |
| `/cart`, `/wishlist` | Cart and wishlist |
| `/login`, `/signup`, `/terms` | Rendered outside the main layout |

Most listing routes have `women/…` and `men/…` variants that pass a `gender` prop to the same
component — for example `women/category/:categoryId` and `men/trending`.

**Authenticated (`USER`)**

| Path | Page |
| --- | --- |
| `/profile` | Profile shell; child routes `addresses`, `payment`, `orders`, `wishlist`, `settings` |
| `/order/:id` | Order detail and tracking |
| `/checkout` | Checkout flow |
| `/order-confirmation/:slug` | Post-checkout confirmation |

**Merchant**

| Path | Page |
| --- | --- |
| `/merchant/dashboard` | Product list and stats |
| `/merchant/create-product`, `/merchant/edit-product/:id` | Product form |
| `/merchant/ordered-products` | Incoming orders and status management |

**Admin**

| Path | Page |
| --- | --- |
| `/admin/users`, `/admin/users/:userId` | User management and detail |
| `/admin/categories`, `/admin/brands`, `/admin/products` | Catalogue moderation |
| `/admin/products/edit/:id` | Reuses the merchant product form |

Everything is imported eagerly in `App.tsx` — there is no `React.lazy`/`Suspense` code-splitting, so
the whole app ships in one chunk. Adding it is a straightforward win if bundle size becomes a
concern.

## Data layer

The API layer is deliberately documented as it is, because it is **hybrid**:

- **Axios** (`api/ApiClient.ts`) backs 15 modules that export plain `async` functions — brands,
  categories, cart, orders, reviews, users, logs, and the `admin/` and `merchant/` variants. Callers
  invoke them directly and manage their own loading state.
- **RTK Query** (`api/ApiClientSlice.ts`) backs three injected slices — `AuthApiSlice`,
  `ImageApiSlice`, `ProductApiSlice` — which give generated hooks with caching and invalidation.

Both clients share the same behaviour: attach `Authorization: Bearer <token>` from
`state.auth.token`, and dispatch `logout()` on a `401` or `403`. New code should prefer RTK Query;
the Axios modules are the older layer and are being migrated piecemeal.

## State management

Four slices, each persisted to `localStorage` under its own key:

| Slice | Holds |
| --- | --- |
| `auth` | JWT token and the current user |
| `theme` | `"light"` or `"dark"` |
| `language` | `"en"`, `"ru"` or `"uz"` |
| `wishlist` | Saved product IDs |

`serializableCheck` is disabled in the store because redux-persist actions are not serializable.
`store/hooks.ts` exports typed `useAppDispatch` and `useAppSelector` — use those, not the raw
react-redux hooks.

## Theming

`App.tsx` watches `state.theme.theme` and toggles the `dark` class on `<html>`. Colours are defined
once as HSL triples in CSS custom properties in `src/index.css` (`--background`, `--foreground`,
`--primary`, `--muted`, …) with a `.dark` override block, and `tailwind.config.ts` maps them to
Tailwind colour names via `hsl(var(--token))`.

The practical rule: use semantic classes like `bg-background` and `text-muted-foreground` rather than
literal colours, and both themes follow automatically. There is also a `fosso` brand palette and a
`sidebar` token group in the config.

## Internationalization

English, Russian and Uzbek. Translations are plain nested objects in `src/locales/{en,ru,uz}.ts`.

```tsx
const { t, language, setLanguage } = useLanguage();

t("home.header.title");
t("cart.itemCount", { count: 3 });
```

`useLanguage` reads the current language from the `language` slice and delegates to the `t` selector
in `slices/languageSlice.ts`, which resolves dotted keys through `getNestedTranslation` and fills
placeholders through `interpolateString` (both in `utils/translationUtils.ts`). The initial language
is guessed from `navigator.language` and falls back to English.

## Conventions

- **Types** — shared types live in `src/types/` and mirror the backend DTOs. Import them with
  `import type` (the project has `verbatimModuleSyntax` enabled).
- **Imports** — relative paths only. There is no `@/` path alias configured in `vite.config.ts` or
  `tsconfig.app.json`, despite `components.json` being present for shadcn/ui.
- **Styling** — Tailwind utilities first; promote a repeated pattern to a class in the
  `@layer components` block of `index.css`. Merge conditional classes with the `cn()` helper in
  `utils/utils.ts`.
- **Components** — page-specific components belong in that page's folder; only put something in
  `components/` once a second page needs it.
- **Unused code** — `src/components/ui/` holds only the shadcn/ui primitives actually imported.
  Scaffolded-but-unused ones have been removed; re-add with `npx shadcn@latest add <name>` when you
  need one.

## Known gaps

**`npm run build` currently fails.** `tsc -b` reports around 115 type errors across roughly 40
files, so only `npm run dev` works today — Vite's dev server does not type-check. Clearing these is
the highest-value cleanup available. The bulk fall into a few repeating patterns:

- `string | undefined` or `string | null` passed where a required `string` is expected, mostly from
  optional DTO fields being fed straight into props.
- RTK Query errors typed as `ApiError | SerializedError` but read as `error.data` / `error.status`
  without narrowing first.
- `noUnusedLocals` / `noUnusedParameters` violations — unused `result` and `error` parameters in
  `providesTags` / `invalidatesTags` callbacks.
- React Hook Form resolver mismatches where the Yup schema and the form's type argument have drifted
  apart.

Also outstanding:

- `src/locales/index.ts` imports `SupportedLanguage` and `Translations` from `../types/language`,
  which does not exist. `SupportedLanguage` is exported from `slices/languageSlice.ts` instead.
- No test setup — there is no test runner and no `test` script.
- `persistor` is exported from `store/store.ts` but no `PersistGate` is mounted, so the first paint
  can flash pre-rehydration state.
- `@types/react` is on v19 while `react` is on v18.3; they should be aligned.
- Several runtime dependencies in `package.json` are no longer imported anywhere in `src/` and could
  be dropped.
