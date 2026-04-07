# 📚 Library Management System

A full-stack, production-ready Library Management System for colleges and schools. Built with **React (Vite)**, **Node.js/Express**, and **MySQL/Sequelize**.

## 🚀 Features

- **3 Role System**: Admin, Librarian, Student
- **Book Management**: Full CRUD, search, pagination
- **Member Management**: Add/edit/delete students
- **Issue & Return**: 14-day due dates, inventory auto-sync
- **Fine System**: Auto-calculated on return (₹5/day), mark as paid
- **Overdue Tracking**: Real-time overdue list
- **Analytics Dashboard**: Live stat cards, bar charts (Recharts)
- **JWT Auth**: Secure, role-based route protection
- **Responsive**: Mobile sidebar drawer with full desktop layout

## 🛠 Tech Stack

| Layer     | Technology                       |
|-----------|----------------------------------|
| Frontend  | React, Vite, TailwindCSS, Recharts, Axios |
| Backend   | Node.js, Express.js              |
| Database  | MySQL + Sequelize ORM            |
| Auth      | JWT + bcrypt                     |

## 📁 Folder Structure

```
library-management-system/
├── client/           # React Frontend
│   └── src/
│       ├── context/          # AuthContext
│       ├── layouts/          # DashboardLayout
│       ├── pages/            # All page components
│       └── services/         # Axios API service
└── server/           # Node.js Backend
    └── src/
        ├── config/           # DB connection
        ├── controllers/      # Route handlers
        ├── middlewares/      # auth, roleCheck
        ├── models/           # Sequelize models + associations
        ├── routes/           # Express routes
        └── seeders/          # Seed data script
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MySQL server running (XAMPP/WAMP/native)

### 1. Database Setup
```sql
CREATE DATABASE lms_db;
```

### 2. Backend Setup
```bash
cd server
# Update .env with your DB credentials
npm install
npm run seed    # Creates tables + sample data
npm run dev     # Starts server on :5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev     # Starts frontend on :5173
```

### 4. Open App
Go to: **http://localhost:5173**

## 🔑 Demo Credentials (after seeding)

| Role      | Email                      | Password     |
|-----------|----------------------------|--------------|
| Admin     | admin@library.com          | password123  |
| Librarian | librarian@library.com      | password123  |
| Student   | student@library.com        | password123  |

## 🌍 Environment Variables (`server/.env`)

```
PORT=5000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASS=yourpassword
DB_NAME=lms_db
DB_DIALECT=mysql
JWT_SECRET=your_secure_jwt_secret
```

## 📌 Business Rules

- Max **3 books** per student at a time
- **14-day** return deadline
- Fine = **₹5/day** for overdue books
- Books auto-decrement/increment on issue/return
