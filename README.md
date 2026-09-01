# EcoCivic: Civic Issue Reporting & Management Platform

An enterprise-grade civic issue reporting and municipal dispatch platform built with **NestJS**, **PostgreSQL / PostGIS**, **React 19**, and **Flutter**.

---

## 📌 Overview

EcoCivic modernizes public infrastructure maintenance by connecting citizens directly with municipal authorities and field workers. Citizens submit geotagged incident reports (potholes, water leakages, electrical hazards), while municipal supervisors triage, assign field workers, track SLA deadlines, and monitor regional resolution performance through data-rich analytics dashboards.

---

## ✨ Features

- **Role-Based Access Control (RBAC)**: Distinct, secure portal workflows for **Citizens**, **Field Workers**, **Municipal Officials**, and **System Admins**.
- **Geospatial Issue Mapping**: Interactive map integration using **Leaflet** backed by **PostGIS** spatial indexing for location-aware complaint routing.
- **SLA & Escalation Engine**: Automated monitoring of resolution deadlines with alert notifications.
- **AI Citizen Assistant**: Integrated AI assistant widget providing immediate triage and report categorization support.
- **Automated PDF Reports**: Real-time generation of official incident summary documents using jsPDF.
- **Cross-Platform Mobile Client**: Flutter mobile application for on-the-go citizen reporting.
- **Dockerized Infrastructure**: Complete container orchestration via Docker Compose.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: NestJS (TypeScript)
- **Database & Spatial**: PostgreSQL with PostGIS extension
- **ORM**: TypeORM
- **Authentication**: JWT Auth with Passport.js & RBAC Guards

### Web Frontend
- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Maps & Charts**: Leaflet, React-Leaflet, Recharts
- **Animation**: Framer Motion
- **Exporting**: jsPDF, html2canvas

### Mobile Application
- **Framework**: Flutter (Dart)

### DevOps & Infrastructure
- **Containers**: Docker, Docker Compose
- **Deployment Blueprint**: Render YAML (`render.yaml`)

---

## 🏛️ Architecture

```
 ┌──────────────────────┐         ┌──────────────────────┐
 │  Flutter Mobile App  │         │   React 19 Web App   │
 └──────────┬───────────┘         └──────────┬───────────┘
            │                                │
            │ (REST API + JWT Bearer Auth)   │
            ▼                                ▼
 ┌───────────────────────────────────────────────────────┐
 │               NestJS API Gateway & Guards             │
 │         (JwtAuthGuard, RolesGuard, ValidationPipe)    │
 └──────────────────────────┬────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
 ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
 │ Reports &    │    │ Routing &    │    │ Analytics &  │
 │ AI Module    │    │ SLA Engine   │    │ Auth Modules │
 └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
                            ▼
 ┌───────────────────────────────────────────────────────┐
 │           PostgreSQL with PostGIS Extension           │
 └───────────────────────────────────────────────────────┘
```

---

## 💻 Installation & Local Setup

### Prerequisites
- Node.js v18+
- Docker & Docker Compose
- Flutter SDK (optional, for mobile client)

### 1. Start Database Container
```bash
docker-compose up -d
```

### 2. Run Backend API
```bash
cd backend
npm install
npm run start:dev
```
Backend server starts on `http://localhost:3000`.

### 3. Run Admin Web Frontend
```bash
cd frontend-admin
npm install
npm run dev
```
Admin web portal starts on `http://localhost:5173`.

---

## 🔐 Environment Variables (.env.example)

Create `backend/.env`:
```env
PORT=3000
NODE_ENV=development
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_secure_password
DATABASE_NAME=ecocivic_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=7d
```

Create `frontend-admin/.env`:
```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Santhoshkumar Chinnadurai**  
- **GitHub**: [@santhoshkumar-chinnadurai](https://github.com/santhoshkumar-chinnadurai)  
- **LinkedIn**: [santhoshkumar-chinnadurai](https://www.linkedin.com/in/santhoshkumar-chinnadurai-4b8034344)
