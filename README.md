# 🚀 Premium Fullstack Portfolio

A professional, high-performance portfolio built with **Next.js 14**, **Node.js**, **Express**, and **MySQL**.

## 🛠️ Tech Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, Axios.
- **Backend**: Node.js, Express.js, MySQL (XAMPP-compatible).
- **Storage**: Cloudinary (Image Uploads).
- **Auth**: JWT & bcryptjs.
- **Mail**: Nodemailer.

## ✨ Features
- **Modern & Premium Design**: Glassmorphism, Mesh Gradients, and Smooth Animations.
- **Dynamic Projects Showcase**: Fetches live data from MySQL.
- **Case Studies**: Deep-dive pages for projects with tech stack and skills.
- **Articles System**: Professional-grade blog integration.
- **Admin Control Panel**: Manage your work, skills, and messages directly.
- **Contact Integration**: functional contact form with email notifications.

## 🚀 Setup Instructions

### 1. Database Setup
- Open **XAMPP Control Panel** and start **Apache** and **MySQL**.
- Go to `http://localhost/phpmyadmin`.
- Create a database called `sahin_db`.
- Import the SQL script provided (all tables are compatible).

### 2. Backend Config
- Navigate to `backend/`.
- Run `npm install`.
- Update `.env` with your DB and Cloudinary credentials.
- Run `npm run dev` to start the server on `http://localhost:5000`.

### 3. Frontend Config
- Navigate to `frontend/`.
- Run `npm install`.
- Create `.env.local` if needed (currently using localhost:5000 defaults).
- Run `npm run dev` to start the dashboard on `http://localhost:3000`.

## 📂 Folder Structure
- `/frontend`: Next.js 14 source code.
- `/backend`: Node.js + Express API.

---
Built with ❤️ for Sahin
#
