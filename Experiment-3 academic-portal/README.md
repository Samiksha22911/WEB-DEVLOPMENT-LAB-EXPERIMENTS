# MITS Academic Management System (AMS)

A full-stack, multi-page **Student Academic Portal** with complete CRUD
operations and REST API integration, inspired by college AMS systems like
MITS's Academic Management System.

- **Frontend:** React (Vite) + React Router + Tailwind CSS + Axios
- **Backend:** Node.js + Express REST API
- **Database:** JSON-file storage (zero-setup, swap for MongoDB/MySQL later)
- **Auth:** JWT-based login with `admin` and `student` roles

---

## ✨ Features

| Module | Admin | Student |
|---|---|---|
| Login / Auth (JWT, role-based) | ✅ | ✅ |
| Students | Full CRUD | View own profile |
| Courses | Full CRUD | View list |
| Attendance | Full CRUD (mark/edit/delete for any student) | View own attendance % |
| Marks / Grades | Full CRUD | View own marks |
| Feedback | View all, mark Open/Resolved, delete | Submit / view own, delete own |
| Dashboard | Aggregate stats across all modules | Personal snapshot |

All frontend pages talk to the backend **only** through REST endpoints
(`/api/...`) using an Axios service layer — no data is hard-coded in the UI.

---

## 📁 Project Structure

```
academic-portal/
├── backend/
│   ├── data/              # JSON "database" files (auto-created)
│   ├── middleware/auth.js # JWT verification + role guard
│   ├── routes/            # auth, students, courses, attendance, marks, feedback
│   ├── utils/db.js        # generic CRUD helper over JSON files
│   ├── utils/seed.js      # demo data seeder
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/            # axios instance + one file per resource (CRUD calls)
    │   ├── context/        # AuthContext (login state, token)
    │   ├── components/     # Navbar, Sidebar, DataTable, Modal, ProtectedRoute...
    │   └── pages/           # Login, Dashboard, Students, Courses, Attendance, Marks, Feedback, Profile
    └── package.json
```

---

## 🚀 Getting Started

### 1. Backend

```bash
cd academic-portal/backend
npm install
npm run seed     # creates demo students, users, courses, attendance, marks, feedback
npm run dev       # starts API on http://localhost:5000 (nodemon)
# or: npm start
```

### 2. Frontend

In a **new terminal**:

```bash
cd academic-portal/frontend
npm install
npm run dev       # starts app on http://localhost:5173
```

The Vite dev server proxies `/api/*` requests to `http://localhost:5000`
(see `vite.config.js`), so both apps just need to be running side by side.

### 3. Login

Visit `http://localhost:5173/login`. Demo accounts (password for all: `password123`):

| Username | Role | Notes |
|---|---|---|
| `admin` | admin | Full access to all modules |
| `aarav` | student | Linked to student "Aarav Sharma" |
| `diya` | student | Linked to student "Diya Patel" |

Click the demo buttons on the login screen to auto-fill credentials.

---

## 🔌 REST API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | Returns JWT + user |
| GET | `/auth/me` | Auth | Current user info |
| GET | `/students` | Auth | All (admin) / self (student) |
| GET | `/students/:id` | Auth | One student |
| POST | `/students` | Admin | Create student |
| PUT | `/students/:id` | Admin | Update student |
| DELETE | `/students/:id` | Admin | Delete student |
| GET/POST/PUT/DELETE | `/courses[/:id]` | Auth / Admin | Same CRUD pattern |
| GET/POST/PUT/DELETE | `/attendance[/:id]` | Auth / Admin | Supports `?studentId=&courseId=` filters |
| GET/POST/PUT/DELETE | `/marks[/:id]` | Auth / Admin | Supports `?studentId=&courseId=` filters |
| GET/POST/PUT/DELETE | `/feedback[/:id]` | Auth | Students manage own; admin manages all |

All protected routes require `Authorization: Bearer <token>`.

---

## 🛠 Notes & Next Steps

- Swap `backend/utils/db.js` for a real database (MongoDB/Mongoose or
  MySQL/Sequelize) without touching route logic much — the `Model()`
  helper mirrors typical ORM CRUD methods (`all`, `find`, `create`,
  `update`, `remove`).
- Add pagination/sorting on `DataTable` for large student lists.
- Add password reset / student self-registration if needed.
- For production, set `VITE_API_URL` in the frontend and serve the built
  frontend (`npm run build`) from Express or a static host.
