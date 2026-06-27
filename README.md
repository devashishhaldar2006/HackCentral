<div align="center">
  <img src="./frontend/public/hackcentral.svg" alt="HackCentral Logo" width="120" />

  # HackCentral
  **The Ultimate Platform for Discovering and Organizing Global Hackathons**

  [![Live Demo](https://img.shields.io/badge/Live_Demo-hackcentral.me-0d4af2?style=for-the-badge)](https://hackcentral.me)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](#)
</div>

<br />

## 🚀 Overview
HackCentral is a comprehensive, full-stack platform designed to bridge the gap between hackathon organizers and passionate developers. Whether you are a student looking for your next big coding competition or an organizer trying to manage hundreds of participants, HackCentral provides the tools you need in one unified workspace.

## ✨ Features
* 🔐 **Secure Authentication:** Multi-provider authentication using Firebase (Google) and secure JWT/HTTP-only cookies for custom email/password logins.
* 🎭 **Role-Based Access Control (RBAC):** Distinct dashboards and capabilities for standard `Users` and event `Organizers`.
* 📅 **Event Discovery:** Browse, filter, and save upcoming hackathons globally.
* 🧪 **Project Lab:** A dedicated space for teams to brainstorm, showcase, and collaborate on hackathon projects.
* 📚 **Resource Hub:** Curated learning materials, starter kits, and API documentation for hackathon participants.
* ⚡ **Real-time Architecture:** Built with Socket.IO for live updates and notifications.

## 🛠️ Tech Stack
HackCentral is built using the **MERN** stack and modern web development tools:

**Frontend**
* React 18 (Vite)
* Tailwind CSS (Styling)
* Redux Toolkit (State Management)
* React Router DOM (Navigation)

**Backend**
* Node.js & Express.js
* MongoDB & Mongoose (Database)
* JSON Web Tokens & bcryptjs (Security)
* Socket.IO (WebSockets)
* Nodemailer (OTP & Emails)

**Infrastructure & DevOps**
* **AWS EC2:** Production hosting environment
* **Docker & Docker Compose:** Containerization for frontend and backend
* **Nginx:** Reverse proxy and static file serving
* **Let's Encrypt (Certbot):** Automated SSL/TLS certificates
* **GitHub Actions:** Automated CI/CD deployment pipeline

---

## 💻 Local Development Setup

To run HackCentral locally on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/HackCentral.git
cd HackCentral
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=7777
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
# Add Firebase Admin keys and Nodemailer SMTP credentials here
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Start the Vite development server:
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173`.

---

## 🚢 Production Deployment
HackCentral is fully containerized and features a zero-downtime CI/CD pipeline. Pushing code to the `main` branch automatically triggers a GitHub Action that:
1. Connects to the AWS EC2 instance via SSH.
2. Pulls the latest code.
3. Rebuilds the Docker containers.
4. Restarts the Nginx reverse proxy.

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#) if you want to contribute.

## 📝 License
This project is [MIT](https://opensource.org/licenses/MIT) licensed.
