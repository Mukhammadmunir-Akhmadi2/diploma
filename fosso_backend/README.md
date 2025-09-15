## Fosso Backend

A **Spring Boot 3.4 RESTful API** serving as the backend for the Fosso e-commerce platform.
It provides secure authentication, role-based authorization, product management, image handling, and a robust data layer on **MongoDB Atlas**.

---

### ✨ Key Features

* **Authentication & Authorization**

    * JWT-based login & registration
    * Role-based access control (`USER`, `MERCHANT`, `ADMIN`)
* **Full E-Commerce Backend**

    * Users: profiles, carts, orders, reviews
    * Merchants: product and image management
    * Admins: user/brand/category/product moderation & user activity logs
* **Centralized Error Handling** with consistent JSON responses
* **Action Logging (AOP)** with a custom `@Loggable` annotation
* **Image Management**

    * Upload, fetch, and delete product, brand, and profile images
    * Stores images in MongoDB as byte arrays (future-ready for AWS S3/static hosting)
    * Uses **Strategy** + **Factory** patterns for flexible image owner handling and deletion logic
* **File Upload Support** up to 10 MB
* **CORS Configured** for cross-origin SPA frontend

---

### 🏗️ Tech Stack

| Layer     | Technology                                                  |
| --------- | ----------------------------------------------------------- |
| Framework | Spring Boot 3.4                                             |
| Language  | Java 21                                                     |
| Database  | MongoDB Atlas                                               |
| Auth      | Spring Security + JWT                                       |
| Build     | Maven                                                       |
| Patterns  | Strategy & Factory (Image handling), AOP for action logging |
| Other     | Lombok                                                      |

---

## 🔐 Auth Endpoints (`/auth`)

| Method | Path           | Description                    | Body / Query                     |
| ------ | -------------- | ------------------------------ | -------------------------------- |
| POST   | `/login`       | User login – returns JWT token | `AuthRequest` (email, password)  |
| POST   | `/register`    | Register new user              | `RegisterRequest`                |
| GET    | `/check-email` | Check if email is unique       | `email`, optional `userId` query |

---

## 👤 User Endpoints (`/user`)

### Current Authenticated User

| Method | Path           | Description                           | Body / Query            |
| ------ | -------------- | ------------------------------------- | ----------------------- |
| GET    | `/me`          | Get current user (basic info)         | –                       |
| GET    | `/me/profile`  | Get full profile of current user      | –                       |
| PUT    | `/me`          | Update profile                        | `UserUpdateDTO`         |
| DELETE | `/me`          | Soft-delete (deactivate) current user | –                       |
| PUT    | `/me/password` | Change password                       | `PasswordChangeRequest` |

### Address Management

| Method | Path                      | Description                 | Body         |
| ------ | ------------------------- | --------------------------- | ------------ |
| GET    | `/me/address`             | List current user addresses | –            |
| POST   | `/me/address`             | Add address                 | `AddressDTO` |
| PUT    | `/me/address`             | Update address              | `AddressDTO` |
| DELETE | `/me/address/{addressId}` | Delete address by ID        | –            |

### Avatar

| Method | Path         | Description                   | Body             |
| ------ | ------------ | ----------------------------- | ---------------- |
| GET    | `/me/avatar` | Get current user avatar image | –                |
| POST   | `/me/avatar` | Upload/replace avatar         | Multipart `file` |

### Public User Data

| Method | Path                | Description                       |
| ------ | ------------------- | --------------------------------- |
| GET    | `/{userId}`         | Get user (brief info) by ID       |
| GET    | `/{userId}/profile` | Get user (detailed profile) by ID |

---

## 🛠️ Admin User Management (`/admin/user`)

| Method | Path                     | Description                     | Body / Query             |
| ------ | ------------------------ | ------------------------------- | ------------------------ |
| GET    | `/page`                  | Paginated list of users         | `page`, `size`, `sort`   |
| GET    | `/search`                | Search users by keyword         | `keyword`, paging params |
| GET    | `/{userId}`              | Get user details                | –                        |
| PUT    | `/{userId}`              | Update user profile             | `UserUpdateDTO`          |
| PUT    | `/{userId}/address`      | Update user address             | `AddressDTO`             |
| DELETE | `/hard-delete/{userId}`  | Permanently delete user         | –                        |
| PUT    | `/user/{userId}/restore` | Restore previously deleted user | –                        |
| PUT    | `/{userId}/block`        | Temporarily block user          | `banDuration` query      |
| PUT    | `/{userId}/unblock`      | Unblock user                    | –                        |
| PUT    | `/{userId}/role`         | Change user role                | `role` query             |

