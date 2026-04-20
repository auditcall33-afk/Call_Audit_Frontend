import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const FilterBar = ({ filters, onFilterChange, onSearch, onExport }) => {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '16px', 
      marginBottom: '24px',
      flexWrap: 'wrap',
      alignItems: 'center',
      padding: '16px',
      background: 'white',
      borderRadius: '8px',
      border: '1px solid #E5E7EB'
    }}>
      {/* Search */}
      <div style={{ flex: '1', minWidth: '200px' }}>
        <input
          type="text"
          placeholder="Search by Call ID..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Date Range */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <DatePicker
          selected={filters.dateFrom}
          onChange={(date) => onFilterChange('dateFrom', date)}
          placeholderText="From Date"
          dateFormat="MM/dd/yyyy"
          style={{
            padding: '8px 12px',
            border: '1px solid #D1D5DB',
            borderRadius: '6px'
          }}
        />
        <span>to</span>
        <DatePicker
          selected={filters.dateTo}
          onChange={(date) => onFilterChange('dateTo', date)}
          placeholderText="To Date"
          dateFormat="MM/dd/yyyy"
          style={{
            padding: '8px 12px',
            border: '1px solid #D1D5DB',
            borderRadius: '6px'
          }}
        />
      </div>

      {/* Fatal Status Filter */}
      <div>
        <select
          value={filters.fatalStatus || 'all'}
          onChange={(e) => onFilterChange('fatalStatus', e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #D1D5DB',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        >
          <option value="all">All Fatal Status</option>
          <option value="Yes">Fatal Yes</option>
          <option value="No">Fatal No</option>
        </select>
      </div>

      {/* Audit Status Filter */}
      {filters.auditStatus !== undefined && (
        <div>
          <select
            value={filters.auditStatus || 'all'}
            onChange={(e) => onFilterChange('auditStatus', e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #D1D5DB',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="all">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In Progress</option>
          </select>
        </div>
      )}

      {/* Export Button */}
      {onExport && (
        <button
          onClick={onExport}
          style={{
            padding: '8px 16px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#5568d3'}
          onMouseOut={(e) => e.target.style.background = '#667eea'}
        >
          Export All
        </button>
      )}
    </div>
  );
};

export default FilterBar;
