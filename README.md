# The Propertist

A comprehensive, full-stack real estate property listing application. This platform enables agents to list, manage, and track properties, while property seekers can easily browse listings, filter by specific criteria, and contact agents with enquiries.

---

## 🌟 Features

- **Robust Authentication**: Secure registration and login using JWT access and refresh tokens.
- **Role-Based Access Control**: Differentiated experiences for `agent` and `seeker` roles.
- **Advanced Property Search**: Filter listings dynamically by city, BHK, price range, property type, and status.
- **Agent Dashboard**: A centralized hub for agents to manage properties, track listing statistics, view incoming enquiries, and update their profile details (including Cloudinary-backed avatar uploads).
- **Enquiry Management**: Property seekers and guests can send messages directly to agents regarding specific properties. Agents can manage the status (New, Contacted, Closed) of these enquiries.
- **Cloudinary Image Upload**: Seamless multi-image uploads for property listings and single image upload for agent avatars, securely stored via Cloudinary.

---

## 🛠 Tech Stack

### Frontend
- **React 18** & **Vite**
- **Tailwind CSS v4** & **shadcn/ui** (for modern, responsive, and accessible UI components)
- **Zustand** (global state management)
- **TanStack Query** (data fetching and caching)
- **React Hook Form** & **Zod** (form handling and schema validation)
- **React Router v7**

### Backend
- **Node.js** & **Express 5**
- **TypeScript**
- **MongoDB** (with **Mongoose** ODM)
- **JWT** (JSON Web Tokens for secure authentication)
- **Cloudinary** (for cloud storage of images)
- **Zod** (request payload validation)

### Development & Tools
- **Docker** (optional MongoDB containerization)
- **Postman** (API testing and documentation)

---

## 📂 Folder Structure

```
├── client/                 # React Frontend Application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── assets/         # Images, global CSS
│   │   ├── components/     # Reusable UI components (shadcn, layout, agent forms)
│   │   ├── hooks/          # Custom React Query hooks
│   │   ├── lib/            # Utility functions & Axios instances
│   │   ├── pages/          # Full page components
│   │   ├── schemas/        # Zod validation schemas
│   │   ├── stores/         # Zustand state stores
│   │   └── types/          # TypeScript definitions
│   └── vite.config.ts
├── server/                 # Express Backend API
│   ├── src/
│   │   ├── config/         # Environment variables & DB connection
│   │   ├── controllers/    # API request handlers
│   │   ├── middleware/     # Auth, error handling, Multer upload middlewares
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express API routes
│   │   ├── utils/          # Cloudinary, JWT, Response helpers
│   │   └── validators/     # Zod schema validators
│   └── server.ts           # Entry point
├── api-docs.md             # API Documentation reference
└── propertist-postman-collection.json  # Postman Collection
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v20+)
- **MongoDB** (v7+ installed locally) OR **Docker**
- A **Cloudinary** account (for image uploads)

### 1. Installation

Clone the repository and install dependencies for the root, frontend, and backend:

```bash
npm install
cd client && npm install
cd ../server && npm install
```

### 2. Environment Variables Setup

Create a `.env` file in the root directory based on the provided `.env.example`:

```bash
cp .env.example .env
```

Ensure your `.env` contains the following configurations:

```env
NODE_ENV=development
PORT=5000

# MongoDB Setup
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/PropertyApp?retryWrites=true&w=majority

# JWT Secrets
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cloudinary Setup
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Client URL
CLIENT_URL=http://localhost:5173
```

### 3. Database Setup

You can use a local MongoDB instance, MongoDB Atlas, or Docker.

**Using Docker (Optional)**:
If you have Docker installed, you can spin up a MongoDB container quickly:
```bash
docker-compose up -d mongo
```

### 4. Running the Application

To run both the frontend and backend concurrently in development mode from the root directory:

```bash
npm run dev
```

- **Frontend Client**: runs at `http://localhost:5173`
- **Backend Server**: runs at `http://localhost:5000`

---

## 🏗 Build & Deployment

To prepare the application for production deployment:

### Backend Build
Navigate to the server directory and build the TypeScript code:
```bash
cd server
npm run build
npm start
```

### Frontend Build
Navigate to the client directory and build the Vite React app:
```bash
cd client
npm run build
```
The output will be in the `client/dist` directory, which can be served using any static web host (Vercel, Netlify, Nginx).

---

## 👥 User Roles & Permissions

1. **Guest (Unauthenticated)**
   - Browse property listings.
   - View property details.
   - Submit enquiries for properties.
   - Register for an account.

2. **Seeker**
   - All Guest features.
   - Access to user profile.

3. **Agent**
   - All Seeker features.
   - Access to Agent Dashboard.
   - Create, Update, and Delete their own property listings.
   - Upload multiple property images to Cloudinary.
   - Upload an agent profile avatar.
   - View, track, and update the status of enquiries received on their properties.

---

## 📖 API Documentation

Complete API Documentation is available in the root directory.
- Detailed Markdown guide: [api-docs.md](./api-docs.md)
- Postman Collection: [propertist-postman-collection.json](./propertist-postman-collection.json)

You can import the Postman Collection directly into your Postman workspace to interact with all available endpoints quickly.

---

## 🔧 Troubleshooting

- **MongoDB Connection Error**: Double-check your `MONGODB_URI` string in `.env`. If you are using IP whitelisting on MongoDB Atlas, ensure your current IP is whitelisted.
- **Cloudinary Image Upload Fails**: Ensure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` are correct in your `.env`. Check that the backend accepts the image size (limit is set to 5MB).
- **CORS Issues**: If the frontend cannot communicate with the backend, verify that `CLIENT_URL` in `.env` perfectly matches the URL your Vite server is running on (e.g., `http://localhost:5173`).
- **Dependencies Errors**: If you encounter errors after pulling new code, run `npm install` again in the root, `/client`, and `/server` directories to ensure all packages are up to date.
