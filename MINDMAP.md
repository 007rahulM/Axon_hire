# 🧠 Axon Hire — Code Mindmap & Interaction Graph

> **Purpose:** This file helps you (or an AI assistant) instantly see which files and functions are connected, so that when you change something you know exactly what else might break.

---

## 📌 How to Use This File

1. **Changing a file?** → Find it in the graphs below → see what imports/calls it
2. **Changing a function?** → Find it in the Function Call Maps → trace what uses it
3. **Adding a feature?** → Use the Data Flow diagrams to understand the full pipeline
4. **Database change?** → Check the Schema Relationships diagram

---

## 1. 🏗 Overall Architecture

```mermaid
graph TB
    subgraph Client["🌐 Browser (Vercel)"]
        FE["React Frontend"]
    end

    subgraph Backend["⚙️ Express Server (Render :5000)"]
        BE["server.js"]
    end

    subgraph DB["🗄 MongoDB Atlas"]
        MONGO["Collections"]
    end

    subgraph Cloud["☁️ Cloud Services"]
        CDN["Cloudinary (PDFs)"]
        GEMINI["Google Gemini AI"]
    end

    FE -->|"HTTP/HTTPS + JWT"| BE
    BE --> MONGO
    BE --> CDN
    BE --> GEMINI
```

---

## 2. 📁 Backend File Dependency Graph

> Arrows mean "imports / depends on"

```mermaid
graph LR
    SERVER["server.js<br/>Entry Point"]

    subgraph Routes
        AUTH_R["authRoutes.js"]
        JOB_R["jobRoutes.js"]
        APP_R["applicationRoutes.js"]
        USER_R["userRoutes.js"]
        AI_R["aiRoutes.js"]
    end

    subgraph Middleware
        AUTH_M["authMiddleware.js<br/>verifyToken()"]
        ADMIN_M["adminMiddleware.js<br/>adminMiddleware()"]
        UPLOAD_M["uploadMiddleware.js<br/>upload (multer)"]
    end

    subgraph Models
        USER_MODEL["User.js"]
        JOB_MODEL["Job.js"]
        APP_MODEL["Application.js"]
        COMPANY_MODEL["Company.js"]
    end

    subgraph Utils
        PARSER["resumeParser.js<br/>parseResumeFromUrl()"]
    end

    SERVER --> AUTH_R
    SERVER --> JOB_R
    SERVER --> APP_R
    SERVER --> USER_R
    SERVER --> AI_R

    AUTH_R --> USER_MODEL
    AUTH_R --> COMPANY_MODEL

    JOB_R --> AUTH_M
    JOB_R --> ADMIN_M
    JOB_R --> JOB_MODEL

    APP_R --> AUTH_M
    APP_R --> JOB_MODEL
    APP_R --> USER_MODEL
    APP_R --> APP_MODEL

    USER_R --> AUTH_M
    USER_R --> UPLOAD_M
    USER_R --> USER_MODEL

    AI_R --> AUTH_M
    AI_R --> PARSER

    PARSER -->|"axios + pdf-parse"| EXTERNAL["External: Cloudinary URL"]
```

---

## 3. 📁 Frontend File Dependency Graph

> Arrows mean "imports / uses"

