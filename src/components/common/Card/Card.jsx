import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './Card.css';

export function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function CardHeader({ title, icon, actions, className = '' }) {
  return (
    <div className={`card-header ${className}`}>
      <h3>
        {icon && <span className="card-icon">{icon}</span>}
        {title}
      </h3>
      {actions && <div className="card-actions">{actions}</div>}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`card-body ${className}`}>{children}</div>;
}

export function CollapsibleCard({ title, icon, badge, defaultOpen = true, children, className = '' }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`card section-card ${className}`}>
      <div className="card-header">
        <button className={`section-toggle ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
          {icon && <span className="card-icon">{icon}</span>}
          {title}
          {badge && <span style={{ marginLeft: 8 }}>{badge}</span>}
          <ChevronDown size={16} style={{ marginLeft: 'auto' }} />
        </button>
      </div>
      {open && <div className="section-body">{children}</div>}
    </div>
  );
}