---

## 🖼️ Image Endpoints (`/images`)

| Method | Path                                   | Description                              | Notes                   |
| ------ | -------------------------------------- | ---------------------------------------- | ----------------------- |
| GET    | `/user/{imageId}`                      | Get image by ID (with `imageType` query) | –                       |
| GET    | `/user/owner/{ownerId}`                | Get image by owner ID                    | –                       |
| POST   | `/merchant/products/{productId}`       | Upload product images (multipart array)  | `imageType`, `images[]` |
| POST   | `/merchant/{ownerId}/upload`           | Upload single image for owner            | `imageType`, `image`    |
| DELETE | `/merchant/{ownerId}/{imageId}/delete` | Delete image by owner + image ID         | `imageType`             |
| GET    | `/user/{ownerId}/all`                  | Get all images for owner                 | `imageType`             |

---
## 🛍️ Product Endpoints

### 🛍️ Public Product Endpoints (`/products`)

| Method | Path                                           | Description                              | Body / Query                                                   |
| ------ | ---------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------- |
| GET    | `/products`                                    | Get paginated, filtered list of products | `ProductFilterCriteria` (query params), `page`, `size`, `sort` |
| GET    | `/products/{productId}`                        | Get detailed info for a single product   | –                                                              |
| PUT    | `/products/{productId}/review-count/increment` | Increment a product’s review count       | –                                                              |

---

### 🧑‍💼 Merchant Product Endpoints (`/merchant/products`)

| Method | Path                                              | Description                                        | Body / Query                             |
| ------ | ------------------------------------------------- | -------------------------------------------------- | ---------------------------------------- |
| GET    | `/merchant/products`                              | List merchant’s own products                       | `page`, `size`, `sort`                   |
| GET    | `/merchant/products/{productId}`                  | Get merchant’s own product details                 | –                                        |
| POST   | `/merchant/products`                              | Create a new product                               | `ProductCreateDTO`                       |
| PUT    | `/merchant/products/{productId}`                  | Update product details                             | `ProductUpdateDTO`                       |
| PUT    | `/merchant/products/{productId}/price`            | Update product price (and optional discount price) | Query: `price`, optional `discountPrice` |
| PUT    | `/merchant/products/{productId}/enabled/{status}` | Enable or disable product                          | –                                        |
| DELETE | `/merchant/products/{productId}`                  | Soft-delete merchant product                       | –                                        |

---

### 🛠️ Admin Product Endpoints (`/admin/products`)

| Method | Path                                           | Description                                              | Body / Query                      |
| ------ | ---------------------------------------------- | -------------------------------------------------------- | --------------------------------- |
| GET    | `/admin/products/page`                         | Paginated list of all products (optional keyword search) | `keyword`, `page`, `size`, `sort` |
| GET    | `/admin/products/{productId}`                  | Get detailed product info                                | –                                 |
| GET    | `/admin/products/disabled`                     | List disabled products                                   | `page`, `size`, `sort`            |
| GET    | `/admin/products/deleted`                      | List deleted products                                    | `page`, `size`, `sort`            |
| PUT    | `/admin/products/{productId}/enabled/{status}` | Enable or disable a product                              | –                                 |
| DELETE | `/admin/products/{productId}`                  | Permanently delete a product                             | –                                 |
| PUT    | `/admin/products/{productId}/restore`          | Restore a soft-deleted product                           | –                                 |
| GET    | `/admin/products/merchant/{merchantId}`        | List all products by a specific merchant                 | `page`, `size`, `sort`            |

---
## 🛒 Orders Endpoints

### 🛒 Public / Customer Order Endpoints (`/orders`)

| Method     | Path                                    | Description                                                    | Body / Query                                     |
| ---------- | --------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------ |
| **POST**   | `/orders`                               | Place a new order and receive an `orderTrackingNumber`.        | `CheckoutRequest` JSON                           |
| **DELETE** | `/orders/{orderId}`                     | Cancel an entire order with optional notes.                    | Raw `String` notes                               |
| **DELETE** | `/orders/{orderId}/product/{productId}` | Cancel a specific product in an order (requires color & size). | Raw `String` notes, query: `color`, `size`       |
| **GET**    | `/orders/{orderId}`                     | Retrieve detailed info for a specific order.                   | –                                                |
| **GET**    | `/orders/tracking/{trackingNumber}`     | Find order by tracking number.                                 | –                                                |
| **GET**    | `/orders/customer/{customerId}`         | List a customer’s orders with pagination & sorting.            | `page`, `size`, `sort`                           |
| **GET**    | `/orders/date-range`                    | Get all orders placed between two dates.                       | query: `startDate`, `endDate` (ISO-8601 strings) |

