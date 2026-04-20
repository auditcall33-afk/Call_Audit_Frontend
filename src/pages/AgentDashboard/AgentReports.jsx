import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { auditService } from '../../services/auditService';
import { authService } from '../../services/authService';
import { generatePerformanceReportPDF } from '../../utils/pdfGenerator';
import { toast } from 'react-toastify';
import './AgentReports.css';

export default function AgentReports() {
  const user = authService.getCurrentUser();
  const [dateFrom, setDateFrom] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [dateTo, setDateTo] = useState(new Date());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    try {
      setLoading(true);
      const audits = await auditService.getAuditsByAgentId(user.agent_id);
      
      // Filter by date range
      const filteredAudits = audits.filter(audit => {
        const auditDate = new Date(audit.created_at || audit.audit_date);
        return auditDate >= dateFrom && auditDate <= dateTo;
      });

      // Calculate report data
      const totalAudits = filteredAudits.length;
      const averageScore = totalAudits > 0 
        ? filteredAudits.reduce((sum, audit) => sum + (audit.scored || 0), 0) / totalAudits 
        : 0;
      const fatalErrorsCount = filteredAudits.filter(audit => audit.fatal_status === 'Yes').length;

      // Parameter-wise analysis
      const parameters = [
        { key: 'call_opening', label: 'Call Opening' },
        { key: 'listening_skills', label: 'Listening Skills' },
        { key: 'empathy_courtesy', label: 'Empathy & Courtesy' },
        { key: 'tone_voice_modulation', label: 'Tone & Voice Modulation' },
        { key: 'telephone_etiquettes', label: 'Telephone Etiquettes' },
        { key: 'language_skill', label: 'Language Skill' },
        { key: 'call_closure', label: 'Call Closure' },
        { key: 'probing_skills', label: 'Probing Skills' },
        { key: 'system_check', label: 'System Check' },
        { key: 'explanation_sop', label: 'Explanation/Adherence to Process SOP' },
        { key: 'rebuttal_handling', label: 'Rebuttal Handling' },
        { key: 'upselling_skills', label: 'Upselling Skills' },
        { key: 'add_on_pitch', label: 'Add-On Pitch' },
        { key: 'right_information', label: 'Right Information' },
        { key: 'documentation_crm', label: 'Documentation/ System/ CRM Entries' },
        { key: 'documentation_order', label: 'Documentation/ Order Related' }
      ];

      const parameterAnalysis = parameters.map(param => {
        const successful = filteredAudits.filter(audit => 
          audit[param.key]?.startsWith('YES')
        ).length;
        const successRate = totalAudits > 0 ? (successful / totalAudits) * 100 : 0;
        const failures = filteredAudits.filter(audit => 
          audit[param.key]?.startsWith('NO')
        ).map(audit => audit[`${param.key}_remark`]).filter(Boolean);
        
        return {
          parameter: param.label,
          successRate: successRate.toFixed(1),
          issues: failures.length > 0 ? failures.slice(0, 3).join(', ') : 'None'
        };
      });

      // Determine trend
      const recentAudits = filteredAudits.slice(-5);
      const olderAudits = filteredAudits.slice(0, -5);
      const recentAvg = recentAudits.length > 0 
        ? recentAudits.reduce((sum, audit) => sum + (audit.scored || 0), 0) / recentAudits.length 
        : 0;
      const olderAvg = olderAudits.length > 0 
        ? olderAudits.reduce((sum, audit) => sum + (audit.scored || 0), 0) / olderAudits.length 
        : 0;
      const trend = recentAvg > olderAvg ? 'Improving' : recentAvg < olderAvg ? 'Declining' : 'Stable';

      setReportData({
        totalAudits,
        averageScore: averageScore.toFixed(1),
        fatalErrorsCount,
        parameterAnalysis,
        trend
      });

      toast.success('Report generated successfully');
    } catch (error) {
      toast.error('Failed to generate report');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!reportData) {
      toast.error('Please generate a report first');
      return;
    }
    generatePerformanceReportPDF(reportData, user, {
      from: dateFrom.toLocaleDateString(),
      to: dateTo.toLocaleDateString()
    });
    toast.success('PDF exported successfully');
  };

  return (
    <div className="agent-reports">
      <div className="page-header">
        <h1>Performance Reports</h1>
        <p className="page-subtitle">Generate and view your performance reports</p>
      </div>

      <div className="report-controls">
        <div className="date-range-picker">
          <div className="date-picker-group">
            <label>From Date</label>
            <DatePicker
              selected={dateFrom}
              onChange={(date) => setDateFrom(date)}
              dateFormat="MM/dd/yyyy"
              className="date-picker-input"
            />
          </div>
          <div className="date-picker-group">
            <label>To Date</label>
            <DatePicker
              selected={dateTo}
              onChange={(date) => setDateTo(date)}
              dateFormat="MM/dd/yyyy"
              className="date-picker-input"
            />
          </div>
        </div>

        <div className="report-actions">
          <button
            onClick={generateReport}
            disabled={loading}
            className="generate-button"
          >
            {loading ? 'Generating...' : 'Generate Performance Report'}
          </button>
          {reportData && (
            <button
              onClick={handleExportPDF}
              className="export-button"
            >
              Export as PDF
            </button>
          )}
        </div>
      </div>

      {reportData && (
        <div className="report-content">
          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card">
              <div className="card-icon">📊</div>
              <div className="card-content">
                <h3>Total Audits</h3>
                <p className="card-value">{reportData.totalAudits}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-icon">⭐</div>
              <div className="card-content">
                <h3>Average Score</h3>
                <p className="card-value">{reportData.averageScore}/100</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-icon">⚠️</div>
              <div className="card-content">
                <h3>Fatal Errors</h3>
                <p className="card-value">{reportData.fatalErrorsCount}</p>
              </div>
            </div>
            <div className="summary-card">
              <div className="card-icon">📈</div>
              <div className="card-content">
                <h3>Trend</h3>
                <p className={`card-value ${reportData.trend === 'Improving' ? 'positive' : reportData.trend === 'Declining' ? 'negative' : 'neutral'}`}>
                  {reportData.trend}
                </p>
              </div>
            </div>
          </div>

          {/* Parameter Analysis Table */}
          <div className="parameter-analysis">
            <h2>Parameter-wise Success Rate</h2>
            <table className="analysis-table">
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Success Rate</th>
                  <th>Common Issues</th>
                </tr>
              </thead>
              <tbody>
                {reportData.parameterAnalysis.map((param, index) => (
                  <tr key={index}>
                    <td>{param.parameter}</td>
                    <td>
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar"
                          style={{ width: `${param.successRate}%` }}
                        />
                        <span className="progress-text">{param.successRate}%</span>
                      </div>
                    </td>
                    <td>{param.issues}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
