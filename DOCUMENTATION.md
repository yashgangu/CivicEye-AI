# CivicEye AI — System & Technical Documentation
### Hyperlocal Community Problem-Solving Platform
*Vibe2Ship Hackathon Submission — Problem Statement 2: Community Hero*

---

## 🏢 Executive Summary
**CivicEye AI** is an autonomous, full-stack municipal resolution and public transparency platform designed to bridge the gap between local citizens and city administration. By integrating modern computer vision, intelligent geofencing, and agentic reasoning powered by **Google Gemini (using the `@google/genai` SDK)**, CivicEye AI replaces fragmented, slow municipal hotlines with a self-categorizing, automated triage system. 

It empowers citizens to report and verify hyperlocal issues (potholes, water leaks, garbage piles, electrical hazards) while equipping city directors with real-time resource routing advice and predictive infrastructure analytics.

---

## 🛠️ Tech Stack & System Architecture

CivicEye AI is architected as an extremely lightweight client-side application supported by an enterprise-grade **Java Spring Boot 3** server backend:

*   **Frontend**: React 19, Vite, Tailwind CSS, and `motion` (Framer Motion) for highly polished glassmorphic animations and transitions.
*   **Icons**: Standardized vector iconography using `lucide-react`.
*   **Backend Server**: Java Spring Boot 3 web application implementing controllers, security filters, and Firebase Admin SDK bindings under `/backend`.
*   **Sandbox / Client API Interceptor**: A self-contained, high-fidelity interceptor layer (`/src/lib/apiInterceptor.ts`) that overrides `window.fetch` to perform Geofenced Duplication checks, AI visions, and priority scoring client-side in the live preview.
*   **AI Engine**: Java's native `HttpClient` for Spring Boot directly integrating with Google Gemini, alongside a beautiful client-side rules-based simulation fallback.
*   **Database & Persistence**:
    *   **Cloud Persistence**: Google Firebase Firestore database tracking user credentials, municipal profiles, and reward logs.
    *   **Local Persistence / Fallback**: Fully synchronized local storage engine syncing with `localStorage` to support uninterrupted offline testing.
*   **Deployment Configuration**: Configured via `package.json` with standard Vite builds to compile the static application, fully ready to connect to any Spring Boot backend.

---

## 📂 Project Structure

```
├── assets/                        # Static application assets
│   └── .aistudio/                 # AI Studio integration configurations
├── backend/                       # Java Spring Boot 3.x Backend Service
│   ├── pom.xml                    # Maven dependencies (Spring Boot, Firebase, HTTP)
│   └── src/main/java/com/civiceye/backend/
│       ├── config/                # Spring Security and Firebase Initializers
│       ├── controller/            # REST Controllers (Auth, Issues, Copilot)
│       ├── model/                 # Data Models (GPS, Issue, Verification, etc.)
│       └── service/               # Algorithms & Google Gemini API integrations
├── screenshots/                   # Application preview screenshots
│   ├── Admin-insights             # Admin predictive risk hotspots screen
│   ├── authority-portal           # Authority queue and AI Copilot consultation screen
│   ├── citizen-dashboard          # Citizen geofenced reporting and tracking screen
│   ├── Home-page                  # Portal selector landing screen
│   ├── login-page                 # Multi-role authentication gateway screen
│   └── transparency-wall          # Public resolution logs & ratings screen
├── src/                           # React 19 Frontend Web App
│   ├── components/                # Interactive UI Modals & Dashboards
│   │   ├── AdminDashboard.tsx     # Admin forecasts & risk mapping UI
│   │   ├── AuthorityDashboard.tsx # AI Copilot advisory & issue resolutions
│   │   ├── CitizenDashboard.tsx   # Verified incident feeds & active reporting
│   │   ├── Header.tsx             # Global application navigation bar
│   │   ├── LandingPage.tsx        # Modern homepage entrance portal
│   │   ├── LoginScreen.tsx        # Secure credential gatekeeper
│   │   ├── ReportIssueModal.tsx   # AI-assisted hazard reporter form
│   │   └── TransparencyWall.tsx   # Public resolution wall with location tracking
│   ├── lib/                       # Firebase services & middleware interceptors
│   │   ├── apiInterceptor.ts      # Live sandbox API network interceptor
│   │   └── firebase.ts            # Client-side Firebase SDK configuration
│   ├── App.tsx                    # Main navigation routing and layout config
│   ├── index.css                  # Global Tailwind CSS imports and fonts styling
│   ├── main.tsx                   # Client entrypoint compiler mount
│   └── types.ts                   # Unified type definitions shared across systems
├── .env.example                   # Prototype environment template
├── .gitignore                     # Git tracking exclusions rules
├── civiceye_db.json               # Local evaluation sandbox JSON database
├── DOCUMENTATION.md               # Detailed system technical specification manual
├── firebase-applet-config.json    # Connected Firebase environment credentials
├── firebase-blueprint.json        # Firestore database blueprint schemas
├── firestore.rules                # Role-based Cloud Security access rules
├── index.html                     # HTML single page application shell
├── metadata.json                  # AI Studio frame permissions and name
├── package-lock.json              # Frozen dependencies lockfile
├── package.json                   # Web compilation build scripts
├── README.md                      # General introduction and project overview
├── server.ts                      # Optional Node.js Express sandbox API server
├── tsconfig.json                  # Compiler configuration rules
└── vite.config.ts                 # Vite compiler asset optimization options
```

