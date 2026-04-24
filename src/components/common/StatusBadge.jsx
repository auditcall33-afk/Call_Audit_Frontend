import React from 'react';

const StatusBadge = ({ status, type = 'default' }) => {
  const getStatusStyle = () => {
    switch (type) {
      case 'fatal':
        return status === 'Yes' 
          ? { background: '#FEE2E2', color: '#DC2626', border: '#FECACA' }
          : { background: '#D1FAE5', color: '#059669', border: '#A7F3D0' };
      case 'audit':
        return status === 'COMPLETED'
          ? { background: '#D1FAE5', color: '#059669', border: '#A7F3D0' }
          : status === 'IN_PROGRESS'
          ? { background: '#FEF3C7', color: '#D97706', border: '#FDE68A' }
          : { background: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' };
      default:
        return { background: '#F3F4F6', color: '#6B7280', border: '#E5E7EB' };
    }
  };

  const style = getStatusStyle();

  return (
    <span
      style={{
        padding: '4px 12px',
        borderRadius: '9999px',
        fontSize: '12px',
        fontWeight: '600',
        background: style.background,
        color: style.color,
        border: `1px solid ${style.border}`,
        display: 'inline-block'
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
