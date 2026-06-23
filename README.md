# E-commerce Full-Stack Sourcing Storefront

A high-fidelity, premium e-commerce sourcing storefront built using React, Vite, Node.js, Express, and MongoDB.

This application connects a polished, high-performance React + Tailwind frontend to a robust Express backend API, offering live product catalog filtering, keyword search, detailed product gallery views, client-side shopping cart calculations, and product CRUD capabilities.

---

## 🏗️ Architecture Overview

The project is split into two main sections:
1. **Frontend (`/src`)**: Single Page Application built on React, Vite, and React Router, styled with an Outfit + Inter design system.
2. **Backend (`/server`)**: REST API built with Express, Mongoose, and CORS middleware, supporting MongoDB queries with a seamless in-memory CRUD fallback when database services are offline.

---

## 🛠️ Tech Stack & Requirements

### Frontend
- **React (v19)** with React Router (v7)
- **Lucide React** for modern iconography
- **Vanilla CSS** with a premium global theme system (`src/index.css`)

### Backend
- **Node.js** & **Express**
- **MongoDB** & **Mongoose** for data modeling
- **CORS** & **Dotenv** for configuration

---

## ⚙️ Environment Variables

### Backend Server (`/server/.env`)
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce-fullstack
CORS_ORIGIN=http://localhost:5173
```

### Frontend Client (`/.env`)
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Application

### 1. Start MongoDB (Optional)
If you have MongoDB installed, make sure the service is running locally on port `27017` or specify your MongoDB Atlas cluster URI in `server/.env`.

> [!NOTE]
> **Db-Offline Fallback**: If MongoDB is not running, the backend server will automatically print a warning and start in **Offline/No-DB Fallback Mode**. In this mode, the server serves all product routes, filters, searches, and CRUD requests from a local in-memory dataset, ensuring zero app crashes!

### 2. Seed the Database
To load the initial 14 premium catalog products with custom MongoDB ObjectIds:
```bash
cd server
npm run seed
```

### 3. Start the Backend API Server
```bash
cd server
npm start
```
The backend API will run on `http://localhost:5000`. You can verify it via `http://localhost:5000/health-check`.

### 4. Start the Frontend React Client
```bash
npm run dev
```
The React development server will start on `http://localhost:5173`. Open it in your browser to experience the sourcing catalog!

---

## 🛣️ API Endpoint documentation

### Health Check
- `GET /health-check`: Returns the status of the server and database connection status.

### Products CRUD (`/api/products`)
- `GET /api/products`: Lists all products. Supports query parameters `category` (e.g., `Electronics`) and `search` (case-insensitive keyword matching on name, brand, or category).
- `GET /api/products/:id`: Retrieves detailed information for a single product by its ObjectId string.
- `POST /api/products`: Creates a new product. Requires a JSON body matching the schema.
- `PUT /api/products/:id`: Updates an existing product's fields by ID.
- `DELETE /api/products/:id`: Removes a product from the system.

---

## 📦 Production Builds

To compile the React frontend for deployment:
```bash
npm run build
```
This outputs a minified, fully optimized bundle inside the `dist/` directory.
