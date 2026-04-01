# 🏠 UrbanNest: Premium Real Estate & Messaging Platform

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Angular](https://img.shields.io/badge/Angular-v21.2-dd0031.svg?logo=angular&logoColor=white)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-v20.x-339933.svg?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**UrbanNest** is a full-stack MEAN application designed to bridge the gap between real estate agents and property seekers. It features a robust real-time communication system, advanced property management, and a dual-purpose database architecture for administrative and application data.

---

## 🚀 Key Features

| Feature                | Description                                                                 | Tech Used              |
|------------------------|-----------------------------------------------------------------------------|------------------------|
| **Real-Time Chat**     | Instant messaging between users and agents with persistence and notifications. | Socket.IO, Mongoose    |
| **Dual Database**      | Separate storage for Admin/Security data and Application/Property data.    | MongoDB Clusters       |
| **Agent Directory**    | Searchable database of verified real estate agents with performance metrics. | Angular Features       |
| **Property CRUD**      | Full lifecycle management for property listings including image uploads.     | Express, Multer        |
| **Role-Based Auth**    | Secure access control for Admins, Agents, and regular Users.                | JWT, BcryptJS, Express |
| **Profile Completion** | Guided onboarding flow for agents to set up their professional portfolio.    | Angular Reactive Forms |

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Angular v21.2.0 (Latest Enterprise Architecture)
- **State Management**: RxJS (Reactive Extensions for JavaScript)
- **Styling**: Modern CSS3 with Flexbox/Grid (Glassmorphism & High-end UI)
- **Communication**: Socket.io-client for real-time duplex data flow.

### Backend
- **Runtime**: Node.js & Express.js (v5.2.1)
- **Database**: MongoDB with Mongoose (Dual-Connection Strategy)
- **Security**: JWT (JSON Web Tokens) & Bcrypt for salted hashing.
- **File Handling**: Multer for cloud-optimized image processing.

---

## 📂 Project Structure

```bash
UrbanNest/
├── 📂 backend             # Node.js / Express Server
│   ├── 📂 middleware      # Auth & Security logic
│   ├── 📂 models          # Mongoose Schemas (Admin, User, Property, Message)
│   ├── 📂 routes          # API Endpoints
│   └── 📄 server.js       # Entry point & Socket.io setup
├── 📂 frontend            # Angular Client
│   ├── 📂 src/app/core    # Services & Guards
│   ├── 📂 src/app/shared  # Reusable UI Components
│   └── 📂 src/app/features # Business Logic Pages (Chat, Properties, Agents)
└── 📄 README.md           # You are here!
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- Node.js (v18.x or higher)
- MongoDB Atlas account or local MongoDB instance.
- Angular CLI (`npm install -g @angular/cli`)

### 2. Backend Configuration
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```
Start the server:
```bash
npm run dev
```

### 3. Frontend Configuration
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```
Start the development server:
```bash
npm start
```
Access the app at `http://localhost:4200`.

---

## 🤝 Contributing
UrbanNest is developed with a focus on modern web standards and clean code architecture. Feel free to fork the repository and submit pull requests for any enhancements.

---

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Developed with ❤️ for the Modern Real Estate Market
</p>
