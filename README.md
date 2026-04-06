# 🚀 Axon Hire — AI-Powered Job Portal

A full-stack MERN job portal with **Google Gemini AI** integration for interview preparation, one-click job applications, and a recruiter dashboard.

[![Live Demo](https://img.shields.io/badge/Live-Frontend-blue?style=for-the-badge)](https://axon-hire.vercel.app)
[![API](https://img.shields.io/badge/Backend-Render-green?style=for-the-badge)](https://axon-hire.onrender.com)

---

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Other Projects](#other-projects)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Auth & Roles** | JWT-based authentication with three roles: `user`, `recruiter`, `admin` |
| 📋 **Job Listings** | Browse all job postings in a responsive grid |
| ⚡ **Easy Apply** | One-click apply using your saved master resume |
| 📄 **Resume Upload** | Upload PDF resume to Cloudinary; stored in your profile |
| 🤖 **AI Interview Prep** | Enter a job title → Gemini AI generates 5 Q&A pairs |
| 🏢 **Recruiter Dashboard** | Post jobs, view applicants, download resumes, update statuses |
| 📊 **Application Tracking** | Statuses: `Submitted → Viewed → Shortlisted → Rejected` |

---

## 🛠 Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6
- Axios (with JWT interceptor)
- Tailwind CSS

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Multer + Cloudinary (resume PDFs)
- Google Generative AI (Gemini 2.5-flash)
- pdf-parse

**Deployment**
- Frontend → Vercel
- Backend → Render

---

## 🗂 Project Structure

```
Axon_hire/
├── backend/
│   ├── server.js                  ← Express app entry point, MongoDB connect, route mounts
│   ├── middleware/
│   │   ├── authMiddleware.js       ← verifyToken: validates JWT, attaches req.user
│   │   ├── adminMiddleware.js      ← adminMiddleware: allows only admin/recruiter roles
│   │   └── uploadMiddleware.js     ← Multer + Cloudinary config for PDF uploads
│   ├── models/
│   │   ├── User.js                 ← Schema: name, email, password, role, resumeUrl
│   │   ├── Job.js                  ← Schema: title, company, location, salary, postedBy→User
│   │   ├── Application.js          ← Schema: jobId→Job, applicantId→User, resumeUrl, status
│   │   └── Company.js              ← Schema: owner→User, name, description, website
│   ├── routes/
│   │   ├── authRoutes.js           ← POST /register, /register-recruiter, /login
│   │   ├── jobRoutes.js            ← GET / (public), POST / (admin/recruiter)
│   │   ├── applicationRoutes.js    ← POST /:jobId/apply, GET /recruiter
│   │   ├── userRoutes.js           ← POST /upload-resume, GET /profile
│   │   └── aiRoutes.js             ← POST /generate-questions, POST /analyze-resume
│   └── utils/
│       └── resumeParser.js         ← parseResumeFromUrl: downloads + parses PDF text
│
└── frontend/
    ├── src/
    │   ├── main.jsx                ← Entry: wraps App with BrowserRouter + AuthProvider
    │   ├── App.jsx                 ← All route definitions + route guard usage
    │   ├── api/
    │   │   ├── axiosInstance.js    ← Axios instance: auto-attach JWT, handle 401/403
    │   │   └── config.js           ← API_BASE_URL: dev (localhost) / prod (Render)
    │   ├── context/
    │   │   └── AuthContext.jsx     ← Global state: isLoggedIn, user, token; login/logout
    │   ├── components/
    │   │   └── Navbar.jsx          ← Nav bar: role-aware buttons (Post Job / Dashboard)
    │   ├── routes/
    │   │   ├── ProtectedRoute.jsx  ← Redirects to /login if not authenticated
    │   │   └── AdminRoute.jsx      ← Redirects home if role ≠ admin/recruiter
    │   └── pages/
    │       ├── Home.jsx            ← Landing page with personalized greeting
    │       ├── Login.jsx           ← Login form → stores token in AuthContext
    │       ├── Register.jsx        ← User signup form
    │       ├── RegisterRecruiter.jsx ← Recruiter + Company signup with auto-login
    │       ├── Jobs.jsx            ← Job grid + Easy Apply button
    │       ├── Profile.jsx         ← User profile + resume upload + applied jobs history
    │       ├── PostJob.jsx         ← Admin/recruiter job posting form
    │       ├── RecruiterDashboard.jsx ← Applications table with status + resume links
    │       └── AIBot.jsx           ← Interview question generator (Gemini AI)
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── vercel.json
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/axon-hire
JWT_SECRET=your_jwt_secret_key
GOOGLE_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend (`frontend/.env`)
```env
# Automatically handled via import.meta.env.MODE in config.js
# In development, API calls go to http://localhost:5000
# In production, API calls go to https://axon-hire.onrender.com
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (free tier works)
- Google AI Studio API key (Gemini)

### Installation

```bash
# Clone the repo
git clone https://github.com/007rahulM/Axon_hire.git
cd Axon_hire

# Install backend dependencies
cd backend
npm install
cp .env.example .env    # fill in your env vars

# Install frontend dependencies
cd ../frontend
npm install
```

### Run in Development

```bash
# Terminal 1 — Backend
cd backend
npm run dev        # nodemon server.js on port 5000

# Terminal 2 — Frontend
cd frontend
npm run dev        # Vite dev server on port 5173
```

### Build for Production

```bash
cd frontend
npm run build      # outputs to dist/
```

---

## 📡 API Reference

All authenticated endpoints require: `Authorization: Bearer <token>`

### Auth — `/api/auth`
| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/register` | ❌ | `{name, email, password, role}` | Create user account |
| POST | `/register-recruiter` | ❌ | `{name, email, password, companyName, ...}` | Create recruiter + company, returns token |
| POST | `/login` | ❌ | `{email, password}` | Returns JWT + user object |

### Jobs — `/api/jobs`
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/` | ❌ | — | List all job postings |
| POST | `/` | ✅ | admin/recruiter | Create a new job posting |

### Applications — `/api/applications`
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/:jobId/apply` | ✅ | user | Apply for a job (requires resumeUrl on profile) |
| GET | `/recruiter` | ✅ | recruiter | Get all applications for recruiter's jobs |

### Users — `/api/users`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/upload-resume` | ✅ | Upload PDF → Cloudinary, saves URL to user |
| GET | `/profile` | ✅ | Fetch user info + resumeUrl |

### AI — `/api/ai`
| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/generate-questions` | ✅ | `{jobTitle}` | Gemini generates 5 interview Q&A pairs |
| POST | `/analyze-resume` | ✅ | `{resumeUrl, jobDescription}` | Extract + return resume text from PDF |

---

## 🗄 Database Schema

```
User ──────────────────────────────────────
  _id, name, email, password(hashed), role,
  resumeUrl, createdAt, updatedAt

Job ───────────────────────────────────────
  _id, title, company, location, salary,
  postedBy → User._id, createdAt, updatedAt

Application ───────────────────────────────
  _id, jobId → Job._id,
  applicantId → User._id,
  resumeUrl, status, createdAt, updatedAt

Company ───────────────────────────────────
  _id, owner → User._id,
  name, description, website,
  contactEmail, createdAt, updatedAt
```

---

## 👨‍💻 Other Projects by 007rahulM

| Project | Description | Tech |
|---------|-------------|------|
| [axon-hire-complete](https://github.com/007rahulM/axon-hire-complete) | Extended/completed version of Axon Hire | MERN |
| [dev-badge](https://github.com/007rahulM/dev-badge) | Generate SVG buttons & dynamic LeetCode stats cards for GitHub READMEs | React + Node.js |
| [Finance-Dashboard-Backend](https://github.com/007rahulM/Finance-Dashboard-Backend) | Finance data processing & access control API | Node.js |
| [Social-network-api](https://github.com/007rahulM/Social-network-api) | Social network backend: auth, followers, feed logic | Node.js + Express + MongoDB |
| [Ecommerce-api](https://github.com/007rahulM/Ecommerce-api) | Full e-commerce REST API | Node.js + MongoDB |
| [ResQ_project](https://github.com/007rahulM/ResQ_project) | Emergency response project | JavaScript |
| [Carbon-Code](https://github.com/007rahulM/Carbon-Code) | Clone of Carbon — beautiful code screenshot tool | React |
| [Url-shortener-api](https://github.com/007rahulM/Url-shortener-api) | URL shortener backend with MongoDB | Node.js + Express |
| [skillshare-hub](https://github.com/007rahulM/skillshare-hub) | Single-page Skillshare course tracker | HTML + CSS + JS |
| [Cpp-Learnings-Series](https://github.com/007rahulM/Cpp-Learnings-Series) | C++ project-based learning series | C++ |

---

## 📄 License

MIT — feel free to use, fork, and improve!