```mermaid
graph LR
    MAIN["main.jsx<br/>Entry Point"]
    APP["App.jsx<br/>Router"]

    subgraph Context
        AUTH_CTX["AuthContext.jsx<br/>AuthProvider, useAuth()"]
    end

    subgraph API
        AXIOS_I["axiosInstance.js<br/>Axios + JWT interceptor"]
        CONFIG["config.js<br/>API_BASE_URL"]
    end

    subgraph RouteGuards["Route Guards"]
        PROT["ProtectedRoute.jsx"]
        ADMIN_RT["AdminRoute.jsx"]
    end

    subgraph Components
        NAVBAR["Navbar.jsx"]
    end

    subgraph Pages
        HOME["Home.jsx"]
        LOGIN["Login.jsx"]
        REG["Register.jsx"]
        REG_REC["RegisterRecruiter.jsx"]
        JOBS["Jobs.jsx"]
        PROFILE["Profile.jsx"]
        POST_JOB["PostJob.jsx"]
        DASHBOARD["RecruiterDashboard.jsx"]
        AI_BOT["AIBot.jsx"]
    end

    MAIN --> APP
    MAIN --> AUTH_CTX

    APP --> NAVBAR
    APP --> PROT
    APP --> ADMIN_RT
    APP --> HOME
    APP --> LOGIN
    APP --> REG
    APP --> REG_REC
    APP --> JOBS
    APP --> PROFILE
    APP --> POST_JOB
    APP --> DASHBOARD
    APP --> AI_BOT

    AXIOS_I --> CONFIG

    NAVBAR --> AUTH_CTX

    PROT --> AUTH_CTX
    ADMIN_RT --> AUTH_CTX

    LOGIN --> AXIOS_I
    LOGIN --> AUTH_CTX

    REG --> AXIOS_I
    REG_REC --> AXIOS_I
    REG_REC --> AUTH_CTX

    JOBS --> AXIOS_I
    JOBS --> AUTH_CTX

    PROFILE --> AXIOS_I
    PROFILE --> AUTH_CTX

    POST_JOB --> AXIOS_I

    DASHBOARD --> AXIOS_I

    AI_BOT --> AXIOS_I
```

---

## 4. ⚙️ Backend Function Call Map

### 4a. Authentication Functions

```mermaid
graph TD
    subgraph authRoutes.js
        REGISTER["POST /api/auth/register"]
        REG_REC["POST /api/auth/register-recruiter"]
        LOGIN["POST /api/auth/login"]
    end

    subgraph authMiddleware.js
        VERIFY["verifyToken(req, res, next)"]
    end

    REGISTER -->|"bcrypt.hash(password, 10)"| BCRYPT_H["bcryptjs.hash()"]
    REGISTER -->|"new User(data).save()"| USER_MODEL["User.js model"]

    REG_REC -->|"bcrypt.hash()"| BCRYPT_H
    REG_REC -->|"new User().save()"| USER_MODEL
    REG_REC -->|"new Company().save()"| COMPANY_MODEL["Company.js model"]
    REG_REC -->|"jwt.sign(payload, secret)"| JWT_SIGN["jsonwebtoken.sign()"]

    LOGIN -->|"User.findOne({email})"| USER_MODEL
    LOGIN -->|"bcrypt.compare(plain, hash)"| BCRYPT_C["bcryptjs.compare()"]
    LOGIN -->|"jwt.sign()"| JWT_SIGN

    VERIFY -->|"jwt.verify(token, secret)"| JWT_VERIFY["jsonwebtoken.verify()"]
    VERIFY -->|"attaches req.user"| NEXT["next() → route handler"]
```

### 4b. Job Functions

```mermaid
graph TD
    subgraph jobRoutes.js
        GET_JOBS["GET /api/jobs"]
        POST_JOB["POST /api/jobs"]
    end

    GET_JOBS -->|"Job.find()"| JOB_MODEL["Job.js model → MongoDB"]

    POST_JOB -->|"verifyToken → req.user"| AUTH_MW["authMiddleware.js"]
    POST_JOB -->|"adminMiddleware → role check"| ADMIN_MW["adminMiddleware.js"]
    POST_JOB -->|"new Job({...body, postedBy: req.user.id}).save()"| JOB_MODEL
```

### 4c. Application Functions