---

## 🤖 Real-Time Agentic AI Integrations

CivicEye AI integrates **four distinct AI layers** to ensure high-fidelity community tracking and automation:

### 1. Vision-Based Civic Incident Analyzer (Agent 1)
When a citizen uploads an image or description of a defect, the backend server contacts the Gemini assessment engine:
*   **Mime-Parsing**: Automatically converts preloaded Unsplash asset URLs or client-side base64 uploads into structured inline image payloads.
*   **Structured JSON Output**: Gemini uses strict schema enforcement (`Type.OBJECT`) to return categorized results.
*   **Automated Indicators**: Computes confidence scores, assigns the responsible department, evaluates daily population impact metrics, lists nearby critical facilities (such as schools, hospitals), and details comprehensive risks.

### 2. Geofenced Duplication & Distance Audit (Agent 2)
To prevent municipal report bloat and discourage duplicate tickets:
*   **Haversine Formula**: Checks the coordinates of any incoming issue against existing active cases within a **200-meter radius**.
*   **Interlocking Flows**: If a duplicate is detected, the citizen is prompted to view the existing issue and click **"Join Issue Tracker"** rather than creating a duplicate, which boosts the existing ticket's community priority score.

### 3. Municipality Copilot Chat Advisory (Agent 3)
Built into the Authority Dashboard, the **Copilot** acts as an elite executive assistant for city directors:
*   **In-Context Prompting**: Feeds active ticket statistics, municipal backlogs, and resolution rate percentages directly into the Gemini session history.
*   **Strategic Actionable Output**: Directs department engineers on where to route emergency budgets, which wards require immediate containment, and schedules workforce teams based on hazard priorities.

### 4. Predictive Risk Analytics (Agent 4)
Located in the Admin Insights Portal, this agent forecasts infrastructural threats before they happen:
*   **Pattern Analysis**: Evaluates historical municipal data clusters to predict 3 high-probability risk hotspots in the next 30 days.
*   **Neural Mapping**: Generates precise coordinates, specifies risk indices (e.g., asphalt shear fatigue, thermal micro-grid transformer stress), and writes localized reasoning.

---

## 👥 Role Workflows & UX Design

### 1. The Citizen Dashboard
Citizens are gamified to participate actively in municipal health:
*   **Smart Report Modal**: Users can easily pinpoint locations, select categories, and view instant AI-generated cost, completion, and workforce projections.
*   **Community Verification**: Citizens can search neighborhood reports on a map, auditing them via **"Confirm"** or **"Reject"** buttons (limited to one vote per user) to build trust.
*   **Reward System**: Grants points and achievements (e.g., *Active Citizen*, *Top Verifier*, *Community Hero*) for submitting or confirming reports, visible on user profile badges.

