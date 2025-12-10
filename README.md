# Hostel Management System

A modern, full-stack Progressive Web App (PWA) for managing hostel operations including student management, room allocation, complaints tracking, and notice board functionality.

## 🚀 Features

- **Dashboard**: Real-time statistics and activity monitoring
- **Room Management**: Track room availability, capacity, and occupancy
- **Student Management**: Complete student records with room assignments
- **Complaints System**: Track and manage maintenance requests
- **Notice Board**: Post and manage hostel announcements
- **Staff Directory**: Manage hostel staff information
- **PWA Support**: Install as a mobile/desktop app with offline capabilities
- **Authentication**: Secure login and registration system

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- React Router
- PWA (Progressive Web App)
- CSS3 with modern animations

### Backend
- Node.js
- Express.js
- MySQL Database
- JWT Authentication
- bcrypt for password hashing

## 📦 Local Development

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server
- npm or yarn

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Add your database credentials

# Start server
npm start
```

### Database Setup
1. Create a MySQL database
2. Run the table creation script: `node backend/create-tables.js`
3. Update database credentials in `backend/.env`

## 🌐 Deployment

This application is configured for free deployment on:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Railway

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📝 Environment Variables

### Frontend (.env)
```
VITE_API_URL=your_backend_url
```

### Backend (backend/.env)
```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret
PORT=5000
CORS_ORIGIN=your_frontend_url
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.