---

### 🏬 Merchant Order Endpoints (`/merchant/orders`)

| Method  | Path                                                    | Description                                          | Body / Query                                             |
| ------- | ------------------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------- |
| **PUT** | `/merchant/orders/{orderId}/status`                     | Update an order’s overall status and optional notes. | `OrderStatusUpdateRequest` JSON                          |
| **PUT** | `/merchant/orders/{orderId}/product/{productId}/status` | Update status of a specific product in an order.     | `OrderStatusUpdateRequest` JSON + query: `color`, `size` |
| **GET** | `/merchant/orders`                                      | List all orders for the authenticated merchant.      | `page`, `size`, `sort`                                   |

---

### 🛠️ Admin Order Endpoints (`/admin/orders`)

| Method  | Path            | Description                                                      | Query Params                                 |
| ------- | --------------- | ---------------------------------------------------------------- | -------------------------------------------- |
| **GET** | `/admin/orders` | List **all orders** in the system, with optional keyword search. | `keyword` (optional), `page`, `size`, `sort` |

---

## 🗂️ Category Endpoints

### Public (`/categories`)

| Method  | Endpoint                        | Description                                                | Query/Path Params                        |
| ------- | ------------------------------- | ---------------------------------------------------------- | ---------------------------------------- |
| **GET** | `/categories`                   | List all categories                                        | —                                        |
| **GET** | `/categories/{id}`              | Get a category by its ID                                   | Path: `id`                               |
| **GET** | `/categories/parent/{parentId}` | List all subcategories of a parent category                | Path: `parentId`                         |
| **GET** | `/categories/root`              | List all root-level categories                             | —                                        |
| **GET** | `/categories/page`              | Paginated categories with optional search                  | Query: `keyword`, `page`, `size`, `sort` |
| **GET** | `/categories/hierarchical`      | Get categories in a nested (tree) structure                | —                                        |
| **GET** | `/categories/above/{parentId}`  | Get all categories above a given category in the hierarchy | Path: `parentId`                         |

---

### Merchant (`/merchant/categories`)

| Method   | Endpoint                            | Description                        | Body / Query Params          |
| -------- | ----------------------------------- | ---------------------------------- | ---------------------------- |
| **POST** | `/merchant/categories/save`         | Create a new category              | JSON `CategoryDTO`           |
| **GET**  | `/merchant/categories/check_unique` | Check if a category name is unique | Query: `name`, optional `id` |

---

### Admin (`/admin/categories`)

| Method     | Endpoint                                | Description                              | Body / Query Params                               |
| ---------- | --------------------------------------- | ---------------------------------------- | ------------------------------------------------- |
| **GET**    | `/admin/categories/page`                | List categories (paginated & searchable) | Query: `keyword`, `page`, `size`, `sort`          |
| **DELETE** | `/admin/categories/delete/{categoryId}` | Delete a category                        | Path: `categoryId`                                |
| **PUT**    | `/admin/categories/enable/{categoryId}` | Enable/disable a category                | Path: `categoryId`, Query: `enabled` (true/false) |
| **GET**    | `/admin/categories/disabled`            | Get all disabled categories              | —                                                 |
| **PUT**    | `/admin/categories/merge`               | Merge one category into another          | Query: `sourceCategoryId`, `targetCategoryId`     |
| **PUT**    | `/admin/categories/update`              | Update category details                  | JSON `CategoryDTO`                                |

---

## 🏷️ Brand Endpoints

### Public (`/brands`)

| Method  | Endpoint                        | Description                                           | Query/Path Params                        |
| ------- | ------------------------------- | ----------------------------------------------------- | ---------------------------------------- |
| **GET** | `/brands`                       | List all brands                                       | —                                        |
| **GET** | `/brands/page`                  | Paginated list of brands with optional keyword filter | Query: `keyword`, `page`, `size`, `sort` |
| **GET** | `/brands/category/{categoryId}` | List brands under a specific category                 | Path: `categoryId`                       |
| **GET** | `/brands/name/{name}`           | Get brand details by name                             | Path: `name`                             |
| **GET** | `/brands/{brandId}`             | Get brand details by ID                               | Path: `brandId`                          |