```mermaid
graph TD
    subgraph applicationRoutes.js
        APPLY["POST /api/applications/:jobId/apply"]
        RECRUITER["GET /api/applications/recruiter"]
    end

    APPLY -->|"verifyToken"| AUTH_MW["authMiddleware.js"]
    APPLY -->|"Job.findById(jobId)"| JOB_MODEL["Job.js model"]
    APPLY -->|"User.findById(req.user.id)"| USER_MODEL["User.js model"]
    APPLY -->|"Application.findOne({jobId, applicantId})"| APP_MODEL["Application.js model"]
    APPLY -->|"new Application({...}).save()"| APP_MODEL

    RECRUITER -->|"verifyToken"| AUTH_MW
    RECRUITER -->|"Job.find({postedBy: req.user.id})"| JOB_MODEL
    RECRUITER -->|"Application.find({jobId: {$in: jobIds}})"| APP_MODEL
    RECRUITER -->|".populate('applicantId')"| USER_MODEL
    RECRUITER -->|".populate('jobId')"| JOB_MODEL
```

### 4d. User / Resume Functions

```mermaid
graph TD
    subgraph userRoutes.js
        UPLOAD["POST /api/users/upload-resume"]
        PROFILE["GET /api/users/profile"]
    end

    UPLOAD -->|"verifyToken"| AUTH_MW["authMiddleware.js"]
    UPLOAD -->|"upload.single('resume')"| MULTER["uploadMiddleware.js<br/>Multer → Cloudinary"]
    UPLOAD -->|"req.file.path = Cloudinary URL"| CDN["Cloudinary"]
    UPLOAD -->|"User.findByIdAndUpdate(id, {resumeUrl})"| USER_MODEL["User.js model"]

    PROFILE -->|"verifyToken"| AUTH_MW
    PROFILE -->|"User.findById().select('-password')"| USER_MODEL
```

### 4e. AI Functions

```mermaid
graph TD
    subgraph aiRoutes.js
        GEN_Q["POST /api/ai/generate-questions"]
        ANALYZE["POST /api/ai/analyze-resume"]
    end

    subgraph resumeParser.js
        PARSE_URL["parseResumeFromUrl(url)"]
    end

    GEN_Q -->|"verifyToken"| AUTH_MW["authMiddleware.js"]
    GEN_Q -->|"genAI.getGenerativeModel('gemini-2.5-flash')"| GEMINI["Google Gemini API"]
    GEN_Q -->|"model.generateContent(prompt)"| GEMINI
    GEN_Q -->|"returns 5 Q&A pairs"| RESPONSE["JSON response"]

    ANALYZE -->|"verifyToken"| AUTH_MW
    ANALYZE -->|"parseResumeFromUrl(resumeUrl)"| PARSE_URL
    PARSE_URL -->|"axios.get(url) → arraybuffer"| CDN["Cloudinary PDF URL"]
    PARSE_URL -->|"pdf-parse(buffer)"| PDF_PARSE["pdf-parse library"]
    PARSE_URL -->|"returns cleaned text"| ANALYZE
```

---

## 5. 🎨 Frontend Function Call Map

### 5a. Authentication & Context

```mermaid
graph TD
    subgraph AuthContext.jsx
        AUTH_PROVIDER["AuthProvider component"]
        USE_AUTH["useAuth() hook"]
        LOGIN_FN["login(token, user)"]
        LOGOUT_FN["logout()"]
        INIT["useEffect → load from localStorage"]
    end

    AUTH_PROVIDER -->|"provides context"| USE_AUTH
    INIT -->|"localStorage.getItem('token')"| STATE["isLoggedIn, user, token state"]
    LOGIN_FN -->|"localStorage.setItem(token, user)"| STATE
    LOGOUT_FN -->|"localStorage.removeItem()"| STATE

    subgraph Login.jsx
        HANDLE_LOGIN["handleSubmit()"]
    end

    HANDLE_LOGIN -->|"axiosInstance.post('/api/auth/login')"| AXIOS_I["axiosInstance.js"]
    HANDLE_LOGIN -->|"login(token, user)"| LOGIN_FN
    HANDLE_LOGIN -->|"navigate('/jobs')"| ROUTER["React Router"]
```

