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