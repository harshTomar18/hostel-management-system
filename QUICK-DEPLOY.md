# 🚀 Quick Deployment Guide

Follow these steps to deploy your Hostel Management System for **FREE**!

## ⚡ Quick Steps

### 1️⃣ Push to GitHub (5 minutes)
```bash
# Make sure you're in the project directory
cd "c:\Users\Anshika Pandey\OneDrive\Desktop\samplewebstie"

# Add all files
git add .

# Commit changes
git commit -m "Ready for deployment"

# Push to GitHub (create repo first if needed)
git push origin main
```

### 2️⃣ Deploy Database on Railway (10 minutes)
1. Go to [railway.app](https://railway.app) → Sign up with GitHub
2. Click **"New Project"** → **"Provision MySQL"**
3. Click on MySQL service → **"Variables"** tab
4. Copy these values (you'll need them later):
   - `MYSQLHOST`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`
   - `MYSQLDATABASE`

5. **Initialize Tables**: Click **"Query"** tab and paste SQL from `DEPLOYMENT.md` (Step 1.4)

### 3️⃣ Deploy Backend on Render (15 minutes)
1. Go to [render.com](https://render.com) → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   DB_HOST=<paste MYSQLHOST from Railway>
   DB_USER=<paste MYSQLUSER from Railway>
   DB_PASSWORD=<paste MYSQLPASSWORD from Railway>
   DB_NAME=<paste MYSQLDATABASE from Railway>
   JWT_SECRET=<any random long string>
   PORT=10000
   ```

6. Click **"Create Web Service"**
7. **Copy your backend URL** (e.g., `https://hostel-backend-xyz.onrender.com`)

### 4️⃣ Deploy Frontend on Vercel (10 minutes)
1. Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. **Add Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `<paste your Render backend URL from step 3>`

5. Click **"Deploy"**
6. **Copy your frontend URL** (e.g., `https://your-app.vercel.app`)

### 5️⃣ Update CORS (5 minutes)
1. Go back to Render dashboard
2. Open your backend service → **"Environment"**
3. Add new variable:
   ```
   CORS_ORIGIN=<paste your Vercel frontend URL from step 4>
   ```
4. Save (backend will auto-redeploy)

### 6️⃣ Test Your App! 🎉
1. Visit your Vercel URL
2. Register a new account
3. Login and explore!

---

## 📋 Checklist
- [ ] Code pushed to GitHub
- [ ] Railway MySQL database created
- [ ] Database tables initialized
- [ ] Backend deployed on Render
- [ ] Environment variables added to Render
- [ ] Frontend deployed on Vercel
- [ ] VITE_API_URL added to Vercel
- [ ] CORS_ORIGIN updated on Render
- [ ] Tested registration & login
- [ ] All features working

---

## 🆘 Need Help?
See detailed instructions in [DEPLOYMENT.md](./DEPLOYMENT.md)

## ⏱️ Total Time: ~45 minutes
