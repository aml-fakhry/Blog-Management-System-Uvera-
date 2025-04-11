# 📝 Blog Management System

A simple and powerful blog management system that allows users to register, log in, and manage blog posts with role-based access. Built using modern web technologies with secure authentication and scalable design.

## 🚀 Features

- User registration and login with JWT authentication
- Role-based access (Admin and Editor)
- Create, update, and delete blog posts
- Tag-based filtering and pagination
- Swagger API documentation
- PostgreSQL with TypeORM
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

### 3. Set Environment Variables

```bash
# Development
npm run dev

# Production
npm run build
npm start

```
