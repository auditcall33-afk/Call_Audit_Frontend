import React, { useState } from 'react';
import { Bell, Search, Save, RotateCcw, ChevronRight } from 'lucide-react';
import './Header.css';

export default function Header({ onSave, onReset, dirty }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="app-header">
      {/* Breadcrumb */}
      <div className="header-breadcrumb">
        <span className="breadcrumb-root">Home</span>
        <ChevronRight size={13} className="breadcrumb-sep" />
        <span className="breadcrumb-root">Quality Assurance</span>
        <ChevronRight size={13} className="breadcrumb-sep" />
        <span className="breadcrumb-current">Call Audit</span>

        {dirty && (
          <span className="header-dirty-badge">Unsaved changes</span>
        )}
      </div>

      {/* Right controls */}
      <div className="header-actions">
        {searchOpen && (
          <input
            autoFocus
            className="header-search-input"
            placeholder="Search audit…"
            onBlur={() => setSearchOpen(false)}
            aria-label="Search"
          />
        )}
        <button
          className="header-icon-btn"
          onClick={() => setSearchOpen(s => !s)}
          aria-label="Search"
        >
          <Search size={17} />
        </button>

        <button className="header-icon-btn header-notif" aria-label="Notifications">
          <Bell size={17} />
          <span className="notif-dot" />
        </button>

        <div className="header-divider" />

        <button
          className="btn btn-ghost btn-sm header-reset-btn"
          onClick={onReset}
          aria-label="Reset form"
          title="Reset all fields"
        >
          <RotateCcw size={14} />
          Reset
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={onSave}
          aria-label="Save audit"
        >
          <Save size={14} />
          Save Audit
        </button>

        {/* User avatar */}
        <div className="header-avatar" aria-label="User profile">
          <span>S</span>
        </div>
      </div>
    </header>
  );
}
