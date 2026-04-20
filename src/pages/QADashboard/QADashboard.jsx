import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import './QADashboard.css';

export default function QADashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/qa', label: 'Audit Form', icon: '📝' },
    { path: '/qa/my-audits', label: 'My Audits', icon: '📋' },
    { path: '/qa/upload-users', label: 'Upload Users', icon: '📤' },
    { path: '/qa/reports', label: 'Reports', icon: '📊' }
  ];

  return (
    <div className="qa-dashboard">
      {/* Sidebar */}
      <aside className="qa-sidebar">
        <div className="sidebar-header">
          <h2>Call Audit System</h2>
          <span className="role-badge">QA</span>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.first_name?.[0] || 'Q'}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.first_name} {user?.last_name}</p>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="qa-main">
        <Outlet />
      </main>
    </div>
  );
}
