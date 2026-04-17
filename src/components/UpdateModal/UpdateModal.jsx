import React, { useState } from 'react';
import { X, Minus, Maximize2, CheckCircle2 } from 'lucide-react';
import './UpdateModal.css';

export default function UpdateModal({ changes = [], onClose, onConfirm }) {
  const [remarksChecked, setRemarksChecked] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);

  if (!changes.length) return null;

  return (
    <div className={`modal-backdrop ${minimized ? 'modal-minimized' : ''}`} role="dialog" aria-modal="true" aria-label="Update Confirmation">
      <div className={`modal-box ${maximized ? 'modal-maximized' : ''} ${minimized ? 'modal-min-box' : ''}`}>

        {/* Title bar */}
        <div className="modal-titlebar">
          <div className="modal-title-left">
            <CheckCircle2 size={18} className="modal-title-icon" />
            <span>Confirm Updates</span>
            <span className="modal-change-count">{changes.length} change{changes.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="modal-window-controls">
            <button className="modal-win-btn" onClick={() => setMinimized(m => !m)} aria-label="Minimize"><Minus size={14} /></button>
            <button className="modal-win-btn" onClick={() => setMaximized(m => !m)} aria-label="Maximize"><Maximize2 size={14} /></button>
            <button className="modal-win-btn modal-close" onClick={onClose} aria-label="Close"><X size={14} /></button>
          </div>
        </div>

        {!minimized && (
          <>
            <div className="modal-body">
              <p className="modal-subtitle">Please review the following changes before submitting.</p>

              <div className="modal-table-wrap">
                <table className="modal-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Field</th>
                      <th>Old Value</th>
                      <th>New Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {changes.map((c, i) => (
                      <tr key={i}>
                        <td className="modal-idx">{i + 1}</td>
                        <td className="modal-field">{c.field}</td>
                        <td className="modal-old">{c.oldValue || <em className="modal-empty">—</em>}</td>
                        <td className="modal-new">{c.newValue || <em className="modal-empty">—</em>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Remarks */}
              <div className="modal-remarks">
                <label className="modal-checkbox-label">
                  <input
                    type="checkbox"
                    checked={remarksChecked}
                    onChange={e => setRemarksChecked(e.target.checked)}
                    className="modal-checkbox"
                  />
                  Add Remarks
                </label>
                {remarksChecked && (
                  <textarea
                    className="form-textarea modal-remarks-ta"
                    rows={3}
                    placeholder="Enter your remarks…"
                    value={remarks}
                    onChange={e => setRemarks(e.target.value)}
                    aria-label="Remarks"
                  />
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost btn-md" onClick={onClose}>Cancel</button>
              <button className="btn btn-primary btn-md" onClick={() => onConfirm({ remarks })}>
                <CheckCircle2 size={16} />
                Confirm &amp; Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