### 2. The Authority Dashboard
Tailored for department supervisors and on-the-ground repair crews:
*   **Strategic Queue**: Displays active tickets grouped by AI priority scores.
*   **Interactive Copilot**: High-contrast consulting console with quick-query recommendation buttons.
*   **Status Lifecycle (Reported ➔ In Progress ➔ Resolved)**: Officers can update an active issue's status to **"In Progress"** (awarding the authority profile **+20 reward points** and initiating real-time status pulses for citizens) before performing final resolutions.
*   **Proof-of-Resolution Portal**: Officers resolve tickets by entering restoration logs and providing visual photographic proof (Unsplash proof presets are dynamically pre-loaded for ease of evaluation).

### 3. The Admin Insights Dashboard
A high-level view for City Commissioners:
*   **Performance Metrics**: Overall municipal resolution speed, citizen feedback ratings, and department backlogs shown via animated visual meters.
*   **Predictive Maintenance Map**: Visualizes the AI-forecasted risk hotspots with quick dispatch triggers.

### 4. Public Transparency Wall
A publicly accessible, high-contrast wall showing "Before" and "After" evidence of resolved issues, actual completion times, **hyperlocal location addresses of resolved hazards**, and citizen satisfaction scores (1-5 stars) to guarantee high accountability.

---

## 🔐 Security & Access Control Policies

To align with strict enterprise security practices, CivicEye AI enforces strict authorization boundaries:

### 1. Registration Boundaries
*   **Citizen Restricted**: The public signup panel restricts registered nodes exclusively to the `citizen` clearance level.
*   **Unauthorized Escalation Prevention**: High-clearance roles cannot be created through the public sign-up screen, preventing unauthorized permission escalations.

### 2. High-Clearance Portals (Authority & Admin)
Authority and Admin modules are locked behind **hardcoded municipal keys** that cannot be bypassed. The hardcoded security credentials are:

*   **Authority Portal (Director Sarah Jenkins)**:
    *   **Email**: `officer@city.gov`
    *   **Password**: `OfficerSecure2026!`
*   **Admin Insights (Commissioner Dave Miller)**:
    *   **Email**: `admin@city.gov`
    *   **Password**: `AdminSecure2026!`

### 3. Graceful Local Fallbacks & Robust Error Handling
*   **Intelligent Alerting**: Features customized, user-friendly municipal error panels (rate-limiting warnings, account restrictions, service configuration misalignments) complete with a quick-action link to email the system administrator at `admin@city.gov`.
*   **Automatic Evaluation Sandbox**: If email/password authentication or Firebase services are not enabled in the user's Firebase console, the system safely triggers an **intelligent Local Sandbox mode**, preserving the complete multi-role user flow and enabling seamless hackathon evaluations.

---

## 🗄️ Core Database Models

```typescript
export interface GPSLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface Verification {
  citizenEmail: string;
  type: "confirm" | "reject";
  comment?: string;
  timestamp: string;
}

export interface ImpactAssessment {
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  accidentProbability: number; // 0 - 100%
  environmentalImpact: string;
  populationAffected: number;
  nearbyFacilities: string[];
  explanation: string;
}

export interface ResolutionRecommendation {
  suggestedResolution: string;
  estimatedCost: string;
  estimatedCompletionTime: string;
  requiredWorkforce: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  confidenceScore: number;
  department: string;
  status: "Reported" | "In Progress" | "Resolved";
  imageUrl: string;
  resolvedImageUrl?: string;
  resolvedNotes?: string;
  resolvedAt?: string;
  resolutionTimeDays?: number;
  gps: GPSLocation;
  reporterEmail: string;
  reporterName: string;
  verificationCount: number;
  rejectionCount: number;
  verifications: Verification[];
  impact: ImpactAssessment;
  priorityScore: number; // Calculated on server (0 - 100)
  priorityReason: string;
  resolution: ResolutionRecommendation;
  createdAt: string;
  citizenSatisfactionScore?: number; // 1-5 Star rating
}

export interface UserProfile {
  email: string;
  name: string;
  role: "citizen" | "authority" | "admin";
  avatar: string;
  rewardPoints: number;
  achievements: string[];
}
```