---

### Merchant (`/merchant/brands`)

| Method   | Endpoint                                        | Description                     | Body / Query Params               |
| -------- | ----------------------------------------------- | ------------------------------- | --------------------------------- |
| **POST** | `/merchant/brands`                              | Create a new brand              | JSON `BrandDTO`                   |
| **GET**  | `/merchant/brands/check-name`                   | Check if a brand name is unique | Query: `name`, optional `brandId` |
| **PUT**  | `/merchant/brands/{categoryId}/brand/{brandId}` | Add a category to a brand       | Path: `categoryId`, `brandId`     |

---

### Admin (`/admin/brands`)

| Method     | Endpoint                          | Description                   | Body / Query Params                            |
| ---------- | --------------------------------- | ----------------------------- | ---------------------------------------------- |
| **PUT**    | `/admin/brands/{brandId}`         | Update brand details          | JSON `BrandDTO`                                |
| **GET**    | `/admin/brands/page`              | Paginated & searchable brands | Query: `keyword`, `page`, `size`, `sort`       |
| **DELETE** | `/admin/brands/{brandId}`         | Delete a brand                | Path: `brandId`                                |
| **PUT**    | `/admin/brands/{brandId}/enabled` | Enable/disable a brand        | Path: `brandId`, Query: `enabled` (true/false) |
| **GET**    | `/admin/brands/disabled`          | Get all disabled brands       | —                                              |

---

## 🛒 Cart Endpoints (`/cart`)

| Method     | Endpoint             | Description                                   | Request Body / Params       |
| ---------- | -------------------- | --------------------------------------------- | --------------------------- |
| **GET**    | `/cart/{customerId}` | Get all cart items for a customer with totals | `customerId` path variable  |
| **POST**   | `/cart/add`          | Add a product to the cart                     | JSON `CartItemCreateDTO`    |
| **PUT**    | `/cart/update`       | Update quantity of a cart item                | Query: `cartId`, `quantity` |
| **DELETE** | `/cart/remove`       | Remove a product from the cart                | Query: `cartId`             |
| **DELETE** | `/cart/clear`        | Clear all items in the current user’s cart    | —                           |

---

## 📝 Review Endpoints (`/reviews`)

| Method   | Endpoint                                             | Description                               | Request Body / Params                            |
| -------- | ---------------------------------------------------- | ----------------------------------------- | ------------------------------------------------ |
| **POST** | `/reviews`                                           | Create a new review                       | JSON `ReviewDTO`                                 |
| **PUT**  | `/reviews/{reviewId}`                                | Update an existing review                 | Path: `reviewId`, JSON `ReviewDTO`               |
| **GET**  | `/reviews/customer/{customerId}`                     | Get all reviews by a customer             | Path: `customerId`                               |
| **GET**  | `/reviews/product/{productId}`                       | Get paginated reviews for a product       | Path: `productId`, Query: `page`, `size`, `sort` |
| **GET**  | `/reviews/product/{productId}/customer/{customerId}` | Get a single review by product & customer | Path: `productId`, `customerId`                  |

---

## ⚡ Action Log Endpoints (`/admin/actions`)

| Method   | Endpoint                             | Description                          | Request Body / Params                                                     |
| -------- | ------------------------------------ | ------------------------------------ | ------------------------------------------------------------------------- |
| **POST** | `/admin/actions/log`                 | Log a user action                    | Query: `userId`, `action`, `resource`, `resourceId`, `details` (optional) |
| **GET**  | `/admin/actions/user/{userId}`       | Get all logs for a specific user     | Path: `userId`                                                            |
| **GET**  | `/admin/actions/resource/{resource}` | Get all logs for a specific resource | Path: `resource`                                                          |
| **GET**  | `/admin/actions`                     | Get all action logs                  | —                                                                         |

---

### 🔑 Notes

* **Auth**: All merchant and admin routes require valid JWT tokens and appropriate roles (`MERCHANT` or `ADMIN`).
* **Pagination**: Uses query params `page`, `size`, and `sort` (e.g., `?page=1&size=10&sort=createdDateTime,desc`).
* **DTOs**: Request/response bodies reference DTOs such as `ProductCreateDTO`, `ProductUpdateDTO`, and `ProductMerchantDTO`.