### 5b. Route Guards

```mermaid
graph TD
    subgraph ProtectedRoute.jsx
        PROT_CHECK["checks useAuth().isLoggedIn + loading"]
    end

    subgraph AdminRoute.jsx
        ADMIN_CHECK["checks useAuth().user.role"]
    end

    PROT_CHECK -->|"if loading → null (wait)"| NULL["render nothing"]
    PROT_CHECK -->|"if not logged in → Navigate to /login"| LOGIN_PAGE["Login page"]
    PROT_CHECK -->|"if logged in → Outlet"| CHILD["Protected child page"]

    ADMIN_CHECK -->|"if role = admin or recruiter → Outlet"| ADMIN_CHILD["Admin/recruiter page"]
    ADMIN_CHECK -->|"else → alert + Navigate to /"| HOME_PAGE["Home page"]
```

### 5c. Jobs Page

```mermaid
graph TD
    subgraph Jobs.jsx
        FETCH_JOBS["useEffect → fetchJobs()"]
        HANDLE_APPLY["handleApply(jobId)"]
        RENDER["render job cards grid"]
    end

    FETCH_JOBS -->|"axiosInstance.get('/api/jobs')"| API["Backend"]
    FETCH_JOBS -->|"setJobs(data)"| JOBS_STATE["jobs state"]

    HANDLE_APPLY -->|"check user.resumeUrl exists"| AUTH_CTX["useAuth()"]
    HANDLE_APPLY -->|"if no resume → navigate('/profile')"| ROUTER["React Router"]
    HANDLE_APPLY -->|"axiosInstance.post('/api/applications/:jobId/apply')"| API
    HANDLE_APPLY -->|"setAppliedJobs(prev + jobId)"| APPLIED_STATE["appliedJobs state"]

    JOBS_STATE --> RENDER
    APPLIED_STATE -->|"disables Apply button"| RENDER
```

### 5d. Profile Page

```mermaid
graph TD
    subgraph Profile.jsx
        FETCH_PROFILE["useEffect → fetchProfile()"]
        HANDLE_UPLOAD["handleUpload()"]
        FETCH_APPS["useEffect → fetchAppliedJobs()"]
    end

    FETCH_PROFILE -->|"axiosInstance.get('/api/users/profile')"| API["Backend"]
    FETCH_PROFILE -->|"setUserProfile(data)"| PROFILE_STATE["userProfile state"]

    HANDLE_UPLOAD -->|"new FormData() append file"| FORM_DATA["FormData"]
    HANDLE_UPLOAD -->|"axiosInstance.post('/api/users/upload-resume', formData)"| API
    HANDLE_UPLOAD -->|"login(token, updatedUser)"| AUTH_CTX["AuthContext.login()"]

    FETCH_APPS -->|"axiosInstance.get('/api/applications/recruiter') or user apps"| API
    FETCH_APPS -->|"setApplications(data)"| APPS_STATE["applications state"]
```

### 5e. Navbar

```mermaid
graph TD
    subgraph Navbar.jsx
        NAVBAR_RENDER["render()"]
        MOBILE_TOGGLE["toggleMobileMenu()"]
    end

    NAVBAR_RENDER -->|"useAuth() → {isLoggedIn, user, logout}"| AUTH_CTX["AuthContext"]
    NAVBAR_RENDER -->|"if isLoggedIn → show Logout button"| LOGOUT_BTN["Logout button"]
    NAVBAR_RENDER -->|"if role=admin/recruiter → show Post Job + Dashboard"| ADMIN_BTNS["Admin buttons"]
    NAVBAR_RENDER -->|"if !isLoggedIn → show Login + Register"| AUTH_BTNS["Auth buttons"]

    LOGOUT_BTN -->|"onClick: logout() + navigate('/')"| AUTH_CTX
```

---