---

## 📦 API Endpoints Reference

| Method | Endpoint | Description | Payload Schema |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/issues` | Retrieves all submitted community issues. | *None* |
| **POST** | `/api/auth/login` | Authenticates / creates a user. | `{ email: string }` |
| **POST** | `/api/issues/analyze-and-check` | Performs geofenced duplication checks and extracts AI metrics. | `{ imageUrl?: string, description: string, gps: GPSLocation, forceSubmit?: boolean }` |
| **POST** | `/api/issues/submit` | Commits a new audited issue to the database. | Full `Issue` details (excluding computed priority values) |
| **POST** | `/api/issues/verify` | Registers community verification votes and updates dynamic priorities. | `{ issueId: string, citizenEmail: string, type: "confirm" \| "reject", comment?: string }` |
| **POST** | `/api/issues/join` | Joins a citizen to an existing tracking code (avoids duplication). | `{ issueId: string, citizenEmail: string, citizenName: string }` |
| **POST** | `/api/issues/progress` | Sets the status of an issue to In Progress and rewards points. | `{ issueId: string, officerEmail?: string }` |
| **POST** | `/api/issues/resolve` | Marks a ticket as Resolved and logs photo proof. | `{ issueId: string, resolvedNotes: string, resolvedImageUrl: string, officerEmail?: string }` |
| **POST** | `/api/issues/rate` | Rates a completed repair. | `{ issueId: string, score: number }` |
| **POST** | `/api/copilot` | Prompts the AI Copilot Advisor. | `{ message: string, history?: CopilotMessage[] }` |
| **GET** | `/api/predictions` | Pulls 30-day ahead neural hotspot analytics. | *None* |

---

## ☕ Java Spring Boot Production Backend

For enterprise-grade production scaling, the backend logic is implemented in **Java Spring Boot 3.x** under the `/backend` directory. This backend provides strong typing, robust dependency injection, and clean annotations.

### 1. Spring Boot Architecture Mapping
*   **Security Configuration (`SecurityConfig.java`)**: Implements strict CORS setups to connect with the Vite frontend (port 3000), CSRF protection, and route request validation.
*   **Firebase Initializer (`FirebaseConfig.java`)**: Safely bootstraps the Firestore connected environment, providing beautiful fallback logs for local database evaluations.
*   **Gemini Proxy (`GeminiService.java`)**: Directly integrates with the `gemini-1.5-flash` endpoint via Java's native `HttpClient`, ensuring strict JSON schema mappings and seamless local simulation wrappers.
*   **Issue Service (`IssueService.java`)**: Governs database persistence with support for fallback local JSON storage syncing (`civiceye_db.json`), executes the **Haversine Geofenced Duplication detection algorithm**, and handles municipal priority point allocations.
*   **REST Controllers**: Exposes endpoints under `/api/auth`, `/api/issues`, `/api/copilot`, and `/api/predictions` with perfect endpoint path compatibility.

---

## 🚀 Setup & Execution Guide

### 1. Launching the Sandbox Preview (Frontend Client)

#### Development Mode
Installs and starts the client application in sandbox/offline-ready mode:
```bash
npm run dev
```

#### Production Build
Builds optimized static assets for client-side hosting:
```bash
npm run build
```

### 2. Launching the Spring Boot Server (Java Backend)

#### 1. Compile and Launch the Backend
Navigate to the `/backend` directory and run the Spring Boot Maven wrapper:
```bash
cd backend
mvn clean spring-boot:run
```
The backend server boots on `http://localhost:8080`.

#### 2. Connect the React Frontend
Update your queries or set a base API URL in your React app to point to `http://localhost:8080` (Cross-Origin Resource Sharing is already fully enabled inside `SecurityConfig.java` to support this connection out-of-the-box).

