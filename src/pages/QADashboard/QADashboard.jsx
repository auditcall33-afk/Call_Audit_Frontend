import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import './QADashboard.css';

export default function QADashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  console.log('QADashboard user:', user);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/qa', label: 'Audit Form', icon: '📝' },
    { path: '/qa/my-audits', label: 'My Audits', icon: '📋' }
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
              {user?.firstName?.[0] || user?.email?.[0] || 'U'}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.firstName || ''} {user?.lastName || ''}</div>
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
