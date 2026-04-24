import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/authService';
import './AgentDashboard.css';

export default function AgentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = authService.getCurrentUser();
  console.log('AgentDashboard user:', user);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/agent', label: 'My Audits', icon: '📋' },
    { path: '/agent/reports', label: 'Reports', icon: '📊' }
  ];

  return (
    <div className="agent-dashboard">
      {/* Sidebar */}
      <aside className="agent-sidebar">
        <div className="sidebar-header">
          <h2>Call Audit System</h2>
          <span className="role-badge">AGENT</span>
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
              <div className="user-name">{user?.firstName || user?.email}</div>
              <div className="user-role">{user?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="agent-main">
        <Outlet />
      </main>
    </div>
  );
}
