# Fosso Backend

Spring Boot REST API for the Fosso e-commerce platform. Provides JWT authentication, role-based
authorization, the full product/order/cart/review domain, and S3-backed image storage on top of
MongoDB.

Consumed by [`fosso_frontend`](../fosso_frontend).

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Docker](#docker)
- [Architecture](#architecture)
- [API reference](#api-reference)
- [Testing](#testing)
- [Known quirks](#known-quirks)

## Tech stack

| Concern | Choice |
| --- | --- |
| Language | Java 21 |
| Framework | Spring Boot 3.4.4 — Web, Security, Validation, Data MongoDB |
| Database | MongoDB (Atlas or self-hosted; Compose ships MongoDB 7) |
| Object storage | MinIO or any S3-compatible store, via AWS SDK for Java v2 (`software.amazon.awssdk:s3` 2.48.1) |
| Auth | Spring Security + JJWT 0.12.6, stateless |
| Cross-cutting | Spring AOP + AspectJ for action logging |
| Boilerplate | Lombok 1.18.46 |
| Build | Maven, wrapper included |
| Tests | JUnit 5, Mockito, Spring Security Test |

## Getting started

### Prerequisites

- JDK 21
- MongoDB — local, Dockerised, or a MongoDB Atlas cluster
- MinIO or another S3-compatible store, if you need image upload to work

### Run it

```bash
cp env/dev.env.example env/dev.env      # fill in real values
./mvnw spring-boot:run                  # Windows: mvnw.cmd spring-boot:run
```

The API listens on <http://localhost:8080>.

### Build a jar

```bash
./mvnw clean package
java -jar target/fosso_backend-0.0.1-SNAPSHOT.jar
```

## Configuration

Configuration is split in two deliberately.

**`src/main/resources/application.properties`** is tracked in git and holds only shared,
non-sensitive defaults: application name, multipart limits, MongoDB auto-index creation, and the
`app.s3.*` block (which defaults to a local MinIO on `localhost:9000` with `minioadmin` credentials).

**`application-{dev,test,stage,prod}.properties`** hold environment-specific values as `${VAR}`
placeholders resolved from the process environment at startup:

```properties
spring.data.mongodb.uri=${MONGO_URI}
spring.data.mongodb.database=${MONGO_DATABASE}
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=${JWT_EXPIRATION:86400000}
server.port=${SERVER_PORT:8080}
```

Those variables come from `env/<profile>.env`. Real `.env` files are gitignored; only the
`.example` templates are tracked, so start by copying one:

```bash
cp env/dev.env.example env/dev.env
```

| Variable | Purpose |
| --- | --- |
| `SPRING_PROFILES_ACTIVE` | Which profile to activate (`dev`, `test`, `stage`, `prod`) |
| `MONGO_URI` | Full MongoDB connection string |
| `MONGO_DATABASE` | Database name |
| `MONGO_ROOT_USER`, `MONGO_ROOT_PASSWORD` | Credentials for the Compose-managed MongoDB container |
| `JWT_SECRET` | Signing secret — must be long enough for the HMAC algorithm in use |
| `JWT_EXPIRATION` | Token lifetime in milliseconds (default `86400000`, 24 h) |
| `SERVER_PORT` | HTTP port (default `8080`) |

### Object storage

`app.s3.*` in `application.properties` configures the image bucket:

| Property | Default | Meaning |
| --- | --- | --- |
| `app.s3.endpoint` | `http://localhost:9000` | S3 API endpoint the server writes to |
| `app.s3.public-url` | `http://localhost:9000` | Base URL used to build the public image URL returned in DTOs |
| `app.s3.access-key` / `app.s3.secret-key` | `minioadmin` | Credentials |
| `app.s3.bucket` | `fosso-images` | Bucket name |
| `app.s3.region` | `us-east-1` | Region sent to the SDK |

These are development defaults committed to the repository. Override them with real credentials —
and a real endpoint — before deploying anywhere.

Note that the Compose files do **not** start a MinIO container; run one yourself, for example:

```bash
docker run -p 9000:9000 -p 9001:9001 \
  -e MINIO_ROOT_USER=minioadmin -e MINIO_ROOT_PASSWORD=minioadmin \
  minio/minio server /data --console-address ":9001"
```

Uploads are capped at 10 MB per file and per request (`spring.servlet.multipart.*`).

## Docker

A multi-stage `Dockerfile` (Temurin 21 JDK to build, JRE to run) plus one Compose file per
environment, each loading `env/<profile>.env`:

| File | Brings up |
| --- | --- |
| `docker-compose.dev.yml` | API, MongoDB 7, Mongo Express (<http://localhost:8081>) |
| `docker-compose.test.yml` | API only |
| `docker-compose.stage.yml` | API only |
| `docker-compose.prod.yml` | API only, `restart: always` |

```bash
docker compose -f docker-compose.dev.yml up --build
```

The non-dev files assume MongoDB and object storage are provided externally.

## Architecture

### Package by feature, layered within each feature

Code lives under `src/main/java/com/fosso/backend/fosso_backend/<domain>/`, where `<domain>` is one
of `user`, `product`, `category`, `brand`, `order`, `cart`, `review`, `image` or `action`, alongside
the cross-cutting `common`, `config` and `security` packages.

Each domain is laid out the same way:

```
<domain>/
├─ controller/         REST endpoints; admin/ and merchant/ subpackages where roles differ
├─ dto/                Request and response DTOs
├─ mapper/             Hand-written static mappers (entity ↔ DTO)
├─ model/              MongoDB documents (@Document)
├─ repository/         Spring Data MongoDB repositories
└─ service/            Service interface, with impl/ for the implementation
```

Domains with role-specific behaviour split controllers and services into `admin/` and `merchant/`
subpackages beside the public one — for example
`product/controller/{ProductController, admin/AdminProductController, merchant/MerchantProductController}`.
A new endpoint belongs in the subpackage matching who may call it.

### Authentication and authorization

Stateless JWT (`SessionCreationPolicy.STATELESS`). `JwtTokenProvider` issues and validates tokens;
`JwtAuthenticationFilter` runs before `UsernamePasswordAuthenticationFilter` and populates the
`SecurityContextHolder`.

`AuthenticatedUserProvider.getAuthenticatedUser()` is the single way service and aspect code gets the
current `User` — do not re-derive it from `SecurityContextHolder` elsewhere.

Path-based rules are centralised in `config/SecurityConfig.java`:

| Access | Paths |
| --- | --- |
| Public | `/auth/**`, `/categories/**`, `/products/**`, `/brands/**`, `/reviews/**`, most of `/user/**` |
| `USER` | `/user/me/**`, `/cart/**`, `/orders/**` |
| `MERCHANT` | `/merchant/**`, `/images/merchant/**` |
| `ADMIN` | `/admin/**` |

Anything not listed falls through to `anyRequest().authenticated()`, so a new controller route is
authenticated but otherwise unrestricted until you add a matcher. Roles are defined in
`common/enums/Role.java`.

CORS is configured in the same filter chain and currently allows **all origin patterns with
credentials enabled** — convenient locally, unsafe in production.

### Action logging via AOP

Annotate a service method with `@Loggable(action=, entity=, message=)` (`common/aop/Loggable.java`).
`ActionLoggerAspect` wraps it with `@Around`, resolves the current user through
`AuthenticatedUserProvider`, and writes through `ActionLogService` — recording the entity ID on
success (taken from the first `String` argument or from a `LoggableEntity` result) or
`FAILED_<action>` when the method throws.

Use the annotation for new mutating service methods rather than logging by hand.

### Centralized error handling

`common/handler/GlobalExceptionHandler` (`@RestControllerAdvice`) maps the custom exceptions in
`common/exception/` — `ResourceNotFoundException`, `DuplicateResourceException`,
`ValidationException`, `UnauthorizedException`, `CartEmptyException`, `ImageStorageException` — plus
`IllegalArgumentException`, `IllegalStateException` and a generic `Exception` fallback, onto a
uniform `ErrorResponse` body carrying status, error and message.

Throw one of these instead of assembling error `ResponseEntity`s inside controllers.

### Image storage — Strategy + Factory

Image bytes go to an S3-compatible bucket through `ObjectStorageService` /
`S3ObjectStorageService`. The MongoDB `Image` document stores only metadata and an `objectKey`;
`ImageDTO.url` is built at read time by `ObjectStorageService.buildPublicUrl`.

Owner-specific behaviour — brand, category, product, product-main image, user avatar — lives in
paired `ImageOwnerHandler` / `ImageDeletionHandler` implementations under `image/strategy/`, picked
at runtime by `ImageOwnerHandlerFactory` based on the `ImageType` enum.

To support a new owner type: add an `ImageType` value and a handler/deletion-handler pair. The
factory discovers them automatically through Spring's injected `List<ImageOwnerHandler>` and
`List<ImageDeletionHandler>`.

### Category hierarchy

Categories are self-referential (parent/child). `CategoryHierarchyManager` and `CategoryParentManager`
own tree traversal and validation — root categories, subcategories, "categories above" a node,
nested views, and merging one category into another. Use them rather than writing recursive queries
against `CategoryRepository`.

### Orders

`Order` carries nested per-product tracking through `OrderDetail` and `OrderTrack`. Status can be
updated for the whole order or for a single product + colour + size within it, and cancellation
works at both levels the same way.

### Soft delete and enable/disable

Products, categories and brands carry **two independent flags**, not one state machine:

- soft delete — deleted vs active, with restore
- enable/disable — visibility

Admin controllers expose `/disabled`, `/deleted`, `/restore` and `/enabled/{status}` per domain.
Mirror this split for any new toggleable entity instead of overloading one enum.

### Pagination and filtering

List endpoints take `page`, `size` and `sort` (for example `sort=createdDateTime,desc`), handled by
`common/utils/PaginationUtil`. Product listing additionally accepts filter criteria through
`common/utils/FilterUtils`. Follow this convention rather than inventing new query-parameter shapes.

## API reference

All merchant and admin routes require a valid JWT with the matching role:

```
Authorization: Bearer <token>
```

Obtain a token from `POST /auth/login`. Paginated endpoints accept `page`, `size` and `sort`
throughout.

### Auth — `/auth`

| Method | Path | Description | Body / query |
| --- | --- | --- | --- |
| POST | `/login` | Log in, returns a JWT | `AuthRequest` (email, password) |
| POST | `/register` | Register a new user | `RegisterRequest` |
| GET | `/check-email` | Check email uniqueness | `email`, optional `userId` |

### User — `/user`

Current authenticated user:

| Method | Path | Description | Body |
| --- | --- | --- | --- |
| GET | `/me` | Current user, basic info | – |
| GET | `/me/profile` | Current user, full profile | – |
| PUT | `/me` | Update profile | `UserUpdateDTO` |
| DELETE | `/me` | Soft-delete (deactivate) the current user | – |
| PUT | `/me/password` | Change password | `PasswordChangeRequest` |

Addresses:

| Method | Path | Description | Body |
| --- | --- | --- | --- |
| GET | `/me/address` | List addresses | – |
| POST | `/me/address` | Add an address | `AddressDTO` |
| PUT | `/me/address` | Update an address | `AddressDTO` |
| DELETE | `/me/address/{addressId}` | Delete an address | – |

Avatar and public lookups:

| Method | Path | Description | Body |
| --- | --- | --- | --- |
| GET | `/me/avatar` | Current user's avatar | – |
| POST | `/me/avatar` | Upload or replace the avatar | Multipart `file` |
| GET | `/{userId}` | User by ID, brief | – |
| GET | `/{userId}/profile` | User by ID, full profile | – |

### Admin users — `/admin/user`

| Method | Path | Description | Body / query |
| --- | --- | --- | --- |
| GET | `/page` | Paginated user list | `page`, `size`, `sort` |
| GET | `/search` | Search users | `keyword` + paging |
| GET | `/{userId}` | User detail | – |
| PUT | `/{userId}` | Update a user profile | `UserUpdateDTO` |
| PUT | `/{userId}/address` | Update a user address | `AddressDTO` |
| PUT | `/{userId}/block` | Temporarily block a user | `banDuration` |
| PUT | `/{userId}/unblock` | Unblock a user | – |
| PUT | `/{userId}/role` | Change a user's role | `role` |
| PUT | `/user/{userId}/restore` | Restore a deleted user — note the repeated segment, the full path is `/admin/user/user/{userId}/restore` | – |
| DELETE | `/hard-delete/{userId}` | Permanently delete a user | – |

### Products

Public — `/products`:

| Method | Path | Description | Body / query |
| --- | --- | --- | --- |
| GET | `/products` | Paginated, filtered product list | `ProductFilterCriteria` + paging |
| GET | `/products/{productId}` | Product detail | – |
| PUT | `/products/{productId}/review-count/increment` | Increment the review count | – |

Merchant — `/merchant/products`:

| Method | Path | Description | Body / query |
| --- | --- | --- | --- |
| GET | `/merchant/products` | The merchant's own products | `page`, `size`, `sort` |
| GET | `/merchant/products/{productId}` | Own product detail | – |
| POST | `/merchant/products` | Create a product | `ProductCreateDTO` |
| PUT | `/merchant/products/{productId}` | Update a product | `ProductUpdateDTO` |
| PUT | `/merchant/products/{productId}/price` | Update price | `price`, optional `discountPrice` |
| PUT | `/merchant/products/{productId}/enabled/{status}` | Enable or disable | – |
| DELETE | `/merchant/products/{productId}` | Soft-delete | – |

Admin — `/admin/products`:

| Method | Path | Description | Body / query |
| --- | --- | --- | --- |
| GET | `/admin/products/page` | All products, optional search | `keyword` + paging |
| GET | `/admin/products/{productId}` | Product detail | – |
| GET | `/admin/products/disabled` | Disabled products | paging |
| GET | `/admin/products/deleted` | Soft-deleted products | paging |
| GET | `/admin/products/merchant/{merchantId}` | Products of one merchant | paging |
| PUT | `/admin/products/{productId}/enabled/{status}` | Enable or disable | – |
| PUT | `/admin/products/{productId}/restore` | Restore a soft-deleted product | – |
| DELETE | `/admin/products/{productId}` | Permanently delete | – |

### Orders

Customer — `/orders`:

| Method | Path | Description | Body / query |
| --- | --- | --- | --- |
| POST | `/orders` | Place an order, returns an `orderTrackingNumber` | `CheckoutRequest` |
| GET | `/orders/{orderId}` | Order detail | – |
| GET | `/orders/tracking/{trackingNumber}` | Find an order by tracking number | – |
| GET | `/orders/customer/{customerId}` | A customer's orders | paging |
| GET | `/orders/date-range` | Orders between two dates | `startDate`, `endDate` (ISO-8601) |
| DELETE | `/orders/{orderId}` | Cancel a whole order | raw `String` notes |
| DELETE | `/orders/{orderId}/product/{productId}` | Cancel one line item | raw `String` notes, `color`, `size` |

Merchant — `/merchant/orders`:

| Method | Path | Description | Body / query |
| --- | --- | --- | --- |
| GET | `/merchant/orders` | Orders for the authenticated merchant | paging |
| PUT | `/merchant/orders/{orderId}/status` | Update overall order status | `OrderStatusUpdateRequest` |
| PUT | `/merchant/orders/{orderId}/product/{productId}/status` | Update one line item's status | `OrderStatusUpdateRequest`, `color`, `size` |

Admin — `/admin/orders`:

| Method | Path | Description | Query |
| --- | --- | --- | --- |
| GET | `/admin/orders` | All orders, optional keyword search | `keyword` + paging |

### Categories

Public — `/categories`:

| Method | Path | Description | Params |
| --- | --- | --- | --- |
| GET | `/categories` | All categories | – |
| GET | `/categories/{id}` | Category by ID | `id` |
| GET | `/categories/root` | Root-level categories | – |
| GET | `/categories/parent/{parentId}` | Subcategories of a parent | `parentId` |
| GET | `/categories/above/{parentId}` | Ancestors of a category | `parentId` |
| GET | `/categories/hierarchical` | Full nested tree | – |
| GET | `/categories/page` | Paginated, optional search | `keyword` + paging |

Merchant — `/merchant/categories`:

| Method | Path | Description | Params |
| --- | --- | --- | --- |
| POST | `/merchant/categories/save` | Create a category | `CategoryDTO` |
| GET | `/merchant/categories/check_unique` | Check name uniqueness | `name`, optional `id` |

Admin — `/admin/categories`:

| Method | Path | Description | Params |
| --- | --- | --- | --- |
| GET | `/admin/categories/page` | Paginated, searchable | `keyword` + paging |
| GET | `/admin/categories/disabled` | Disabled categories | – |
| PUT | `/admin/categories/update` | Update a category | `CategoryDTO` |
| PUT | `/admin/categories/enable/{categoryId}` | Enable or disable | `enabled` |
| PUT | `/admin/categories/merge` | Merge one category into another | `sourceCategoryId`, `targetCategoryId` |
| DELETE | `/admin/categories/delete/{categoryId}` | Delete a category | `categoryId` |

### Brands

Public — `/brands`:

| Method | Path | Description | Params |
| --- | --- | --- | --- |
| GET | `/brands` | All brands | – |
| GET | `/brands/page` | Paginated, optional keyword | `keyword` + paging |
| GET | `/brands/{brandId}` | Brand by ID | `brandId` |
| GET | `/brands/name/{name}` | Brand by name | `name` |
| GET | `/brands/category/{categoryId}` | Brands in a category | `categoryId` |

Merchant — `/merchant/brands`:

| Method | Path | Description | Params |
| --- | --- | --- | --- |
| POST | `/merchant/brands` | Create a brand | `BrandDTO` |
| GET | `/merchant/brands/check-name` | Check name uniqueness | `name`, optional `brandId` |
| PUT | `/merchant/brands/{categoryId}/brand/{brandId}` | Add a category to a brand | `categoryId`, `brandId` |

Admin — `/admin/brands`:

| Method | Path | Description | Params |
| --- | --- | --- | --- |
| GET | `/admin/brands/page` | Paginated, searchable | `keyword` + paging |
| GET | `/admin/brands/disabled` | Disabled brands | – |
| PUT | `/admin/brands/{brandId}` | Update a brand | `BrandDTO` |
| PUT | `/admin/brands/{brandId}/enabled` | Enable or disable | `enabled` |
| DELETE | `/admin/brands/{brandId}` | Delete a brand | `brandId` |

### Cart — `/cart`

| Method | Path | Description | Body / query |
| --- | --- | --- | --- |
| GET | `/cart/{customerId}` | Cart items and totals | `customerId` |
| POST | `/cart/add` | Add a product | `CartItemCreateDTO` |
| PUT | `/cart/update` | Change item quantity | `cartId`, `quantity` |
| DELETE | `/cart/remove` | Remove an item | `cartId` |
| DELETE | `/cart/clear` | Empty the cart | – |

### Reviews — `/reviews`

| Method | Path | Description | Body / params |
| --- | --- | --- | --- |
| POST | `/reviews` | Create a review | `ReviewDTO` |
| PUT | `/reviews/{reviewId}` | Update a review | `ReviewDTO` |
| GET | `/reviews/customer/{customerId}` | A customer's reviews | `customerId` |
| GET | `/reviews/product/{productId}` | Paginated reviews for a product | paging |
| GET | `/reviews/product/{productId}/customer/{customerId}` | One customer's review of one product | – |

### Images — `/images`

| Method | Path | Description | Params |
| --- | --- | --- | --- |
| GET | `/images/user/{imageId}` | Image by ID | `imageType` |
| GET | `/images/user/owner/{ownerId}` | Image by owner | `imageType` |
| GET | `/images/user/{ownerId}/all` | All images for an owner | `imageType` |
| POST | `/images/merchant/products/{productId}` | Upload product images | `imageType`, `images[]` |
| POST | `/images/merchant/{ownerId}/upload` | Upload a single image | `imageType`, `image` |
| DELETE | `/images/merchant/{ownerId}/{imageId}/delete` | Delete an image | `imageType` |

### Action log — `/admin/actions`

| Method | Path | Description | Params |
| --- | --- | --- | --- |
| GET | `/admin/actions` | All action logs | – |
| GET | `/admin/actions/user/{userId}` | Logs for one user | `userId` |
| GET | `/admin/actions/resource/{resource}` | Logs for one resource type | `resource` |
| POST | `/admin/actions/log` | Record an action manually | `userId`, `action`, `resource`, `resourceId`, optional `details` |

Most logging happens automatically through `@Loggable`; the POST endpoint exists for cases the
aspect cannot cover.

## Testing

```bash
./mvnw test                                              # everything
./mvnw test -Dtest=FossoBackendApplicationTests          # one class
./mvnw test -Dtest=FossoBackendApplicationTests#contextLoads   # one method
```

No linter or formatter is configured for this project.

## Known quirks

Documented because they are real and callers have to work around them, not because they are
intentional:

- `PUT /admin/user/user/{userId}/restore` repeats the `user` segment — the controller is mapped to
  `/admin/user` and the method to `/user/{userId}/restore`.
- Uniqueness checks are inconsistently named: `/merchant/brands/check-name` uses a hyphen,
  `/merchant/categories/check_unique` uses an underscore.
- Order cancellation takes its notes as a raw `String` request body rather than a DTO.
- `application.properties` ships working `minioadmin` credentials, and CORS allows every origin with
  credentials enabled. Both are development conveniences that must be changed for production.
