# Project Setup Guide

## Prerequisites
- Node.js v16 or higher
- npm or yarn
- MongoDB v5.0 or higher (or use MongoDB Atlas)
- Git

## Directory Structure

```
food-ordering-app/
├── frontend/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── redux/           # Redux slices and store
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── hooks/           # Custom hooks
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── .env.local
│   └── package.json
│
├── backend/                  # Express Backend
│   ├── src/
│   │   ├── models/          # Database models (Mongoose)
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── config/          # Configuration files
│   │   ├── database/        # DB connection & migrations
│   │   ├── socket/          # Socket.io setup
│   │   └── server.js        # Entry point
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── docs/                     # Documentation
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   └── DEPLOYMENT.md
│
├── REQUIREMENTS.md           # Functional requirements
├── USE_CASE_DIAGRAM.md      # Use case diagram
├── DATABASE_SCHEMA.md        # Database schema details
└── README.md                 # Project overview
```

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Configuration
Create `.env` file in backend folder:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_URL=http://localhost:5000

# Database
MONGODB_URI=mongodb://localhost:27017/food-ordering-app
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-ordering-app

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_change_in_production

# Stripe Configuration
STRIPE_PUBLIC_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Configuration (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Cloudinary Configuration (for image upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Google Maps API (for distance calculation)
GOOGLE_MAPS_API_KEY=your_api_key
```

### 3. Start Backend Development Server
```bash
npm run dev
```

Server will run on `http://localhost:5000`

### 4. API Testing
Use Postman or curl to test endpoints:

```bash
# Example: Create user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "full_name": "John Doe",
    "phone_number": "+84123456789",
    "role": "customer"
  }'
```

---

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create `.env.local` file in frontend folder:

```env
REACT_APP_API_BASE_URL=http://localhost:5000/api/v1
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_key
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key
```

### 3. Start Frontend Development Server
```bash
npm start
```

App will open on `http://localhost:3000`

---

## Database Setup

### Option 1: Local MongoDB

#### Install MongoDB
- **Windows**: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- **macOS**: `brew install mongodb-community`
- **Linux**: Follow official MongoDB documentation

#### Start MongoDB
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create a cluster
4. Get connection string
5. Add to `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/food-ordering-app?retryWrites=true&w=majority
```

### Initialize Database
```bash
cd backend
npm run migrate
```

---

## Running the Full Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Swagger Docs: http://localhost:5000/api-docs (when implemented)

---

## Development Tools

### Postman Collection
Import the Postman collection to test all APIs:
1. File → Import
2. Select `docs/postman_collection.json`

### MongoDB Compass
Visual MongoDB client for database management:
```bash
# Download from: https://www.mongodb.com/products/compass
```

### VS Code Extensions
Recommended extensions:
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- Thunder Client (API testing)
- MongoDB for VS Code
- Postman

---

## Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## Linting and Code Quality

### Backend
```bash
cd backend
npm run lint
```

### Frontend
```bash
cd frontend
npm run lint
```

---

## Deployment

### Frontend Deployment (Vercel)
```bash
npm install -g vercel
vercel
```

### Backend Deployment (Railway/Heroku)

#### Using Railway
```bash
npm install -g railway
railway login
railway up
```

#### Using Heroku
```bash
npm install -g heroku
heroku login
heroku create app-name
git push heroku main
```

See `docs/DEPLOYMENT.md` for detailed deployment instructions.

---

## Troubleshooting

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Failed
- Check MongoDB is running: `mongosh` or `mongo`
- Verify connection string in `.env`
- Check firewall settings

### Module Not Found
```bash
# Clean and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues
- Verify `CORS_ORIGIN` in backend `.env`
- Ensure frontend URL matches

---

## Quick Start (One Command)

Create `start.sh` (macOS/Linux) or `start.bat` (Windows):

**start.sh:**
```bash
#!/bin/bash
cd backend && npm install && npm run dev &
cd ../frontend && npm install && npm start
```

**start.bat:**
```batch
@echo off
start cmd /k "cd backend && npm install && npm run dev"
start cmd /k "cd frontend && npm install && npm start"
```

Then run:
- macOS/Linux: `bash start.sh`
- Windows: `start.bat`

---

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT Guide](https://jwt.io/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Stripe Documentation](https://stripe.com/docs)

---

**Ngày cập nhật**: 25/03/2026
**Phiên bản**: 1.0
