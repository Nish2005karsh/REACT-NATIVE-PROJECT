# 🍳 RecipeHub – React Native Recipe App

A full-stack React Native recipe application with secure authentication, email OTP verification, favorites system, and YouTube-powered cooking tutorials.

## 📌 Overview

RecipeHub is a cross-platform mobile recipe application built using **React Native + Expo** with a custom **Express backend** and **PostgreSQL (Neon DB)** database. The app allows users to:

- Securely sign up & log in with email OTP verification
- Browse and search recipes
- Watch YouTube cooking tutorials
- Save recipes to favorites
- Manage their profile
- Enjoy a customizable UI with 8 color themes

> This project was built as a learning-based full-stack implementation and enhanced with additional features beyond the base tutorial.

---

## 🚀 Key Highlights

| Feature | Description |
|---|---|
| 🔐 Authentication | Signup & Login with Clerk Authentication |
| ✉️ OTP Verification | 6-Digit Email OTP Verification |
| 🍳 Recipes | Browse Featured Recipes |
| 🗂 Categories | Filter Recipes by Categories |
| 🔍 Search | Search Recipes Instantly |
| 📖 Instructions | View Detailed Cooking Instructions |
| 🎥 Tutorials | Embedded YouTube Video Tutorials |
| ❤️ Favorites | Add Recipes to Favorites |
| 👤 Profile | User Profile Screen |
| 🌈 Themes | 8 Built-in Color Themes |
| ⚡ Notifications | Toast Notifications with React Hot Toast |
| 🆓 Free Stack | 100% Free Stack (No paid services required) |

---

## 🛠 Tech Stack

### 📱 Mobile App
- React Native
- Expo
- Clerk Authentication
- React Navigation
- React Hot Toast
- Axios

### 🖥 Backend
- Node.js
- Express.js
- PostgreSQL (Neon DB)
- REST API Architecture

### 🗄 Database
- Neon (Serverless PostgreSQL)

---

## 🔐 Authentication Flow

Authentication is handled using **Clerk**:

```
1. User signs up with email
2. Clerk sends a 6-digit OTP to email
3. User verifies OTP
4. Secure session is created
5. User data is synced with backend
```

---

## 🧠 Architecture

```
React Native App
      ↓
Clerk (Authentication + OTP)
      ↓
Express Backend API
      ↓
PostgreSQL (Neon DB)
```

- Recipes are fetched from the backend
- Favorites are stored in PostgreSQL
- Profile data is linked to authenticated users
- YouTube tutorials are embedded within recipe pages

---

## 📂 Project Structure

```
/backend
├── routes/
├── controllers/
├── models/
├── server.js
└── .env

/mobile
├── screens/
├── components/
├── navigation/
├── theme/
└── .env
```

---

## ⚙️ Environment Variables

### Backend (`/backend/.env`)
```env
PORT=5001
DATABASE_URL=your_neon_db_url
NODE_ENV=development
```

### Mobile App (`/mobile/.env`)
```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

---

## 🔧 Running the Project Locally

### 1️⃣ Run Backend
```bash
cd backend
npm install
npm run dev
```
> Backend runs on: `http://localhost:5001`

### 2️⃣ Run Mobile App
```bash
cd mobile
npm install
npx expo start
```
- Scan QR code with **Expo Go**
- Or run on Android/iOS emulator

---

## ✨ Features Added Beyond the Base Tutorial

While the core foundation was built following a [CodeSistency](https://www.youtube.com/@CodeSistency) tutorial, the project was expanded with:

- ❤️ Favorites system with persistent storage
- 👤 User profile screen
- 🌈 Multiple dynamic theme support
- 🔔 Toast notifications for better UX
- Improved UI/UX refinements
- Enhanced state management structure

---

## 🎯 Future Improvements

- [ ] Add recipe creation by users
- [ ] Add comments & ratings system
- [ ] Add social sharing
- [ ] Add offline support
- [ ] Add admin dashboard
- [ ] Deploy backend to cloud (Render / Railway / AWS)

---

## 📸 Screenshots

| Home Screen | Recipe Detail | Profile |
|---|---|---|
| ![Home Screen](./assets/home.png) | ![Recipe Detail](./assets/detail.png) | ![Profile](./assets/profile.png) |

---

## 💡 What I Learned

- Full-stack mobile app development
- Authentication flows with Clerk
- Email OTP verification logic
- Backend REST API creation
- PostgreSQL schema design
- State management in React Native
- Clean UI architecture
- Environment configuration & security

---

## 📜 License

This project is open-source and available under the [MIT License](./LICENSE).