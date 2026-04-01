# <div align="center">🏠 UrbanNest</div>
## <div align="center">Premium Real Estate & Real-Time Messaging Platform</div>

<div align="center">

[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.x-000000.svg?logo=express&logoColor=white)](https://expressjs.com/)
[![Angular](https://img.shields.io/badge/Angular-v21.2-dd0031.svg?logo=angular&logoColor=white)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-v18.x-339933.svg?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.x-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-v4.x-010101.svg?logo=socket.io&logoColor=white)](https://socket.io/)

[![RxJS](https://img.shields.io/badge/RxJS-v7.x-B7178C.svg?logo=reactivex&logoColor=white)](https://rxjs.dev/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000.svg?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Multer](https://img.shields.io/badge/Multer-Upload-ff69b4.svg)](https://github.com/expressjs/multer)
[![CORS](https://img.shields.io/badge/CORS-Enabled-003366.svg)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
[![BcryptJS](https://img.shields.io/badge/BcryptJS-Security-yellow.svg)](https://www.npmjs.com/package/bcryptjs)

</div>

---

### 📖 Introduction

**UrbanNest** is a cutting-edge full-stack **MEAN** application designed to revolutionize the connection between real estate agents and property seekers. By combining real-time communication with a sophisticated property management engine, UrbanNest provides a seamless, secure, and professional experience for all stakeholders.

---

### ✨ Key Features

| Feature                | Description                                                                 | Tech Stack             |
|------------------------|-----------------------------------------------------------------------------|------------------------|
| **💬 Real-Time Chat**  | Instant messaging with persistence, typing indicators, and notifications.    | Socket.IO, Mongoose    |
| **🗄️ Dual DB Engine**  | Isolated storage for Admin security data and Application property data.     | MongoDB Multi-Cluster   |
| **🕵️ Agent Directory** | Advanced search for verified agents with professional performance metrics. | Angular Core           |
| **🏗️ Property CRUD**   | Comprehensive lifecycle management for listings with dynamic image uploads. | Express, Multer        |
| **🔐 Secure Auth**    | Multi-role RBAC (Admin, Agent, User) with encrypted credential handling.     | JWT, BcryptJS          |
| **📝 Profile Flow**    | Interactive onboarding requiring agents to verify professional credentials. | Reactive Forms         |

---

### 🛠️ Technology Stack

#### **Frontend Ecosystem**
- **Framework**: Angular v18+ (Enterprise-grade architecture)
- **State Management**: Reactive streams with **RxJS**
- **UI Architecture**: Modern CSS3 using Flex/Grid with a focus on Glassmorphism
- **Real-Time**: Bi-directional communication via **Socket.io-client**

#### **Backend Infrastructure**
- **Runtime**: Node.js & Express.js (High-performance API)
- **Persistence**: MongoDB with **Mongoose** (Relational-style modeling)
- **Security**: Stateless authentication using **JWT** and **BcryptJS** hashing
- **File Processing**: Optimized image handling through **Multer**

---

### 📂 Project Architecture

```bash
UrbanNest/
├── 📂 backend             # Server logic & API services
│   ├── 📂 middleware      # Security protocols & RBAC
│   ├── 📂 models          # Data schemas (Admin, User, Property, Message)
│   ├── 📂 routes          # RESTful endpoints
│   └── 📄 server.js       # Global initialization & Socket hub
├── 📂 frontend            # Client-side application
│   ├── 📂 src/app/core    # Singleton services & state managers
│   ├── 📂 src/app/shared  # Modular UI components
│   └── 📂 src/app/features # Domain-specific modules (Chat, Properties)
└── 📄 README.md           # Documentation root
```

---

### ⚙️ Setup & Installation

#### **Prerequisites**
- Node.js (v18+) & NPM
- MongoDB Atlas Account
- Angular CLI (`npm install -g @angular/cli`)

#### **1. Backend Initialization**
```bash
cd backend
npm install
# Configure .env with MONGODB_URI, JWT_SECRET, and PORT
npm run dev
```

#### **2. Frontend Initialization**
```bash
cd frontend
npm install
npm start
```
> Go to: `http://localhost:4200`

---

### 🤝 Strategic Contribution

UrbanNest is built on the principles of **scalable architecture** and **clean code**. We follow the *Single Responsibility Principle* and *DRY* patterns to maintain a professional codebase.

We invite developers to contribute in the following areas:
- [ ] UI/UX Enhancements for the Property Dashboard
- [ ] Performance Optimization for Real-time Websockets
- [ ] Unit Testing coverage for Core services

---

### 👨‍💻 Core Contributors

<div align="center">

| 👤 Developer | Role/Focus |
| :--- | :--- |
| **Naivedh Patel** | Frontend Architecture & UI Design |
| **Varun Thacker** | Backend Systems & API Development |
| **Vrund Darji** | Security Protocols & Data Integrity |
| **Man Patel** | Authentication & RBAC Implementation |
| **Abhay Maurya** | Full-Stack Code Review & QA |

</div>

---

<div align="center">
  <img src="https://img.shields.io/badge/Designed_with_❤️_by_UrbanNest_Team-blue?style=for-the-badge" />
</div>
