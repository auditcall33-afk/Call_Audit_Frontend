import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';
import './Dropdown.css';

export default function Dropdown({
  id,
  label,
  options = [],           // [{ value, label, score }]
  value,
  onChange,
  placeholder = 'Select…',
  badge,                  // 'fatal' | 'non-fatal'
  disabled = false,
  clearable = true,
  className = '',
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  const handleSelect = (opt) => {
    onChange(opt.value);
    setOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className={`form-group ${className}`} ref={ref}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {badge && <span className={`badge badge-${badge}`}>{badge === 'fatal' ? 'Fatal' : 'Non-Fatal'}</span>}
        </label>
      )}

      <div className={`dd-control ${open ? 'dd-open' : ''} ${disabled ? 'dd-disabled' : ''}`}
           role="combobox" aria-haspopup="listbox" aria-expanded={open}
           tabIndex={disabled ? -1 : 0}
           onClick={() => !disabled && setOpen(o => !o)}
           onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); !disabled && setOpen(o => !o); } }}>
        <span className={`dd-value ${!selected ? 'dd-placeholder' : ''}`}>
          {selected ? selected.label : placeholder}
        </span>
        <div className="dd-indicators">
          {clearable && selected && !disabled && (
            <button className="dd-clear" onClick={handleClear} aria-label="Clear selection" tabIndex={-1}>
              <X size={12} />
            </button>
          )}
          {selected?.score !== undefined && (
            <span className={`score-badge ${selected.score > 0 ? 'green' : selected.score === 0 && selected.label?.startsWith('NO') ? 'red' : 'gray'}`}>
              {selected.score}
            </span>
          )}
          <ChevronDown size={14} className={`dd-arrow ${open ? 'dd-arrow-open' : ''}`} />
        </div>
      </div>

      {open && (
        <div className="dd-menu" role="listbox">
          {options.map(opt => (
            <div key={opt.value}
                 className={`dd-option ${opt.value === value ? 'dd-selected' : ''}`}
                 role="option" aria-selected={opt.value === value}
                 onClick={() => handleSelect(opt)}>
              <span className="dd-option-label">{opt.label}</span>
              {opt.score !== undefined && (
                <span className={`score-badge ${opt.score > 0 ? 'green' : 'red'}`}>{opt.score}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
