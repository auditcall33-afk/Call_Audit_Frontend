# Call Audit System - Frontend

This is the React frontend for the **Call Audit System**, a web application used to audit and evaluate call center agent performance. It supports three user roles: **Agent**, **QA (Quality Analyst)**, and **Admin**, each with dedicated dashboards and features.

## What This Project Does

The Call Audit System enables:

- **QA Analysts** to audit agent calls by filling out audit forms, viewing their audit history, and generating reports.
- **Agents** to view their own audit scores and performance summaries.
- **Admins** to upload users in bulk and manage the system.
- **All Users** to securely log in with role-based access, reset forgotten passwords, and set passwords for first-time login.

## Features

### Authentication
- Role-based login (AGENT / QA / ADMIN)
- JWT-based authentication with HttpOnly cookies
- Password visibility toggle on login
- Forgot password flow with email reset link
- First-time password setup via same reset flow

### QA Dashboard (`/qa`)
- Audit call form with scoring criteria
- View "My Audits" history
- Audit form auto-saves drafts

### Agent Dashboard (`/agent`)
- View personal audit scores
- Performance summary

### Admin Dashboard (`/admin`)
- Bulk user upload via Excel/CSV
- System management

## Tech Stack

- **React 19** with functional components and Hooks
- **React Router v7** for client-side routing
- **Axios** for HTTP requests
- **React Toastify** for notifications
- **JSPDF + AutoTable** for PDF report generation
- **xlsx** for Excel file handling
- **Lucide React** for icons
- **React Datepicker** for date inputs
- **React Dropzone** for file uploads

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Running the App

```bash
npm start
```

Runs in development mode at [http://localhost:3000](http://localhost:3000).

The development proxy is configured to forward API calls to `http://localhost:8081`.

### Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_API_URL=http://localhost:8081/api
```

If not set, it defaults to `/api` (using the proxy).

### Build for Production

```bash
npm run build
```

Creates an optimized production build in the `build/` folder.

## Project Structure

```
src/
├── components/        # Reusable components (ProtectedRoute, Sidebar, etc.)
├── pages/
│   ├── Login.jsx                  # Login page
│   ├── ForgotPassword.jsx         # Forgot password request
│   ├── ResetPassword.jsx          # Reset password / first-time setup
│   ├── AgentDashboard/            # Agent views
│   ├── QADashboard/               # QA audit form and history
│   └── AdminDashboard/            # Admin bulk upload
├── services/
│   └── authService.js             # Auth API calls
├── styles/
│   └── global.css                 # Global styles
├── App.js                         # Route definitions
└── index.js                       # Entry point
```

## Role-Based Routes

| Route | Role | Description |
|-------|------|-------------|
| `/login` | Public | Login page |
| `/forgot-password` | Public | Request password reset |
| `/reset-password?token=...` | Public | Set/reset password |
| `/agent` | AGENT | Agent dashboard & my audits |
| `/qa` | QA | Audit form & my audits list |
| `/admin/upload-users` | ADMIN | Bulk user upload |

## API Integration

The frontend communicates with a Spring Boot backend. Key endpoints:

- `POST /api/auth/login` - Authenticate user
- `POST /api/auth/forgot-password` - Request reset link
- `GET /api/auth/validate-reset-token` - Validate reset token
- `POST /api/auth/reset-password` - Reset/Set password
- `POST /api/auth/logout` - Clear session

Authentication tokens are stored in **HttpOnly cookies** by the backend for security. The frontend only stores basic user info (role, name) in `localStorage` for UI purposes.
