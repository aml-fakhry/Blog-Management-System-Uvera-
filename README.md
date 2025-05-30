# 📝 Blog Management System

A simple and powerful blog management system that allows users to register, log in, and manage blog posts with role-based access. Built using modern web technologies with secure authentication and scalable design.

## 🚀 Features

- User registration and login with JWT authentication
- Role-based access (Admin and Editor)
- Create, update, and delete blog posts
- Tag-based filtering and pagination
- Swagger API documentation
- PostgreSQL with TypeORM
- Deployed database using Aiven
- Dockerized setup for easy deployment

### 🔒 Authentication & Authorization

- Passwords hashed using `bcrypt`
- JWT for stateless authentication
- Route protection using Guards
- Role-based access:
  - **Admin**: Create, update, delete blogs
  - **Editor**: Create and update blogs

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL (with TypeORM)
- **Auth:** JWT, bcrypt
- **Docs:** Swagger
- **Testing:** Jest
- **Containerization:** Docker

---

## 🧱 Database Schema

### 🧑‍💼 User

| Column   | Type   | Description              |
| -------- | ------ | ------------------------ |
| id       | number | Primary key              |
| username | string | Unique username          |
| password | string | Hashed password          |
| role     | string | User role (Admin/Editor) |

- 🔐 **Relation:** Each user has one role.

### 📝 Blog

| Column  | Type   | Description  |
| ------- | ------ | ------------ |
| id      | number | Primary key  |
| title   | string | Blog title   |
| content | text   | Blog content |

- 🔗 **Relation:**
  - Each blog can have multiple tags (`ManyToMany` with `Tag`)
  - Can be extended to link with users as authors

### 🏷️ Tag

| Column | Type   | Description     |
| ------ | ------ | --------------- |
| id     | number | Primary key     |
| name   | string | Unique tag name |

- 🔗 **Relation:**
  - Each tag can be associated with multiple blogs (`ManyToMany` with `Blog`)

### 🔐 Role

| Column | Type   | Description        |
| ------ | ------ | ------------------ |
| id     | number | Primary key        |
| name   | string | Role name (unique) |

- 🔗 **Relation:** Assigned to users to define permissions

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/aml-fakhry/Blog-Management-System-Uvera-.git

```

### 2. Set Environment Variables

```bash
PORT=3000
JWT_PRIVATE_KEY=Uvera@25
HASHING_SALT_ROUNDS=10
DB_HOST=pg-3dbef891-amlfakhry13-5f34.b.aivencloud.com
DB_PORT=26362
DB_USERNAME=avnadmin
DB_PASSWORD=AVNS_PnZ7B1RNH39TpDbfWQN
DB_NAME=Blog-Management-System

```

### 3. Install Dependencies

```bash
npm install

```

### 4. Run the Application

```bash
# Development
npm run dev

# Build
npm run build

# Test
npm run test

```

### 5. API Documentation

- Production: [https://blog-management-system-uvera-production-a5b1.up.railway.app/api-docs](https://blog-management-system-uvera-production-a5b1.up.railway.app/api-docs)(Swagger UI)
- Local: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)(Swagger UI)

### 6. 📂 Folder Structure

```bash
└── 📁src
    └── 📁_tests_
        └── auth.service.spec.ts
        └── blog.service.spec.ts
        └── hash.util.spec.ts
        └── jwt.util.spec.ts
    └── 📁docs
        └── collection.yml
    └── 📁entity
        └── blog.entity.ts
        └── index.ts
        └── role.entity.ts
        └── tag.entity.ts
        └── user.entity.ts
    └── 📁routes
        └── auth.routes.ts
        └── blog.routes.ts
        └── index.ts
    └── 📁services
        └── auth.service.ts
        └── blog.service.ts
    └── 📁shared
        └── 📁middleware
            └── auth.middleware.ts
            └── roles.enum.ts
        └── 📁util
            └── hash.util.ts
            └── jwt.util.ts
    └── app.ts
    └── data-source.ts
```

## 🧪 For Testing Purpose

To test the authentication and API endpoints, you can use the following test user credentials:

### Admin User:

- **Email**: aml@gmail.com
- **Password**: 1234

### Editor User:

- **Email**: uvera@gmail.com
- **Password**: 1234

Use these credentials when testing the login and role-based access control in the API.

## 🔌 API Endpoints

Base URLs:

- Production: [https://blog-management-system-uvera-production-a5b1.up.railway.app](https://blog-management-system-uvera-production-a5b1.up.railway.app)
- Local: [http://localhost:3000](http://localhost:3000)

---

## 📬 Postman Collection

To easily test the API, you can download the Postman collection:

1. **Download the Postman Collection JSON file** from the repository:

   - Local: [Download Postman Collection](https://github.com/aml-fakhry/Blog-Management-System-Uvera-/blob/main/Blog-Management-System.postman_collection.json)

   - Production:[Download Postman Collection](https://github.com/aml-fakhry/Blog-Management-System-Uvera-/blob/main/Blog-Management-System%20with%20hosted%20link.postman_collection.json)

2. **Import the collection into Postman**:
   - Open Postman and go to **File > Import**.
   - Select the **Raw Text** tab and paste the JSON from the above file or use the download link.
   - Click **Import**.

### 👨‍💻 Author

@aml-fakhry