## 6. 🔄 Full Data Flow Diagrams

### 6a. User Registration & Login

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant BE as Backend
    participant DB as MongoDB

    User->>FE: fills Register form
    FE->>BE: POST /api/auth/register {name,email,password,role}
    BE->>BE: bcrypt.hash(password, 10)
    BE->>DB: new User({...}).save()
    DB-->>BE: saved user
    BE-->>FE: {message: "User registered"}
    FE->>FE: navigate('/login')

    User->>FE: fills Login form
    FE->>BE: POST /api/auth/login {email,password}
    BE->>DB: User.findOne({email})
    DB-->>BE: user document
    BE->>BE: bcrypt.compare(plain, hash)
    BE->>BE: jwt.sign({id, role}, secret, {expiresIn:'12h'})
    BE-->>FE: {token, user}
    FE->>FE: AuthContext.login(token, user)
    FE->>FE: localStorage.setItem(token, user)
```

### 6b. Easy Apply Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Jobs.jsx
    participant CTX as AuthContext
    participant BE as Backend
    participant DB as MongoDB

    FE->>BE: GET /api/jobs
    BE->>DB: Job.find()
    DB-->>BE: all jobs
    BE-->>FE: jobs array
    FE->>FE: render job cards

    User->>FE: clicks "Easy Apply" on a job
    FE->>CTX: check user.resumeUrl
    alt no resumeUrl
        FE->>FE: navigate('/profile')
    else has resumeUrl
        FE->>BE: POST /api/applications/:jobId/apply (JWT)
        BE->>DB: Job.findById(jobId)
        BE->>DB: User.findById(req.user.id)
        BE->>DB: Application.findOne({jobId, applicantId}) — duplicate check
        BE->>DB: new Application({jobId, applicantId, resumeUrl}).save()
        DB-->>BE: saved application
        BE-->>FE: {message: "Applied successfully"}
        FE->>FE: add jobId to appliedJobs state
        FE->>FE: button becomes "Applied ✓" (disabled)
    end
```

### 6c. Resume Upload Flow

```mermaid
sequenceDiagram
    actor User
    participant FE as Profile.jsx
    participant CTX as AuthContext
    participant BE as Backend
    participant CDN as Cloudinary
    participant DB as MongoDB

    User->>FE: selects PDF file + clicks Upload
    FE->>FE: new FormData(); formData.append('resume', file)
    FE->>BE: POST /api/users/upload-resume (FormData + JWT)
    BE->>BE: uploadMiddleware (Multer processes file)
    BE->>CDN: stream file to axon_resumes folder
    CDN-->>BE: {secure_url: "https://res.cloudinary.com/..."}
    BE->>DB: User.findByIdAndUpdate(id, {resumeUrl: url})
    DB-->>BE: updated user
    BE-->>FE: {message: "Resume uploaded", user: updatedUser}
    FE->>CTX: login(token, updatedUser) — refresh user state
    FE->>FE: show success message + new resumeUrl
```

### 6d. AI Interview Question Generation

```mermaid
sequenceDiagram
    actor User
    participant FE as AIBot.jsx
    participant BE as Backend
    participant AI as Google Gemini

    User->>FE: enters job title + clicks Generate
    FE->>BE: POST /api/ai/generate-questions {jobTitle} (JWT)
    BE->>BE: verifyToken → req.user
    BE->>AI: genAI.getGenerativeModel('gemini-2.5-flash')
    BE->>AI: model.generateContent(prompt with job title)
    Note over AI: generates 5 Q&A pairs<br/>with evaluation criteria
    AI-->>BE: formatted text
    BE-->>FE: {questions: formattedText}
    FE->>FE: render questions in whitespace-pre-wrap div
```

---

