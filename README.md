# Welcome to As2alny (اسألني) 🇪🇬

<div align="center">
<img src="src/assets/images/logoo.png" alt="As2alny Logo" width="200" height="auto" />

بلدك بين إيدك.. تكنولوجيا مصرية لخدمة المصريين

All Egyptian government services at your fingertips, powered by AI.

<p align="center">
<a href="https://angular.dev"><img src="https://img.shields.io/badge/Angular_21-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" /></a>
<a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
<a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
<a href="https://rxjs.dev/"><img src="https://img.shields.io/badge/RxJS-B7178C?style=for-the-badge&logo=reactivex&logoColor=white" alt="RxJS" /></a>
</p>
</div>

---

# 📖 About the Project | عن المشروع

**As2alny (اسألني)** is a modern, unified platform designed to simplify and centralize access to Egyptian government services. Built with a heavy focus on user experience, the application features a fully responsive, modern Arabic (RTL) interface.

Beyond just listing services, **As2alny integrates an AI-powered assistant** that guides users through specific governmental procedures and uses smart geolocation to route them to the nearest physical branches.

---

# ✨ Key Features

## 🤖 AI-Powered Smart Assistant

- **Context-Aware Chatbot**  
  Each service features a dedicated AI assistant to answer user queries using official data.

- **📍 Smart Geolocation Routing**  
  Integrated geolocation asks for user permission to find the nearest government branch (e.g., Post Office, Traffic Department) and embeds a live Google Maps route directly inside the chat UI.

---

## ⚡ Cutting-Edge Frontend

- **Angular Signals**  
  Highly optimized state management using modern Angular Signals (`signal`, `computed`) instead of traditional variables.

- **Smooth View Transitions**  
  Utilizes the **View Transitions API** (`::view-transition-new`) for seamless, app-like page navigation.

- **Real-time Smart Search**  
  Debounced (**500ms**) reactive search using **RxJS**, ensuring the server is not overwhelmed while providing instant feedback with skeleton loaders.

---

## 🔐 Robust Security & Authentication

- **JWT Integration**  
  Secure authentication flow parsing tokens via **jwt-decode**.

- **Refresh Token Interceptors**  
  Silent token refreshing in the background ensures users stay logged in without interruption.

- **Secure Storage**  
  Utilizes **ngx-cookie-service** to safely store access and refresh tokens.

- **Full Auth Flow**  
  Includes **Login, Registration, OTP Verification, and Password Reset**.

---

## 🎨 Modern UI/UX (RTL First)

- **Glassmorphism Design**  
  Beautiful translucent components, backdrop blurs, and animated gradients built entirely with **Tailwind CSS**.

- **Interactive Feedback**  
  Integrated **@ngxpert/hot-toast** for elegant, custom-styled success and error notifications.

- **Native Arabic Support**  
  Built from the ground up with the **Cairo font** and full **RTL directionality**.

---

# 🗂️ Project Architecture

The project follows a **modular, standalone component architecture** optimized for maintainability:

```
src/
├── app/
│   ├── core/                  # Core singletons and services
│   │   ├── guard/             # Route protection (AuthGuard)
│   │   ├── interceptor/       # HTTP Interceptors (Refresh Token)
│   │   ├── interfaces/        # TypeScript models (Daum, IService)
│   │   └── services/          # API Handlers (AI, Auth, Services)
│   ├── layouts/               # Master layouts (Main, Auth)
│   ├── pages/                 # Standalone Page Components
│   │   ├── chat-bot/          # AI messaging interface
│   │   ├── home/              # Main dashboard with search & pagination
│   │   ├── login/             # Authentication pages
│   │   └── service-details/   # Specific service info
│   ├── shared/                # Reusable UI components
│   ├── app.config.ts          # App providers & interceptor config
│   └── app.routes.ts          # Application routing
└── assets/                    # Images, icons, and static files
```

---

# 🛠️ Built With

- **Framework:** Angular CLI v21.1.0 (Standalone Components, SSR/Hydration ready)
- **Styling:** Tailwind CSS v3/v4 (Custom theme with Cairo font)
- **State Management:** Angular Signals & RxJS
- **HTTP Client:** Modern fetch API integration (`provideHttpClient(withFetch())`)
- **Notifications:** `@ngxpert/hot-toast`
- **Backend Integration:** Connected to a robust **Vercel-hosted RESTful API**  
  https://isalny-backend.vercel.app/api/v1/

---

# 🚀 Getting Started

## Prerequisites

- **Node.js** (v18.x or higher)
- **Angular CLI**

```bash
npm install -g @angular/cli
```

---

## Installation & Execution

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/as2alny.git
cd as2alny
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Start the development server

```bash
ng serve
```

Navigate to:

```
http://localhost:4200/
```

The application will automatically reload whenever you modify any of the source files.

---

# 🧪 Testing

To execute unit tests with **Vitest**, run:

```bash
ng test
```
