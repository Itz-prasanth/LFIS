# 🔍 Lost & Found Hub

A community-driven, full-stack web platform to help people report, search, and recover lost or found items. Built as a Web Programming project using React, Express.js, and MongoDB.

🌐 **Live Demo:** [https://lfis-w7ji.onrender.com/](https://lfis-w7ji.onrender.com/)

---

## 📸 Preview

| Home Page | Browse Items | Admin Panel |
|-----------|-------------|-------------|
| Hero section with stats | Searchable & filtered listing | Monitor users, items & messages |

---

## ✨ Features

- 🔐 **User Authentication** — Register, login, logout with session-based auth
- 📋 **Report Items** — Submit lost or found items with title, description, category, location, date, contact info & image
- 🔎 **Browse & Search** — Filter items by type (lost/found), category, status, and keyword
- 📄 **Item Detail Pages** — Full item view with contact form
- 📊 **Personal Dashboard** — View your own reports and platform-wide stats
- 🛡️ **Admin Panel** — Monitor all users, items, and contact messages with full control
- 📬 **Contact Us** — Contact form that saves messages to the database
- 📜 **Privacy Policy & Terms** — Fully written support pages
- 📱 **Responsive Design** — Works on mobile and desktop

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 + TypeScript | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Utility-first styling |
| shadcn/ui + Radix UI | Accessible UI components |
| Framer Motion | Animations |
| Lucide React | Icons |
| TanStack React Query | Server state & data fetching |
| Wouter | Client-side routing |
| Zod + React Hook Form | Form validation |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express.js v5 | Server & REST API |
| MongoDB + Mongoose | Database & ODM |
| bcryptjs | Password hashing |
| express-session | Session-based authentication |
| Multer | Image file uploads |
| tsx + cross-env | TypeScript execution (Windows-compatible) |

---

## 📁 Project Structure

```
lfis-admin/
├── client/                        # React frontend
│   └── src/
│       ├── pages/                 # Home, Items, Dashboard, Admin, Contact...
│       ├── components/            # Layout, ItemCard, ImageUpload, UI library
│       ├── hooks/                 # useAuth, useItems, useStats, useMessages
│       └── lib/                   # queryClient, utils
├── server/                        # Express backend
│   ├── models/                    # Mongoose models (User, Item, Message)
│   ├── replit_integrations/auth/  # Login, Register, Session middleware
│   ├── routes.ts                  # All API routes
│   ├── storage.ts                 # Database access layer
│   └── index.ts                   # Server entry point
├── shared/                        # Shared TypeScript types & Zod schemas
├── seed-admin.ts                  # One-time admin user creation script
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Installation

```bash
# 1. Clone or extract the project
cd lfis-admin

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Edit the .env file:
MONGODB_URI=mongodb://localhost:27017/lfis
SESSION_SECRET=your-secret-key-here
PORT=5000
```

### Running the App

```bash
# Development mode
npm run dev

# Production build & start
npm run build
npm start
```

Visit **http://localhost:5000** in your browser.

---

## 🔑 Admin Access

To create the first admin user, run the seed script once:

```bash
npx tsx seed-admin.ts
```

Default admin credentials:
```
Email:    admin@lostandfound.local
Password: Admin@1234
```

> ⚠️ Change the password after your first login!

**To promote an existing user to admin** via MongoDB:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

Then **log out and log back in** for the Admin link to appear in the navbar.

---

## 🌐 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/items` | — | List all items (with filters) |
| GET | `/api/items/:id` | — | Get single item |
| POST | `/api/items` | ✅ User | Create item report |
| PATCH | `/api/items/:id` | ✅ Owner | Update own item |
| DELETE | `/api/items/:id` | ✅ Owner | Delete own item |
| POST | `/api/messages` | — | Submit contact message |
| GET | `/api/stats` | — | Platform statistics |
| POST | `/api/upload` | ✅ User | Upload item image |
| GET | `/api/auth/user` | — | Get current session user |
| GET | `/api/admin/users` | 🛡️ Admin | List all users |
| DELETE | `/api/admin/users/:id` | 🛡️ Admin | Delete a user |
| GET | `/api/admin/items` | 🛡️ Admin | List all items |
| PATCH | `/api/admin/items/:id` | 🛡️ Admin | Update any item |
| DELETE | `/api/admin/items/:id` | 🛡️ Admin | Delete any item |
| GET | `/api/admin/messages` | 🛡️ Admin | List all messages |
| DELETE | `/api/admin/messages/:id` | 🛡️ Admin | Delete a message |

---

## 🗃️ Database Models

### User
```
id, email, password (hashed), firstName, lastName, profileImageUrl, role (user|admin)
```

### Item
```
id, title, description, category, type (lost|found), location, date,
imageUrl, contactInfo, userId, status (pending|claimed)
```

### Message
```
id, name, email, message, createdAt
```

---

## 🔒 Security

- Passwords hashed with **bcrypt** (12 salt rounds) — never stored in plain text
- Sessions managed server-side with **express-session**
- All write routes require authentication via `isAuthenticated` middleware
- All admin routes additionally require `isAdmin` middleware (role check)
- Image uploads restricted to image MIME types, max 5 MB

---

## 📦 Deployment

This project is deployed on **Render** with **MongoDB Atlas**.

🌐 Live: [https://lfis-w7ji.onrender.com/](https://lfis-w7ji.onrender.com/)

To deploy your own instance:

1. Push the project to **GitHub**
2. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas) and copy the connection string
3. Create a new **Web Service** on [Render](https://render.com)
4. Set these environment variables in Render:
   ```
   MONGODB_URI=<your Atlas connection string>
   SESSION_SECRET=<a long random string>
   NODE_ENV=production
   PORT=5000
   ```
5. Set the build command: `npm install && npm run build`
6. Set the start command: `npm start`

---

## 📄 Pages

| Page | Route | Access |
|------|-------|--------|
| Home | `/` | Public |
| Browse Items | `/items` | Public |
| Item Detail | `/items/:id` | Public |
| Report Lost | `/report/lost` | Logged In |
| Report Found | `/report/found` | Logged In |
| Dashboard | `/dashboard` | Logged In |
| Admin Panel | `/admin` | Admin Only |
| Contact Us | `/contact` | Public |
| Privacy Policy | `/privacy` | Public |
| Terms of Service | `/terms` | Public

---

## 📝 License

This project was developed for academic purposes as part of the Web Programming course at VIT University.