## 7. 🗄 Database Schema Relationships

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        String name
        String email
        String password
        String role
        String resumeUrl
        Date createdAt
        Date updatedAt
    }

    JOB {
        ObjectId _id PK
        String title
        String company
        String location
        String salary
        ObjectId postedBy FK
        Date createdAt
        Date updatedAt
    }

    APPLICATION {
        ObjectId _id PK
        ObjectId jobId FK
        ObjectId applicantId FK
        String resumeUrl
        String status
        Date createdAt
        Date updatedAt
    }

    COMPANY {
        ObjectId _id PK
        ObjectId owner FK
        String name
        String description
        String website
        String contactEmail
        Date createdAt
        Date updatedAt
    }

    USER ||--o{ JOB : "posts (postedBy)"
    USER ||--o{ APPLICATION : "submits (applicantId)"
    JOB ||--o{ APPLICATION : "receives (jobId)"
    USER ||--o| COMPANY : "owns (owner)"
```

---

## 8. 🔗 File ↔ Function Quick Reference

> Use this table when you edit a function and need to find everything it affects.

### Backend

| File | Function/Export | Used By |
|------|----------------|---------|
| `authMiddleware.js` | `verifyToken` | jobRoutes.js, applicationRoutes.js, userRoutes.js, aiRoutes.js |
| `adminMiddleware.js` | `adminMiddleware` | jobRoutes.js (POST /jobs only) |
| `uploadMiddleware.js` | `upload` | userRoutes.js (POST /upload-resume) |
| `models/User.js` | `User` model | authRoutes.js, applicationRoutes.js, userRoutes.js |
| `models/Job.js` | `Job` model | jobRoutes.js, applicationRoutes.js |
| `models/Application.js` | `Application` model | applicationRoutes.js |
| `models/Company.js` | `Company` model | authRoutes.js |
| `utils/resumeParser.js` | `parseResumeFromUrl()` | aiRoutes.js |
| `routes/authRoutes.js` | — | server.js (mounted at /api/auth) |
| `routes/jobRoutes.js` | — | server.js (mounted at /api/jobs) |
| `routes/applicationRoutes.js` | — | server.js (mounted at /api/applications) |
| `routes/userRoutes.js` | — | server.js (mounted at /api/users) |
| `routes/aiRoutes.js` | — | server.js (mounted at /api/ai) |

### Frontend

| File | Function/Export | Used By |
|------|----------------|---------|
| `AuthContext.jsx` | `AuthProvider`, `useAuth()` | main.jsx (Provider), all pages + guards |
| `axiosInstance.js` | `axiosInstance` | Login.jsx, Register.jsx, RegisterRecruiter.jsx, Jobs.jsx, Profile.jsx, PostJob.jsx, RecruiterDashboard.jsx, AIBot.jsx |
| `config.js` | `API_BASE_URL`, `BACKEND_URL` | axiosInstance.js |
| `Navbar.jsx` | `Navbar` | App.jsx |
| `ProtectedRoute.jsx` | `ProtectedRoute` | App.jsx (wraps Jobs, Profile, PostJob, Dashboard, AIBot) |
| `AdminRoute.jsx` | `AdminRoute` | App.jsx (wraps PostJob, RecruiterDashboard) |
| `AuthContext.jsx → login()` | token + user storage | Login.jsx, RegisterRecruiter.jsx, Profile.jsx (after upload) |
| `AuthContext.jsx → logout()` | clear localStorage | Navbar.jsx |

---

## 9. ⚠️ Impact Analysis: "What Breaks If I Change X?"

| If you change… | Check these files too |
|----------------|----------------------|
| `User.js` schema fields | authRoutes.js, userRoutes.js, applicationRoutes.js, AuthContext.jsx (login stores user) |
| `Job.js` schema fields | jobRoutes.js, applicationRoutes.js (populate), RecruiterDashboard.jsx |
| `Application.js` schema / `status` values | applicationRoutes.js, RecruiterDashboard.jsx (renders status badges) |
| `JWT_SECRET` env var | authMiddleware.js (verify), authRoutes.js (sign) |
| `verifyToken` middleware | ALL protected routes: jobRoutes, applicationRoutes, userRoutes, aiRoutes |
| `adminMiddleware` | jobRoutes.js POST, AdminRoute.jsx role check |
| `uploadMiddleware.js` (Cloudinary config) | userRoutes.js, Profile.jsx (upload logic) |
| `resumeParser.js` | aiRoutes.js `/analyze-resume` |
| `axiosInstance.js` | Every page that makes API calls (8 pages) |
| `AuthContext.jsx` | Navbar.jsx, ProtectedRoute.jsx, AdminRoute.jsx, Login.jsx, RegisterRecruiter.jsx, Profile.jsx, Jobs.jsx |
| `config.js` (API URLs) | axiosInstance.js → affects ALL API calls |
| Backend port / CORS in `server.js` | All frontend API calls fail |
| Cloudinary folder name in `uploadMiddleware.js` | New uploads go to different folder; old links still work |
| `/api/auth/login` response shape `{token, user}` | Login.jsx, RegisterRecruiter.jsx, AuthContext.login() signature |
| `/api/jobs` response shape | Jobs.jsx render logic |
| `/api/applications/recruiter` response shape | RecruiterDashboard.jsx table rendering |

---

## 10. 🧩 Component Hierarchy (React Tree)

```
main.jsx
└── BrowserRouter
    └── AuthProvider (AuthContext)
        └── App.jsx
            ├── Navbar.jsx  ← useAuth()
            │
            ├── Route "/"        → Home.jsx
            ├── Route "/login"   → Login.jsx       ← useAuth(), axiosInstance
            ├── Route "/register" → Register.jsx   ← axiosInstance
            ├── Route "/register-recruiter" → RegisterRecruiter.jsx ← useAuth(), axiosInstance
            │
            ├── ProtectedRoute (checks isLoggedIn)
            │   ├── Route "/jobs"    → Jobs.jsx           ← useAuth(), axiosInstance
            │   ├── Route "/profile" → Profile.jsx        ← useAuth(), axiosInstance
            │   └── Route "/ai-bot"  → AIBot.jsx          ← axiosInstance
            │
            └── ProtectedRoute → AdminRoute (checks role)
                ├── Route "/post-job"            → PostJob.jsx           ← axiosInstance
                └── Route "/recruiter-dashboard" → RecruiterDashboard.jsx ← axiosInstance
```

---

## 11. 🔐 Auth & Role Matrix

| Page / Endpoint | No Auth | User | Recruiter | Admin |
|-----------------|---------|------|-----------|-------|
| Home | ✅ | ✅ | ✅ | ✅ |
| Jobs list | ✅ | ✅ | ✅ | ✅ |
| Login / Register | ✅ | — | — | — |
| Register Recruiter | ✅ | — | — | — |
| Jobs page (Apply) | ❌ | ✅ | ✅ | ✅ |
| Profile | ❌ | ✅ | ✅ | ✅ |
| AI Bot | ❌ | ✅ | ✅ | ✅ |
| Post Job | ❌ | ❌ | ✅ | ✅ |
| Recruiter Dashboard | ❌ | ❌ | ✅ | ✅ |
| GET /api/jobs | ✅ | ✅ | ✅ | ✅ |
| POST /api/jobs | ❌ | ❌ | ✅ | ✅ |
| POST /api/applications/:id/apply | ❌ | ✅ | ✅ | ✅ |
| GET /api/applications/recruiter | ❌ | ❌ | ✅ | ✅ |
| POST /api/users/upload-resume | ❌ | ✅ | ✅ | ✅ |
| GET /api/users/profile | ❌ | ✅ | ✅ | ✅ |
| POST /api/ai/generate-questions | ❌ | ✅ | ✅ | ✅ |
| POST /api/ai/analyze-resume | ❌ | ✅ | ✅ | ✅ |
