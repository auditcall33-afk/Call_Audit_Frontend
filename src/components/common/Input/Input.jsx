import React from 'react';
import './Input.css';

export function Input({
  id, label, value, onChange,
  placeholder = '',
  type = 'text',
  readOnly = false,
  disabled = false,
  className = '',
  hint,
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <input
        id={id}
        type={type}
        value={value ?? ''}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        className={`form-input ${readOnly ? 'read-only' : ''}`}
        aria-label={label}
      />
      {hint && <span className="input-hint">{hint}</span>}
    </div>
  );
}

export function Textarea({
  id, label, value, onChange,
  placeholder = '',
  rows = 3,
  disabled = false,
  className = '',
}) {
  return (
    <div className={`form-group ${className}`}>
      {label && <label htmlFor={id} className="form-label">{label}</label>}
      <textarea
        id={id}
        value={value ?? ''}
        onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className="form-textarea"
        aria-label={label}
      />
    </div>
  );
}
