# MERN Stack News CMS

A modern, full-featured Content Management System (CMS) migrated from traditional Node.js/Express/EJS into a full **MERN Stack** (MongoDB, Express.js, React 18, Node.js + Vite) architecture.

---

## 🌟 Architecture Overview

```
NEWS-CMS-PROJECT/
├── client/                     # React + Vite Frontend
│   ├── public/                 # Static assets (Bootstrap, Font-Awesome, CSS, Fonts, Images)
│   │   ├── css/
│   │   ├── fonts/
│   │   └── images/
│   ├── src/
│   │   ├── assets/             # Client assets
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   ├── MenuBar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ArticleCard.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── AdminHeader.jsx
│   │   │   ├── AdminMenuBar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── context/            # React Contexts (AuthContext)
│   │   ├── layouts/            # MainLayout & AdminLayout
│   │   ├── pages/              # Public & Admin pages
│   │   │   ├── Home.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── AuthorPage.jsx
│   │   │   ├── SearchPage.jsx
│   │   │   ├── SingleArticle.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Articles.jsx
│   │   │       ├── AddArticle.jsx
│   │   │       ├── EditArticle.jsx
│   │   │       ├── Categories.jsx
│   │   │       ├── AddCategory.jsx
│   │   │       ├── EditCategory.jsx
│   │   │       ├── Users.jsx
│   │   │       ├── AddUser.jsx
│   │   │       ├── EditUser.jsx
│   │   │       ├── Comments.jsx
│   │   │       └── Settings.jsx
│   │   ├── services/           # Centralized Axios API service layer (api.js)
│   │   ├── App.jsx             # Main Router configuration
│   │   └── main.jsx            # React root mount with AuthProvider & BrowserRouter
│   ├── .env                    # Frontend environment variables
│   ├── .env.example
│   ├── vite.config.js          # Vite configuration with proxy
│   └── package.json
│
├── server/                     # Express.js REST API Backend
│   ├── config/                 # Database configuration (db.js)
│   ├── controllers/            # REST API controllers
│   │   ├── authController.js
│   │   ├── newsController.js
│   │   ├── categoryController.js
│   │   ├── userController.js
│   │   ├── commentController.js
│   │   ├── settingController.js
│   │   ├── dashboardController.js
│   │   └── commonController.js
│   ├── middleware/             # Express middlewares
│   │   ├── auth.js             # JWT verification (cookie + bearer header)
│   │   ├── isAdmin.js          # Admin authorization guard
│   │   ├── multer.js           # File upload handling (JPEG/PNG/WEBP, 10MB limit)
│   │   ├── validation.js       # express-validator rules
│   │   └── errorHandler.js     # Centralized error handler
│   ├── models/                 # Mongoose models
│   │   ├── user.js
│   │   ├── news.js
│   │   ├── category.js
│   │   ├── comment.js
│   │   └── setting.js
│   ├── routes/                 # Express API routes
│   │   ├── authRoutes.js
│   │   ├── newsRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── userRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── settingRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── commonRoutes.js
│   ├── uploads/                # Uploaded news images and website logos
│   ├── utils/                  # Utilities (pagination.js)
│   ├── .env                    # Backend environment variables
│   ├── .env.example
│   ├── server.js               # Main Express app & server entrypoint
│   └── package.json
│
├── package.json                # Root package.json with concurrent run scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies

Install root, server, and client dependencies:

```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install
cd ..

# Client dependencies
cd client
npm install
cd ..
```

### 2. Configure Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/NEWSHUB
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend (`client/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SERVER_URL=http://localhost:5000
```

### 3. Run the Application

You can run both client and server simultaneously from the root directory:

```bash
# Run both Backend (port 5000) and Frontend (port 5173) concurrently:
npm run dev
```

Or run them individually:

```bash
# Run Backend only (Express REST API on port 5000):
npm run server
# or with hot reload:
npm run server:dev

# Run Frontend only (Vite React on port 5173):
npm run client
```

Open your browser at:
- **Public Website:** `http://localhost:5173/`
- **CMS Admin Login:** `http://localhost:5173/login`
- **Backend API:** `http://localhost:5000/api/health`

---

## 🔑 User Roles & Permissions

| Role | Access |
|---|---|
| **Public Visitor** | View home page, categories, authors, search, view articles, post comments |
| **Author** | Login to CMS, Dashboard stats, Manage their own articles (Create, Read, Update, Delete), Moderate comments on their articles |
| **Admin** | Full CMS control: Articles, Categories CRUD, User Management CRUD, Moderate all Comments, Website Settings (Title, Logo, Footer) |

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/login` - Login with username & password (issues JWT cookie & response token)
- `POST /api/auth/logout` - Logout & clear session cookie
- `GET /api/auth/me` - Get current authenticated user profile

### News & Articles (`/api/news`)
- `GET /api/news` - Get paginated articles (supports `?page=`, `?limit=`, `?category=`, `?author=`, `?search=`, `?mine=true`)
- `GET /api/news/:id` - Get single article with category, author, and approved comments
- `POST /api/news` - Create article (Multipart form with `title`, `content`, `category`, `image`) [Protected]
- `PUT /api/news/:id` - Update article [Protected]
- `DELETE /api/news/:id` - Delete article and its uploaded image [Protected]
- `POST /api/news/:articleId/comments` - Submit comment on an article [Public]

### Categories (`/api/categories`)
- `GET /api/categories` - Get all categories with article counts [Public]
- `GET /api/categories/:id` - Get single category details [Public]
- `POST /api/categories` - Create new category [Admin only]
- `PUT /api/categories/:id` - Update category [Admin only]
- `DELETE /api/categories/:id` - Delete category (protected against categories with articles) [Admin only]

### Users / Authors (`/api/users`)
- `GET /api/users` - Get all users [Admin only]
- `GET /api/users/:id` - Get user profile [Public/Admin]
- `POST /api/users` - Create user with role `author` or `admin` [Admin only]
- `PUT /api/users/:id` - Update user details & role [Admin only]
- `DELETE /api/users/:id` - Delete user [Admin only]

### Comments (`/api/comments`)
- `GET /api/comments` - View comments list with status filter [Protected]
- `PUT /api/comments/:id/status` - Update status (`pending`, `approved`, `rejected`) [Protected]
- `DELETE /api/comments/:id` - Delete comment [Protected]

### Settings (`/api/settings`)
- `GET /api/settings` - Get website settings [Public]
- `POST /api/settings` - Update settings with website logo upload [Admin only]

### Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats` - Get live dashboard counts [Protected]

### Common Data (`/api/common`)
- `GET /api/common` - Get site settings, active categories, and latest 5 posts [Public]
