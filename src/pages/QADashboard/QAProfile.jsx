import React from 'react';
import { authService } from '../../services/authService';
import './QAProfile.css';

export default function QAProfile() {
  const user = authService.getCurrentUser();

  return (
    <div className="qa-profile">
      <div className="profile-header">
        <h1>Welcome, {user?.first_name} {user?.last_name}</h1>
        <p className="profile-subtitle">QA Dashboard</p>
      </div>

      <div className="profile-card">
        <div className="profile-section">
          <div className="profile-avatar">
            {user?.first_name?.[0] || 'Q'}
          </div>
          <div className="profile-info">
            <h2>{user?.first_name} {user?.last_name}</h2>
            <span className="role-badge">QA</span>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <span className="detail-label">QA ID</span>
            <span className="detail-value">{user?.qa_id || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Name</span>
            <span className="detail-value">{user?.first_name} {user?.last_name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user?.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phone</span>
            <span className="detail-value">{user?.phone || 'N/A'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Role</span>
            <span className="detail-value">QA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
