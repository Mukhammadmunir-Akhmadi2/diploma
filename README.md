# Fosso

Full-stack e-commerce platform: a Spring Boot REST API and a React single-page storefront with
merchant and admin dashboards.

The two applications live side by side in this repository and are developed, built and run
independently. The frontend talks to the backend over HTTP with a JWT bearer token.

## Repository layout

| Path | Description |
| --- | --- |
| [`fosso_backend/`](fosso_backend/) | REST API — Spring Boot 3.4.4, Java 21, MongoDB, MinIO |
| [`fosso_frontend/`](fosso_frontend/) | Web client — React 18, TypeScript, Vite 6, Tailwind CSS 4 |

Each directory has its own README with the detail for that side:

- [`fosso_backend/README.md`](fosso_backend/README.md) — full REST endpoint reference, domain model, architecture, configuration and Docker setup
- [`fosso_frontend/README.md`](fosso_frontend/README.md) — routes, state management, data layer and theming

## Architecture

```
┌──────────────────────┐        HTTP + JWT         ┌──────────────────────┐
│    fosso_frontend    │ ────────────────────────▶ │    fosso_backend     │
│  React SPA (Vite)    │ ◀──────────────────────── │  Spring Boot REST    │
│  port 5173           │        JSON               │  port 8080           │
└──────────────────────┘                           └───────────┬──────────┘
                                                               │
                                              ┌────────────────┴────────────────┐
                                              ▼                                 ▼
                                   ┌─────────────────────┐        ┌─────────────────────┐
                                   │       MongoDB       │        │   MinIO (S3 API)    │
                                   │  documents, orders  │        │   image objects     │
                                   │  port 27017         │        │   port 9000         │
                                   └─────────────────────┘        └─────────────────────┘
```

Images are uploaded to MinIO; MongoDB stores only the object key and metadata, and the API returns a
public URL built at read time.

## Domain overview

Three roles drive the feature set:

| Role | Can do |
| --- | --- |
| `USER` | Browse and filter the catalogue, manage a cart and addresses, check out, track orders, write reviews |
| `MERCHANT` | Everything a user can, plus create and manage their own products and images, and move their orders through fulfilment |
| `ADMIN` | Moderate users, products, categories and brands (enable/disable, soft-delete, restore, hard-delete) and read the action log |

The backend covers nine domains: `user`, `product`, `category`, `brand`, `order`, `cart`, `review`,
`image` and `action` (audit logging).

## Tech stack

**Backend**

| Concern | Choice |
| --- | --- |
| Language / runtime | Java 21 |
| Framework | Spring Boot 3.4.4 (Web, Security, Validation, Data MongoDB) |
| Database | MongoDB 7 |
| Object storage | MinIO via AWS SDK for Java v2 (`software.amazon.awssdk:s3`) |
| Auth | Spring Security + JWT (`io.jsonwebtoken:jjwt` 0.12.6) |
| Cross-cutting | Spring AOP + AspectJ for action logging |
| Build | Maven (wrapper included) |

**Frontend**

| Concern | Choice |
| --- | --- |
| Language | TypeScript 5.8 |
| UI | React 18.3 |
| Build tool | Vite 6 |
| Routing | React Router 6 |
| State | Redux Toolkit + redux-persist |
| Data fetching | RTK Query and Axios (see the frontend README — both are in use) |
| Styling | Tailwind CSS 4, shadcn/ui on Radix primitives, Ant Design for data-heavy admin screens |
| Forms | React Hook Form + Yup |

## Prerequisites

- JDK 21
- Node.js 18 or newer
- MongoDB — a local instance, the bundled Docker Compose service, or a MongoDB Atlas cluster
- MinIO or another S3-compatible store, if you need image upload to work

## Quick start

### 1. Backend

```bash
cd fosso_backend
cp env/dev.env.example env/dev.env      # then fill in real values
./mvnw spring-boot:run                  # Windows: mvnw.cmd spring-boot:run
```

The API starts on <http://localhost:8080>.

`env/*.env` files are gitignored; only the `.example` templates are tracked. The active Spring
profile comes from `SPRING_PROFILES_ACTIVE` in that file.

The fastest way to get MongoDB and a Mongo Express UI alongside the API:

```bash
docker compose -f docker-compose.dev.yml up --build
```

See the [backend README](fosso_backend/README.md#configuration) for the full variable list and the
other environments.

### 2. Frontend

```bash
cd fosso_frontend
npm install
npm run dev
```

The app opens on <http://localhost:5173>.

The API base URL is currently hardcoded to `http://localhost:8080` in `src/api/ApiClient.ts` and
`src/api/ApiClientSlice.ts` — change it there if your backend runs elsewhere. There is no
`.env` file to configure.

## Development

| Task | Command |
| --- | --- |
| Run backend tests | `cd fosso_backend && ./mvnw test` |
| Package backend jar | `cd fosso_backend && ./mvnw clean package` |
| Type-check and build frontend | `cd fosso_frontend && npm run build` |
| Lint frontend | `cd fosso_frontend && npm run lint` |
| Preview frontend production build | `cd fosso_frontend && npm run preview` |

The backend has no linter or formatter configured. The frontend uses ESLint 9 with a flat config
(`eslint.config.js`); `npm run build` runs `tsc -b` first, so type errors fail the build.

## Deployment notes

The backend ships a multi-stage `Dockerfile` (Temurin 21 JDK to build, JRE to run) and four Compose
files — `docker-compose.{dev,test,stage,prod}.yml` — each loading `env/<profile>.env`. The dev file
also brings up MongoDB and Mongo Express; the prod file runs the API alone and expects managed
MongoDB and object storage.

The frontend builds to static assets in `dist/` and can be served from any static host or CDN.

Two things to fix before this is production-ready: CORS in `SecurityConfig` currently allows every
origin pattern with credentials enabled, and the MinIO credentials in `application.properties` are
the `minioadmin` defaults. Both are fine for local work and must be tightened for a real deployment.
