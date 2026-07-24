# LeadFlowCRM - Lead Management Platform

A production-ready lead management system built for the **Digital Heroes Full Stack Developer** training task.

## 🚀 Live Demo

- **Frontend:** [https://leadflowcrm.vercel.app](https://leadflowcrm.vercel.app)
- **Backend API:** [https://leadflowcrm-api.onrender.com](https://leadflowcrm-api.onrender.com)

## 👥 Test Credentials

### 🔑 Admin Account (Pre-created)
| Role | Email | Password |
|------|-------|----------|
| **Admin** | `lead@test.com` | `password123` |

> **Admin Access:** Full system access - can view all users, manage all leads, and control the entire platform.

### 👤 Member Account (Self-Signup)
| Role | Email | Password |
|------|-------|----------|
| **Member** | Sign up yourself | Create your own |

> **How to create a Member account:**
> 1. Go to the login page
> 2. Click **"Need an account? Register"**
> 3. Fill in your Name, Email, and Password
> 4. Click **Register**
> 5. You'll be automatically logged in as a **Member**

> **Member Access:** Manage your own leads, add notes, update status, and view your profile.

---

## ✨ Features

### 👑 Admin Features
- ✅ View all users in the system
- ✅ Create, update, delete any lead
- ✅ View activity trail of all leads
- ✅ Dashboard with overview stats
- ✅ Manage lead status pipeline
- ✅ User management

### 👤 Member Features
- ✅ Create and manage own leads
- ✅ Add notes to leads
- ✅ Search and filter leads
- ✅ View personal profile
- ✅ Dashboard with personal stats
- ✅ Update lead status

### 🔐 Authentication
- ✅ User Registration (anyone can sign up as Member)
- ✅ User Login
- ✅ JWT Token Authentication
- ✅ Role-based Access Control (RBAC)
- ✅ Protected Routes

---

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite
- JWT Authentication
- bcryptjs

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router v7

---

## 📦 Installation

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

### Backend Setup

```bash
cd server
npm install
npx prisma db push
npx prisma generate
npm run dev
```

🔗 API Endpoints
```
Method	Endpoint	Description	Role Required
POST	/api/auth/register	Register user	Public
POST	/api/auth/login	Login	Public
GET	/api/users/profile	Get profile	User
GET	/api/users	Get all users	Admin
POST	/api/leads	Create lead	User
GET	/api/leads	Get leads (paginated)	User
PUT	/api/leads/:id	Update lead	User
DELETE	/api/leads/:id	Delete lead	User
POST	/api/leads/:id/notes	Add note	User
GET	/api/leads/:id/notes	Get notes	User
```
Query Parameters (GET /api/leads)
```
Parameter	|  Type	  | Default | Description
page            |  number |	1   | Page number
limit           |  number |     10  | Items per page
status          |  string |	-   | Filter by status
search          |  string |	-   | Search by name/email/phone
sortBy          |  string |createdAt| Sort field
sortOrder       |  string | desc    | asc or desc
```

📊 Lead Status Pipeline
```
Status     |  Description
new	   |  New lead just added
contacted  |  Initial contact made
qualified  |  Lead is qualified
proposal   |  Proposal sent
closed     |  Deal closed
```


📁 Project Structure

```
LeadFlowCRM/
├── server/
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth middleware
│   │   ├── routes/         # API routes
│   │   └── index.ts        # Server entry
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Pages
│   │   ├── services/       # API services
│   │   └── layouts/        # Layouts
│   └── package.json
└── README.md
```
