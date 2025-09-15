
# Fosso — Full-Stack Web Application

**Fosso** is a modern full-stack web application built with a **Spring Boot + MongoDB** backend and a **React + Vite** frontend. It features secure, JWT-based authentication, a responsive UI, and clean architectural design for scalable development.

> 📦 [Click here to download the entire project as ZIP](https://github.com/your-org/fosso/archive/refs/heads/main.zip)

---

## 📁 Repository Structure

```
fosso/
├── fosso_backend/     # Backend application (Spring Boot)
└── fosso_frontend/    # Frontend application (React + Vite)
```

---

## 🔧 Fosso Backend

The backend provides a RESTful API using **Spring Boot 3.4.4** and **Java 21**, with **MongoDB Atlas** as the primary database. Authentication and authorization are handled securely using **JWT**.

### ✨ Key Features

- REST API with Spring Boot
- Secure authentication and authorization (JWT + Spring Security)
- MongoDB Atlas integration
- Centralized error handling and validation
- Multipart file upload support

### 🛠 Tech Stack

| Component     | Technology         |
|---------------|--------------------|
| Language      | Java 21            |
| Framework     | Spring Boot        |
| Database      | MongoDB Atlas      |
| Security      | Spring Security + JWT |
| Build Tool    | Maven              |

### 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/fosso.git
   cd fosso/fosso_backend
   ```

2. **Configure environment variables**  
   Update `application.properties`:
   ```properties
   app.jwt.secret=your_jwt_secret
   app.jwt.expiration=86400000

   spring.data.mongodb.uri=your_mongodb_atlas_uri
   spring.data.mongodb.database=fosso_db

   server.port=8080
   ```

3. **Run the application**
   ```bash
   ./mvnw spring-boot:run
   ```

---

## 💻 Fosso Frontend

The frontend is built with **React**, **Vite**, and **Tailwind CSS**, designed to be fast, responsive, and developer-friendly.

### ✨ Key Features

- Functional React components with hooks
- Redux for global state management
- Forms with React Hook Form and validation using Yup
- Tailwind CSS, Radix UI, and Lucide Icons for sleek UI
- Data fetching with RTK Query and Axios

### 🛠 Tech Stack

| Component           | Technology               |
|---------------------|---------------------------|
| Framework           | React 18 + Vite           |
| Styling             | Tailwind CSS              |
| State Management    | Redux                   |
| Form & Validation   | React Hook Form + Yup |
| Routing             | React Router DOM          |
| Data Fetching       | Axios + RTK Query       |

### 🚀 Getting Started

1. **Navigate to the frontend directory**
   ```bash
   cd ../fosso_frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   Access the app at: [http://localhost:5173](http://localhost:5173)

---
