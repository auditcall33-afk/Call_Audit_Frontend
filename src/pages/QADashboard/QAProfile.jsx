import React from 'react';
import { authService } from '../../services/authService';
import './QAProfile.css';

export default function QAProfile() {
  const user = authService.getCurrentUser();

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p className="page-subtitle">View and manage your profile information</p>
      </div>

      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user?.firstName?.[0] || user?.email?.[0] || 'U'}
          </div>
          <div className="profile-info">
            <h2>{user?.firstName || user?.email}</h2>
            <span className="role-badge">{user?.role}</span>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">User ID</span>
            <span className="detail-value">{user?.id || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Name</span>
            <span className="detail-value">{user?.firstName || user?.lastName ? `${user?.firstName} ${user?.lastName}` : '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">{user?.email || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Phone</span>
            <span className="detail-value">{user?.phone || '-'}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Role</span>
            <span className="detail-value">{user?.role || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
