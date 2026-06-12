# Dbuian Fashion E-commerce Website

A MERN stack fashion e-commerce website with a user frontend and an admin panel.

## Project Structure & Audit

- **Frontend Application**: Located in `frontend/`. It is built with React, Vite, and TailwindCSS.
- **Backend Application**: Located in `backend/`. It is built with Express, Node.js, and MongoDB.
- **Admin Panel**: Located inside the backend folder at `backend/admin-panel/`. It is a separate frontend application built with React, Vite, and TailwindCSS.
- **Package Manager**: `npm` is used across all applications (`package-lock.json` files are present).

### Available Scripts

- **Backend** (`backend/package.json`):
  - `npm run dev`: Runs server in development mode using `nodemon` on `server.js`
  - `npm start`: Runs server in production mode using `node`
- **Frontend** (`frontend/package.json`):
  - `npm run dev`: Runs user frontend locally using Vite
  - `npm run build`: Builds user frontend for production
- **Admin Panel** (`backend/admin-panel/package.json`):
  - `npm run dev`: Runs admin panel locally using Vite
  - `npm run build`: Builds admin panel for production

---

## Local Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB Atlas connection URI

### Installation
Install dependencies for each service:
```bash
# Install backend dependencies
cd backend
npm install

# Install admin panel dependencies
cd admin-panel
npm install

# Install frontend dependencies
cd ../../frontend
npm install
```

### Environment Configuration
1. Copy `backend/.env.example` to `backend/.env`.
2. Populate the required environment variables:
   - `MONGODB_URI`: Your local or remote MongoDB connection string.
   - `PORT`: Port for the backend server (default: `5000`).
   - `JWT_SECRET`: Secret key for signing JSON Web Tokens.
   - `JWT_EXPIRE`: Token expiration time (e.g., `30d`).
   - `FRONTEND_URL`: URL of the local running frontend (default: `http://localhost:5173`).
   - `NODE_ENV`: Set to `development` for local testing.
   - *(Optional)* Cloudinary and SendGrid credentials if those features are used.

### Running the Services
Start backend:
```bash
cd backend
npm run dev
```

Start frontend (User Website):
```bash
cd frontend
npm run dev
```

Start admin panel:
```bash
cd backend/admin-panel
npm run dev
```
