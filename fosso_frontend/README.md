# 🛍️ E-Commerce Web App (Frontend)

A modern, full-featured **personal e-commerce project** built with **React + TypeScript**, **Redux Toolkit (RTK Query)**, **TailwindCSS**, and **React Router**.  
It provides a responsive storefront, merchant dashboard, and powerful admin interface with light/dark mode support.

---

## ✨ Features

### Core
- **Single-Page App** with code-splitting & lazy loading for smooth performance.
- **State Management**: Redux Toolkit + RTK Query for data fetching and caching.
- **Authentication & Authorization**  
  - JWT-based login/sign-up.  
  - Role-based access: **user**, **merchant**, **admin**.
- **User Management**  
  - Profile editing and user settings.
  - Admin can disable, ban, or permanently delete users and view user logs.

### Product & Catalog
- Product creation, editing, and deletion by merchants.
- Rich product browsing with filters: category, brand, gender, season, trending, and keyword search.
- Category & brand management with admin ability to edit/disable/delete.

### Ordering & Reviews
- Shopping cart and secure checkout flow.
- Order management for users, merchants, and admins.
- Product reviews and comments.

### Dashboards
- **Merchant Dashboard**: Manage products, track orders.
- **Admin Dashboard**:  
  - Oversee users, categories, brands, and products.  
  - Edit, disable, or delete any entity.  
  - View user activity logs.

### UI/UX
- TailwindCSS with reusable components and animations.
- Light/Dark theme toggle via Redux state.
- Responsive design for mobile, tablet, and desktop.

### Internationalization (i18n)

- Built-in multilingual support (English, Russian, - Uzbek).

- Utilities for nested key lookups and string interpolation:

- getNestedTranslation() resolves deep keys ("home.header.title").
---

## 🏗️ Tech Stack

| Layer           | Technology                        |
| --------------- | --------------------------------- |
| Framework       | React 18 + TypeScript             |
| Routing         | React Router v6                   |
| State/Data      | Redux Toolkit + RTK Query         |
| Styling         | TailwindCSS + TailwindCSS Animate |
| UI Components   | Ant Design (Spin, etc.) + custom  |
| Build Tool      | Vite or CRA (adjust as per setup) |
| Package Manager | npm / yarn / pnpm                 |

---

## 📂 Folder Structure

```
src/
├─ api/             # RTK Query API definitions
├─ components/      # Reusable UI & feature components
│  └─ ui/           # Toaster, Sonner, etc.
├─ hooks/           # Custom hooks (e.g., useLanguage)
├─ layout/          # Shared layouts (Layout, ProtectedLayout)
├─ locales/         # en/ru/uz translation files
├─ pages/           # Route-level pages (Index, CategoryPage, etc.)
├─ slices/          # Redux slices (auth, theme, language)
├─ store/           # Redux store & persistor setup
├─ utils/           # Helpers (translationUtils, etc.)
├─ App.tsx          # Main app with all routes
└─ main.tsx         # ReactDOM root
```

---

## 🖥️ Key Files

### `src/App.tsx`

* Wraps the app in `<BrowserRouter>` and sets up all routes.
* Uses `Suspense` + `lazy` for code-splitting.
* Integrates both `Toaster` and `Sonner` components for toast notifications.
* Toggles the `dark` class on `<html>` based on Redux theme state.

### `tailwind.config.ts`

* Class-based dark mode (`darkMode: ["class"]`).
* Centralized design tokens (colors, fonts, border radius).
* Custom animations (accordion open/close).
* `tailwindcss-animate` plugin for extra motion utilities.

### `src/index.css` (or `globals.css`)

* Declares CSS variables for light & dark modes.
* Adds global base styles and reusable component classes like `.nav-link`, `.product-card-details`, `.search-input`, etc.

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* npm / yarn / pnpm

### Installation

```bash
# clone the repo
git clone https://github.com/your-org/your-repo.git
cd your-repo

# install dependencies
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

This starts the app in development mode with hot reloading.

### Build for Production

```bash
npm run build
```

Outputs static assets to `dist/` (or `build/`).

### Preview Production Build

```bash
npm run preview
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root with your API endpoints and keys:

```
VITE_API_BASE_URL=https://api.example.com
```

---

## 🧩 Coding Guidelines

* **Type Safety**: Use TypeScript types/interfaces for props and API responses.
* **State Management**: Use RTK Query for API calls instead of Axios.
* **Styling**: Prefer Tailwind utility classes; create custom classes in `@layer components` when repeated.

---

## 🌓 Theming

The Redux theme slice toggles `dark` mode by adding/removing the `dark` class on `<html>`.
All colors are defined as HSL variables in CSS, making light/dark theme changes seamless.

---

## 🌐 Internationalization

useLanguage hook manages current language and provides a t() function.

Translations stored per language (/locales/en.ts, /locales/ru.ts, /locales/uz.ts).

Supports nested keys and dynamic interpolation for flexible UI text.

---

## 🛡️ Deployment

* Build artifacts can be hosted on **Vercel**, **Netlify**, or any static hosting (S3 + CloudFront, etc.).
* Ensure environment variables are configured in the hosting platform.
