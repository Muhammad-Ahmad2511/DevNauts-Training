# Phase 1: Real-Time MERN Chat Application (DevNauts Training) 💬

An independent, foundational project completed during **Week 1 (8-Day Sprint)** of the DevNauts Internship. The primary objective of this phase was to gain hands-on exposure to the MERN stack, user authentication, and real-time communication architectures, laying the structural groundwork for the advanced RAG chat interfaces in subsequent phases.

## 🎯 Project Scope & Learning Objectives
Developed completely from scratch within an 8-day timeline, this application focuses strictly on core architectural functionality, backend-to-frontend WebSocket sync, and persistent state management over aesthetic polish.

- **Real-Time Data Flow:** Mastered how a decoupled React client maintains duplex communication with a Node.js runtime over WebSockets.
- **State Persistence:** Engineered database schemas to log transactional chat sessions persistently.
- **Secured Handshakes:** Applied cryptographic session management for basic identity routing.

## 📸 Application Interface
![Application Preview](./screenshot.jpeg)

## 🛠️ Implementation Stack
- **Frontend:** React (Vite), JavaScript (ES6+), clean CSS
- **Backend Architecture:** Node.js, Express.js
- **Real-Time Layer:** Socket.io (Engineered for bi-directional event emission)
- **Database Layer:** MongoDB (Document-based messaging schema)
- **Authentication:** JSON Web Tokens (JWT) for secure registration and login sessions

---

## 📅 8-Day Development Sprint Roadmap

| Timeline | Phase Focus | Key Implementations |
| :--- | :--- | :--- |
| **Days 1–2** | Backend Core & Data Layer | Initialized Node/Express servers, framed MongoDB collections for persistent event logs, and structured JWT authentication protocols. |
| **Days 3–4** | Real-Time Engine Integration | Configured Socket.io event-listeners to emit and broadcast message payloads seamlessly with zero-latency handshakes. |
| **Days 5–6** | Client Interface Matrix | Built the stateless React UI viewport, incorporating transactional message streams, a reactive inputs panel, and active socket connectors. |
| **Days 7–8** | System Wiring & Debugging | Bound auth middleware states into the UI routing, normalized fallback configurations, and ran comprehensive network debugging. |

---

## 🔧 Local Execution Guide

### 1. Repository Setup
```bash
git clone [https://github.com/Muhammad-Ahmad2511/DevNauts-Training.git](https://github.com/Muhammad-Ahmad2511/DevNauts-Training.git)
cd DevNauts-Training/real-time-chat-app

```

### 2. Backend Initialization

```bash
cd server
npm install
npm start

```

*Note: Ensure an active connection string (`MONGO_URI`) and environmental `PORT` parameters are allocated inside your server-side environment configurations.*

### 3. Frontend Initialization

```bash
cd ../client
npm install
npm run dev

```
