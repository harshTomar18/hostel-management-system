# Hostel Management System - Deployment Guide

This guide will walk you through deploying the Hostel Management System using **free hosting platforms**.

## 🎯 Deployment Stack (Free Tier)

- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Railway

---

## 📋 Prerequisites

1. GitHub account (to connect repositories)
2. Accounts on:
   - [Vercel](https://vercel.com) (for frontend)
   - [Render](https://render.com) (for backend)
   - [Railway](https://railway.app) (for database)

---

## 🗄️ Step 1: Deploy Database (Railway)

### 1.1 Create Railway Account
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

### 1.2 Create MySQL Database
1. Click **"New Project"**
2. Select **"Provision MySQL"**
3. Wait for the database to be created

### 1.3 Get Database Credentials
1. Click on your MySQL service
2. Go to **"Variables"** tab
3. Note down these values:
   - `MYSQLHOST` (DB_HOST)
   - `MYSQLUSER` (DB_USER)
   - `MYSQLPASSWORD` (DB_PASSWORD)
   - `MYSQLDATABASE` (DB_NAME)
   - `MYSQLPORT` (usually 3306)

### 1.4 Initialize Database Tables
1. Install MySQL client or use Railway's built-in query editor
2. Connect to your Railway database
3. Run the table creation script from `backend/create-tables.js` or manually create tables:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  capacity INT NOT NULL,
  occupied INT DEFAULT 0,
  status VARCHAR(50) NOT NULL,
  floor INT NOT NULL
);

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  room INT,
  course VARCHAR(100),
  year VARCHAR(50),
  contact VARCHAR(20),
  status VARCHAR(50),
  email VARCHAR(255),
  FOREIGN KEY (room) REFERENCES rooms(id)
);

CREATE TABLE complaints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student VARCHAR(255) NOT NULL,
  room VARCHAR(50),
  issue TEXT NOT NULL,
  date DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  priority VARCHAR(20) DEFAULT 'Medium'
);

CREATE TABLE notices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  author VARCHAR(255),
  type VARCHAR(50)
);

CREATE TABLE staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100),
  contact VARCHAR(20),
  email VARCHAR(255)
);
```

---

## 🚀 Step 2: Deploy Backend (Render)

### 2.1 Push Code to GitHub
```bash
cd "c:\Users\Anshika Pandey\OneDrive\Desktop\samplewebstie"
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2.2 Create Render Account
- Go to [render.com](https://render.com)
- Sign up with GitHub

### 2.3 Deploy Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `hostel-backend` (or your choice)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

### 2.4 Add Environment Variables
In Render dashboard, go to **"Environment"** and add:

```
DB_HOST=<your-railway-mysql-host>
DB_USER=<your-railway-mysql-user>
DB_PASSWORD=<your-railway-mysql-password>
DB_NAME=<your-railway-mysql-database>
JWT_SECRET=<generate-a-random-secret-key>
PORT=10000
```

**Generate JWT Secret**: Use a random string generator or run:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.5 Deploy
- Click **"Create Web Service"**
- Wait for deployment to complete (5-10 minutes)
- Note your backend URL: `https://hostel-backend.onrender.com` (or similar)

---

## 🌐 Step 3: Deploy Frontend (Vercel)

### 3.1 Create Vercel Account
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub

### 3.2 Import Project
1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3.3 Add Environment Variable
Before deploying, add environment variable:
- **Key**: `VITE_API_URL`
- **Value**: `https://your-backend-url.onrender.com` (your Render backend URL)

### 3.4 Deploy
- Click **"Deploy"**
- Wait for deployment (2-5 minutes)
- Your app will be live at: `https://your-app.vercel.app`

---

## 🔄 Step 4: Update CORS Settings

After deploying frontend, update backend CORS:

1. Go to Render dashboard
2. Open your backend service
3. Go to **"Environment"**
4. Add/update:
   ```
   CORS_ORIGIN=https://your-app.vercel.app
   ```
5. Save changes (backend will auto-redeploy)

---

## ✅ Step 5: Verify Deployment

### Test Backend
Visit: `https://your-backend.onrender.com/`
- Should return: `{"status":"ok"}`

### Test Frontend
1. Visit your Vercel URL
2. Try registering a new user
3. Login with credentials
4. Test all features:
   - Dashboard loads
   - Can add rooms
   - Can add students
   - Can create complaints
   - Can post notices

---

## 🎉 You're Done!

Your Hostel Management System is now live and accessible from anywhere!

### Important URLs
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **Database**: Railway Dashboard

---

## 🔧 Troubleshooting

### Backend not connecting to database
- Check environment variables in Render
- Verify Railway database is running
- Check Render logs for connection errors

### Frontend can't reach backend
- Verify `VITE_API_URL` in Vercel
- Check CORS settings in backend
- Ensure backend is deployed and running

### Free tier limitations
- **Render**: Backend sleeps after 15 min of inactivity (first request may be slow)
- **Railway**: $5 credit/month (monitor usage)
- **Vercel**: 100GB bandwidth/month

---

## 🔄 Future Updates

To deploy updates:

### Frontend
```bash
git add .
git commit -m "Update message"
git push
```
Vercel auto-deploys on push!

### Backend
```bash
git add .
git commit -m "Update message"
git push
```
Render auto-deploys on push!

---

## 📞 Support

If you encounter issues:
1. Check platform status pages
2. Review deployment logs
3. Verify environment variables
4. Check database connection

Happy deploying! 🚀
