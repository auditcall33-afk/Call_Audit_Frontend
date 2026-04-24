import React from 'react';
import { BarChart3 } from 'lucide-react';
import { CollapsibleCard } from '../common/Card/Card';
import './ScoresSection.css';

const SCORE_FIELDS = [
  { id: 'fatalStatus',       label: 'Fatal Status',        default: 'No',  editable: false, color: 'coral'  },
  { id: 'fatalCount',        label: 'Fatal Count',         default: 0,     editable: false, color: 'coral'  },
  { id: 'scorable',          label: 'Scorable',            default: 100,   editable: false, color: 'blue'  },
  { id: 'scored',            label: 'Scored',              default: 0,     editable: false, color: 'purple'},
  { id: 'nonFatalScore',     label: 'Non-Fatal Score',     default: 0,     editable: false, color: 'green' },
];

const colorMap = {
  blue:   { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' },
  purple: { bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE' },
  amber:  { bg: '#FFFBEB', text: '#B45309', border: '#FDE68A' },
  coral:  { bg: '#FFF5F3', text: '#E8533A', border: '#FECACA' },
  green:  { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' },
};

export default function ScoresSection({ values, onChange }) {
  return (
    <CollapsibleCard title="Audit Scores" icon={<BarChart3 size={15} />} defaultOpen={true}>
      <div className="scores-grid">
        {SCORE_FIELDS.map(field => {
          const val = values[field.id] ?? field.default;
          const colors = colorMap[field.color];
          return (
            <div key={field.id} className="score-tile" style={{ background: colors.bg, borderColor: colors.border }}>
              <span className="score-tile-label">{field.label}</span>
              {field.editable ? (
                <input
                  id={field.id}
                  type="number"
                  className="score-tile-input"
                  style={{ color: colors.text }}
                  value={val}
                  onChange={e => onChange(field.id, e.target.value)}
                  aria-label={field.label}
                />
              ) : (
                <span className="score-tile-value" style={{ color: colors.text }}>
                  {typeof val === 'number' && !Number.isInteger(val) ? val.toFixed(2) : val}
                </span>
              )}
              <span className="score-tile-badge" style={{ background: colors.text }}>
                {field.editable ? 'Editable' : 'Calculated'}
              </span>
            </div>
          );
        })}
      </div>
    </CollapsibleCard>
  );
}
