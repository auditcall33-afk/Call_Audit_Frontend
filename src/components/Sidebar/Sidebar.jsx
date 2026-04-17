import React, { useState } from 'react';
import {
  LayoutDashboard, PhoneCall, BarChart3, Settings,
  Users, FileText, ChevronLeft, ChevronRight,
  Headphones, Bell
} from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard',    active: false },
  { icon: <PhoneCall size={18} />,       label: 'Call Audit',   active: true  },
  { icon: <BarChart3 size={18} />,       label: 'Reports',      active: false },
  { icon: <Users size={18} />,           label: 'Agents',       active: false },
  { icon: <FileText size={18} />,        label: 'Documents',    active: false },
  { icon: <Headphones size={18} />,      label: 'Support',      active: false },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Headphones size={20} />
        </div>
        {!collapsed && (
          <div className="sidebar-brand-text">
            <span className="sidebar-brand-name">AuditPro</span>
            <span className="sidebar-brand-sub">Call Centre QA</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="sidebar-nav" role="navigation" aria-label="Main navigation">
        {NAV_ITEMS.map(item => (
          <button
            key={item.label}
            className={`sidebar-item ${item.active ? 'sidebar-item-active' : ''}`}
            title={collapsed ? item.label : undefined}
            aria-label={item.label}
            aria-current={item.active ? 'page' : undefined}
          >
            <span className="sidebar-item-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar-item-label">{item.label}</span>}
            {!collapsed && item.active && <span className="sidebar-active-dot" />}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <button
          className="sidebar-item"
          title={collapsed ? 'Settings' : undefined}
          aria-label="Settings"
        >
          <span className="sidebar-item-icon"><Settings size={18} /></span>
          {!collapsed && <span className="sidebar-item-label">Settings</span>}
        </button>

        {/* Collapse toggle */}
        <button
          className="sidebar-collapse-btn"
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