---

## 🖼️ Image Management Notes

* **Current State:** Images are stored as byte arrays and served from the backend.
* **Patterns Used:**

    * **Strategy Pattern** to handle different owner types (e.g., Brand, Product).
    * **Factory Pattern** (`ImageOwnerHandlerFactory`) to choose the correct handler at runtime.
* **Future Plan:** Migrate image storage to **AWS S3 static hosting** for scalability and cost-effectiveness.

---

### ⚡ Getting Started

#### Prerequisites

* Java 21+
* Maven 3.9+
* MongoDB Atlas cluster (or local MongoDB)

#### Setup

```bash
git clone https://github.com/<your-username>/fosso-backend.git
cd fosso-backend
```

Create `src/main/resources/application.properties`:

```properties
spring.data.mongodb.uri=<your-mongodb-uri>
spring.data.mongodb.database=fosso_db
app.jwt.secret=<long-secret>
app.jwt.expiration=86400000
server.port=8080
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB
```

Build & run:

```bash
mvn clean package
java -jar target/fosso_backend-0.0.1-SNAPSHOT.jar
```

---

### 🔑 Authentication

Obtain a JWT token from `/auth/login` and include it as:

```
Authorization: Bearer <token>
```

Roles & sample endpoints:

| Role     | Example Endpoints                     |
| -------- | ------------------------------------- |
| Public   | `/products`, `/categories`            |
| USER     | `/cart/**`, `/orders/**`              |
| MERCHANT | `/merchant/**`, `/images/merchant/**` |
| ADMIN    | `/admin/**`                           |

---

### 🧩 Simplified Structure

```
src/main/java/com/fosso/backend/
├─ config/           # Security & CORS
├─ common/           # AOP logging, global exception handling
├─ user/             # User entity & auth
├─ product/, order/  # Core e-commerce modules
├─ image/            # Image controller, service, strategy/factory handlers
└─ action/           # Action log service
```

---

## 📂 Project Structure

```
backend/                  # Spring Boot application
├── pom.xml               # Maven dependencies
├── src/
│   ├── main/
│   │   ├── java/com/fosso/backend/fosso_backend/
│   │   │   ├── FossoBackendApplication.java
│   │   │   ├── common/             # Common utilities
│   │   │   │   ├── enums/          # Enums (e.g., Role, OrderStatus)
|   │   │   │   ├── aop/            # AOP logging
│   │   │   │   ├── exception/      # Custom exceptions 
│   │   │   │   ├── handler/        # Global exception handler
│   │   │   │   └── util/           # Utility classes
│   │   │   ├── security/           # Authentication & JWT
│   │   │   ├── user/               # User domain (customer/merchant/admin)
│   │   │   ├── product/            # Product domain
│   │   │   ├── category/           # Category domain
│   │   │   ├── brand/              # Brand domain
│   │   │   ├── order/              # Order + payment flow
│   │   │   ├── cart/               # Shopping cart
│   │   │   ├── review/             # Product reviews
│   │   │   ├── image/              # Image handling (see below)
│   │   │   │   ├── controller/     # REST controllers
│   │   │   │   │   └── ImageController.java 
│   │   │   │   ├── dto/            # Data Transfer Objects
│   │   │   │   ├── mapper/         # MapStruct mappers
│   │   │   │   ├── model/          # MongoDB entities
│   │   │   │   ├── service/        # Business logic
│   │   │   │   └── strategy/       # Strategy + Factory patterns
│   │   │   │       ├── ImageOwnerHandler.java 
│   │   │   │       ├── ImageDeletionHandler.java       
│   │   │   │       ├── ImageOwnerHandlerFactory.java
│   │   │   │       ├── BrandImageHandler.java
│   │   │   │       └── BrandImageDeletionHandler.java
|   │   │   │       └── ... (other owner handlers)
│   │   │   ├── action/             # Action logging (AOP)
│   │   │   └── config/             # App configurations
│   │   │       ├── MongoConfig.java 
│   │   │       └── SecurityConfig.java
│   │   └── resources/
│   │       ├── application.yml     # DB + AWS S3 configs (future)
│   │       ├── static/             # (temporary image storage if needed)
│   │       └── templates/          # if using Thymeleaf for SSR
│   └── test/java/...               # Unit & integration tests
└── target/                         # Compiled output
```

---

### 🧪 Tests

```bash
mvn test
```
