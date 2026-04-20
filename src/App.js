import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';
import './App.css';

import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

// Agent Dashboard
import AgentDashboard from './pages/AgentDashboard/AgentDashboard';
import MyAudits from './pages/AgentDashboard/MyAudits';
import AgentReports from './pages/AgentDashboard/AgentReports';

// QA Dashboard
import QADashboard from './pages/QADashboard/QADashboard';
import AuditForm from './pages/QADashboard/AuditForm';
import MyAuditsList from './pages/QADashboard/MyAuditsList';
import BulkUpload from './pages/QADashboard/BulkUpload';
import QAReports from './pages/QADashboard/QAReports';

export default function App() {
  return (
    <Router>
      <ToastContainer position="top-right" />
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Agent Routes */}
        <Route path="/agent" element={
          <ProtectedRoute requiredRole="AGENT">
            <AgentDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<MyAudits />} />
          <Route path="reports" element={<AgentReports />} />
        </Route>

        {/* QA Routes */}
        <Route path="/qa" element={
          <ProtectedRoute requiredRole="QA">
            <QADashboard />
          </ProtectedRoute>
        }>
          <Route index element={<AuditForm />} />
          <Route path="my-audits" element={<MyAuditsList />} />
          <Route path="upload-users" element={<BulkUpload />} />
          <Route path="reports" element={<QAReports />} />
        </Route>

        {/* Default Redirect - TEMPORARILY CHANGED FOR TESTING */}
        <Route path="/" element={<Navigate to="/qa" replace />} />
      </Routes>
    </Router>
  );
}
