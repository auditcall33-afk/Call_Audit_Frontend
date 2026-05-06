import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';
import './App.css';

import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';

// Agent Dashboard
import AgentDashboard from './pages/AgentDashboard/AgentDashboard';
import MyAudits from './pages/AgentDashboard/MyAudits';

// QA Dashboard
import QADashboard from './pages/QADashboard/QADashboard';
import AuditForm from './pages/QADashboard/AuditForm';
import MyAuditsList from './pages/QADashboard/MyAuditsList';

// Admin Dashboard
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import BulkUpload from './pages/AdminDashboard/BulkUpload';

export default function App() {
  return (
    <Router>
      <ToastContainer position="top-right" />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Agent Routes */}
        <Route path="/agent" element={
          <ProtectedRoute requiredRole="AGENT">
            <AgentDashboard />
          </ProtectedRoute>
        }>
          <Route index element={<MyAudits />} />
        </Route>

        {/* QA Routes */}
        <Route path="/qa" element={
          <ProtectedRoute requiredRole="QA">
            <QADashboard />
          </ProtectedRoute>
        }>
          <Route index element={<AuditForm />} />
          <Route path="my-audits" element={<MyAuditsList />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }>
          <Route path="upload-users" element={<BulkUpload />} />
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
