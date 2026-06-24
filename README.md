# E-commerce Full-Stack Sourcing Storefront

A high-fidelity, premium e-commerce sourcing storefront built using React, Vite, Node.js, Express, and MongoDB.

This application connects a polished, high-performance React + Tailwind frontend to a robust Express backend API, offering JWT authentication, persistent cart functionality, a full admin panel, and direct deployment capabilities.

---

## 🏗️ Architecture Overview

The project is split into two main sections:
1. **Frontend (`/src`)**: Single Page Application built on React, Vite, and React Router, styled with an Outfit + Inter design system.
2. **Backend (`/server`)**: REST API built with Express, Mongoose, and CORS middleware, supporting JWT-based authentication and database-offline fallbacks.

---

## ⚙️ Environment Variables

### Backend Server (`/server/.env`)
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce-fullstack
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=super_secret_session_token_key_here
```

### Frontend Client (`/.env`)
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔑 Seeded Accounts (Default testing credentials)

When the database is seeded (or when running in database-offline fallback mode), the following testing accounts are pre-registered:

*   **Standard Customer**:
    *   **Email**: `customer@brand.com`
    *   **Password**: `CustomerPass123`
*   **Admin Manager**:
    *   **Email**: `admin@brand.com`
    *   **Password**: `AdminPass123`

---

## 🚀 Running the Application

### 1. Seed the Database
To load the initial 14 premium catalog products and default test accounts:
```bash
cd server
npm run seed
```

### 2. Start the Backend API Server
```bash
cd server
npm start
```
The backend API will run on `http://localhost:5000`. You can verify it via `http://localhost:5000/health-check`.

### 3. Start the Frontend React Client
```bash
npm run dev
```
The React development server will start on `http://localhost:5173`. Open it in your browser to experience the storefront!

---

## 🌎 Live Deployments

### Backend → Render
1. Create a Web Service on Render and point it to your repository.
2. Render will automatically detect the `render.yaml` configuration in the root directory.
3. Define the environment variables `MONGO_URI`, `JWT_SECRET`, and `CORS_ORIGIN` (point this to your Vercel frontend domain) in the Render dashboard.

### Frontend → GitHub Pages (Team Lead Instruction)
This project is pre-configured to deploy directly to GitHub Pages using the `gh-pages` package.

1. **Set Backend URL**: Open the root `.env` file and set the `VITE_API_URL` to your live deployed Render API URL:
   ```env
   VITE_API_URL=https://ecommerce-backend-api.onrender.com/api
   ```
2. **Deploy to GitHub Pages**: Run the deployment script from the root directory of the project:
   ```bash
   npm run deploy
   ```
   This command automatically builds the production client and pushes the compiled assets to the `gh-pages` branch on GitHub.
3. **Enable GitHub Pages on GitHub**:
   - Go to your repository page on GitHub.
   - Navigate to **Settings** -> **Pages**.
   - Under **Build and deployment** -> **Branch**, select `gh-pages` and `/ (root)`, then click **Save**.
   - Your live storefront will be accessible at: `https://HassanArif3.github.io/ecommerce-fullstack-design/`.

---

## 🧑‍💻 How to Create an Admin Account
To create a custom admin user:
1. Register a standard account via the frontend registration page `/signup`.
2. Open your MongoDB GUI tool (e.g. Compass) or Mongo Shell and connect to your database.
3. Query the `users` collection and update the target user's `role` field from `"customer"` to `"admin"`:
   ```javascript
   db.users.updateOne({ email: "user@example.com" }, { $set: { role: "admin" } });
   ```
