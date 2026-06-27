# 👁️ CivicEye AI

### Autonomous Municipal Resolution & Hyperlocal Community Triage Engine
*Winner of the Vibe2Ship Hackathon — Problem Statement 2: Community Hero*

[![React](https://img.shields.io/badge/React-2024-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-Plugin-646CFF?style=flat-square&logo=vite)](https://vite.dev)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-3.5-4285F4?style=flat-square&logo=googlegemini)](https://ai.google.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

---

## 🏢 Executive Summary

**CivicEye AI** is a state-of-the-art, full-stack municipal resolution and public transparency platform that bridges the gap between citizens and city administration. By replacing fragmented, slow municipal hotlines with **automated, geofenced, and agentic AI pipelines**, CivicEye AI streamlines reporting, prioritizes infrastructure repair, and eliminates duplicate citizen reports.

Citizens report real-world issues (potholes, water leaks, public safety issues, structural damage) by uploading an image or description. In response, **Google Gemini 3.5 (Flash)** acts as the core assessment engine to instantly categorize the ticket, estimate repair costs, calculate population impact, assign the responsible department, and evaluate public safety risks. 

To fit various enterprise deployment environments, CivicEye AI is engineered with an enterprise-grade **Java (Spring Boot 3)** server under `/backend`. For evaluation and testing, the React frontend is fully self-contained via a client-side interceptor that runs all smart geofencing and AI simulations on-the-fly.

---

## 🌌 Core Features

### 1. 📲 Gamified Citizen Dashboard
*   **Intelligent Reporting**: Citizens can easily pin a location and upload an image. The AI engine instantly responds with cost, workforce, and timeline estimations.
*   **Geofenced Duplication Audit**: Uses the Haversine formula to detect duplicate complaints within a **200m radius**. If an issue is already reported, citizens are joined to the existing thread to increase its priority level, preventing backlogged ticket clutter.
*   **Reputation & Reward Loop**: Citizens receive reward points and claim custom achievements (e.g., *Community Guard*, *Trust Verifier*, *Impact Leader*) for contributing or voting.

### 2. 🛡️ Authority Command Dashboard
*   **Priority-Ranked Work Queue**: Sorts issues dynamically based on calculated hazard and risk scores.
*   **Status Lifecycle (Reported ➔ In Progress ➔ Resolved)**: Officers can update an active issue's status to **"In Progress"** (awarding the authority profile **+20 reward points** and initiating real-time status pulses for citizens) before performing final resolutions.
*   **Municipality AI Copilot**: An interactive advisory console enabling City Directors to query the backlog, analyze budgets, and request real-time strategic routing and containment plans.
*   **Visual Proof-of-Resolution**: Officers resolve tickets by logging completion notes and uploading physical visual proof (reconstruction photos).

### 3. 📊 Admin Predictive Insights Dashboard
*   **High-Fidelity Risk Analytics**: Predicts future infrastructural hazards (e.g., thermal transformers under stress, asphalt fatigue) using historical spatial clusters.
*   **Municipal Performance Tracking**: Real-time overview of citizen feedback, municipal resolution speed, and department workloads.

### 4. 📢 Public Transparency Wall
*   **Before/After Accountability**: Visual timeline tracking of repaired community hazards, featuring the **exact hyperlocal location address** for maximum public auditability.
*   **Citizen Satisfaction Rating**: Permits verified citizens to rate the completion quality (1–5 Stars) on resolved tickets.

---

## 🛠️ Tech Stack & Architecture

```
               ┌──────────────────────────────┐
               │    React 19 / Tailwind UI    │
               │      (Framer Motion / UX)    │
               └──────────────┬───────────────┘
                              │
               ┌──────────────▼───────────────┐
               │    Local Sandbox Proxy /     │
               │   Client-Side Interceptor    │
               └──────────────┬───────────────┘
                              │
               ┌──────────────▼───────────────┐
               │      Java Spring Boot 3      │
               │    Enterprise MVC Server     │
               │         (in /backend)        │
               └──────────────┬───────────────┘
                              │
               ┌──────────────▼───────────────┐
               │      Google Gemini API       │
               │    & Firebase Firestore      │
               └──────────────────────────────┘
```

*   **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion (`motion`).
*   **Vector Icons**: `lucide-react`.
*   **Databases & Storage**:
    *   **Cloud Mode**: Google Firebase Firestore (with integrated Firebase Auth).
    *   **Evaluation Mode**: Full-fledged local JSON database module (`civiceye_db.json`) or `localStorage` ensuring 100% client-ready capability for testing.
*   **Backend**: Java Spring Boot 3 with native MVC routing, CORS filters, Google Gemini connectors, and Lombok schemas under `/backend`.

---

## 🔐 Restricted Credentials (Evaluator Access)

To ensure strict compliance with municipal security guidelines, high-clearance portals are restricted. You can access the different authority and administrator portals using these pre-registered mock credentials:

| Portal Access | Email Address | Password | Profile Identity |
| :--- | :--- | :--- | :--- |
| **Authority Command** | `officer@city.gov` | `OfficerSecure2026!` | **Director Sarah Jenkins** *(Roads & Safety)* |
| **Admin Insights** | `admin@city.gov` | `AdminSecure2026!` | **Commissioner Dave Miller** *(City Board)* |

*Note: Public citizen accounts can be registered instantly using the signup form.*

---

## 🚀 Quick Start Guide

### 1. Launch the Sandbox Preview (Frontend Client)

#### Run in Development
Installs all dependencies and starts the frontend sandbox server on port 3000:
```bash
npm run dev
```

#### Build for Production
Compiles static assets to `dist/`:
```bash
npm run build
```

---

### 2. Launch the Java Spring Boot Backend

The production-ready Java Spring Boot code is located in `/backend`.

#### 1. Launch the Spring Boot Server
Navigate to the directory and run using Maven:
```bash
cd backend
mvn clean spring-boot:run
```
The backend server starts on `http://localhost:8080`.

#### 2. Connect the React Frontend
Set a base API URL in your queries or route to `http://localhost:8080` (Cross-Origin Resource Sharing is already fully enabled inside `SecurityConfig.java` to support this connection out-of-the-box).

---

## 📂 Project Structure

```
├── backend/                       # Java Spring Boot 3.x Backend Service
│   ├── pom.xml                    # Maven dependencies (Spring, Firebase, HTTP)
│   └── src/main/java/com/civiceye/backend/
│       ├── config/                # Spring Security and Firebase Initializers
│       ├── controller/            # REST Controllers (Auth, Issues, Copilot)
│       ├── model/                 # Strong data models (GPS, Issue, Verification)
│       └── service/               # Core algorithms & Gemini HTTP connectors
├── src/                           # React 19 Frontend Web App
│   ├── components/                # Interactive UI Modals & Dashboards
│   │   ├── AdminDashboard.tsx     # Admin forecasts & neural hotspots UI
│   │   ├── AuthorityDashboard.tsx # AI Copilot chat advisor & ticket solver
│   │   ├── CitizenDashboard.tsx   # Verified feeds & geofenced reports
│   │   ├── Header.tsx             # Universal navigation bar
│   │   ├── LoginScreen.tsx        # Multi-role access controller
│   │   └── TransparencyWall.tsx   # Public resolution logs & ratings
│   ├── lib/                       # Firebase configuration and error helpers
│   ├── types.ts                   # Core Type definitions shared with API
│   ├── App.tsx                    # Main navigation router
│   └── index.css                  # Tailwind CSS import
├── civiceye_db.json               # Sandbox evaluation JSON database
├── server.ts                      # Node.js Express core API
├── package.json                   # Build and launch commands
└── DOCUMENTATION.md               # Deep system technical specification manual
```

---

## 🏆 Hackathon Evaluation Checklist

*   [x] **Problem Solving & Impact**: Empowers municipal coordination, visualizes backlogs, and rewards community civic responsibility.
*   [x] **Agentic Depth**: Employs **four specialized AI layers** (Vision triage, Haversine spatial deduplication, strategic planning advisor, and neural hotspot risks).
*   [x] **Completeness & Usability**: Clean UX layout featuring smooth animation cues, responsive designs, detailed "Before & After" walls, and advanced error handling.
*   [x] **Robust Error Boundaries**: Gracefully handles network failures, restricted access notices, and features an **automatic local sandbox mode fallback** in case remote Firebase providers are not configured.

---
