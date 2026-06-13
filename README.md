# Dbuian Fashion E-commerce Website

A MERN stack fashion e-commerce website with a unified user and admin frontend.

## Project Structure & Audit

- **Frontend Application**: Located in `frontend/`. It is built with React, Vite, and TailwindCSS. Includes both user-facing pages and the admin panel under `/admin`.
- **Backend Application**: Located in `backend/`. It is built with Express, Node.js, and MongoDB.
- **Package Manager**: `npm` is used across all applications (`package-lock.json` files are present).

### Available Scripts

- **Backend** (`backend/package.json`):
  - `npm run dev`: Runs server in development mode using `nodemon` on `server.js`
  - `npm start`: Runs server in production mode using `node`
- **Frontend** (`frontend/package.json`):
  - `npm run dev`: Runs frontend locally using Vite
  - `npm run build`: Builds frontend for production

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

# Install frontend dependencies
cd ../frontend
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

### Admin Account Setup
By default, all registered users have the `user` role. To create an admin account:
1. Register a new user via the frontend (`/register`).
2. Connect to your MongoDB database using MongoDB Compass or `mongosh`.
3. Locate the user document in the `users` collection.
4. Update the `role` field from `"user"` to `"admin"`.
5. Log in with that account, and you will be redirected to the Admin Dashboard (`/admin/dashboard`).

### Google OAuth Setup
This project uses **Google Identity Services** for Google login/registration.

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to **APIs & Services → Credentials**.
4. Click **Create Credentials → OAuth 2.0 Client IDs**.
5. Set application type to **Web Application**.
6. Add your frontend URL to **Authorized JavaScript origins** (e.g. `http://localhost:5173`).
7. Copy the **Client ID**.
8. Add it to `backend/.env` as `GOOGLE_CLIENT_ID=<your_client_id>`.
9. Add it to `frontend/.env` as `VITE_GOOGLE_CLIENT_ID=<your_client_id>`.

> **Important:** Do NOT commit real Client IDs or secrets to version control.

### Running the Services
Start backend:
```bash
cd backend
npm run dev
```

Start frontend (User & Admin Website):
```bash
cd frontend
npm run dev
```
