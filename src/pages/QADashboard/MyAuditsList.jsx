import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auditService } from '../../services/auditService';
import { authService } from '../../services/authService';
import FilterBar from '../../components/common/FilterBar';
import StatusBadge from '../../components/common/StatusBadge';
import { generateAuditPDF } from '../../utils/pdfGenerator';
import { generateAuditsExcel } from '../../utils/excelGenerator';
import { toast } from 'react-toastify';
import './MyAuditsList.css';

export default function MyAuditsList() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const [audits, setAudits] = useState([]);
  const [filteredAudits, setFilteredAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState({
    search: '',
    dateFrom: null,
    dateTo: null,
    fatalStatus: 'all',
    auditStatus: 'all'
  });

  useEffect(() => {
    fetchAudits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audits, filters]);

  const fetchAudits = async () => {
    try {
      setLoading(true);
      const data = await auditService.getAuditsByQaId(user.qa_id);
      setAudits(data);
      setFilteredAudits(data);
    } catch (error) {
      toast.error('Failed to fetch audits');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...audits];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(audit =>
        audit.call_id?.toLowerCase().includes(filters.search.toLowerCase()) ||
        (audit.agent && `${audit.agent.first_name} ${audit.agent.last_name}`.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    // Date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(audit =>
        new Date(audit.created_at || audit.audit_date) >= filters.dateFrom
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(audit =>
        new Date(audit.created_at || audit.audit_date) <= filters.dateTo
      );
    }

    // Fatal status filter
    if (filters.fatalStatus !== 'all') {
      filtered = filtered.filter(audit =>
        audit.fatal_status === filters.fatalStatus
      );
    }

    // Audit status filter
    if (filters.auditStatus !== 'all') {
      filtered = filtered.filter(audit =>
        audit.status === filters.auditStatus
      );
    }

    setFilteredAudits(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleViewDetails = (audit) => {
    setSelectedAudit(audit);
    setShowModal(true);
  };

  const handleEdit = (audit) => {
    if (audit.status === 'IN_PROGRESS') {
      // Navigate to audit form with pre-filled data
      navigate('/qa', { state: { auditData: audit } });
    } else {
      toast.info('Only IN_PROGRESS audits can be edited');
    }
  };

  const handleExportPDF = (audit) => {
    generateAuditPDF(audit, audit.agent, { first_name: user.first_name, last_name: user.last_name, qa_id: user.qa_id });
  };

  const handleExportAll = () => {
    generateAuditsExcel(filteredAudits);
    toast.success('Exported to Excel successfully');
  };

  const handleSort = (field) => {
    const sorted = [...filteredAudits].sort((a, b) => {
      if (field === 'date') {
        return new Date(b.created_at || b.audit_date) - new Date(a.created_at || a.audit_date);
      } else if (field === 'score') {
        return (b.scored || 0) - (a.scored || 0);
      }
      return 0;
    });
    setFilteredAudits(sorted);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAudits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAudits.length / itemsPerPage);

  return (
    <div className="my-audits-list">
      <div className="page-header">
        <h1>My Audits</h1>
        <p className="page-subtitle">View all audits created by you</p>
      </div>

      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onExport={handleExportAll}
      />

      {loading ? (
        <div className="loading-state">Loading audits...</div>
      ) : filteredAudits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No audits found</h3>
          <p>Create your first audit to get started.</p>
        </div>
      ) : (
        <>
          <div className="table-header">
            <div className="sort-buttons">
              <button onClick={() => handleSort('date')} className="sort-button">
                Sort by Date
              </button>
              <button onClick={() => handleSort('score')} className="sort-button">
                Sort by Score
              </button>
            </div>
            <span className="results-count">{filteredAudits.length} results</span>
          </div>

          <div className="audits-table">
            <table>
              <thead>
                <tr>
                  <th>Call ID</th>
                  <th>Agent Name</th>
                  <th>Status</th>
                  <th>Scored</th>
                  <th>Fatal Status</th>
                  <th>Created Date</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(audit => (
                  <tr key={audit.id || audit.audit_id}>
                    <td>{audit.call_id}</td>
                    <td>
                      {audit.agent ? `${audit.agent.first_name} ${audit.agent.last_name}` : audit.agent_name || '-'}
                    </td>
                    <td>
                      <StatusBadge status={audit.status || 'COMPLETED'} type="audit" />
                    </td>
                    <td>{audit.scored || 0}/100</td>
                    <td>
                      <StatusBadge status={audit.fatal_status || 'No'} type="fatal" />
                    </td>
                    <td>{new Date(audit.created_at || audit.audit_date).toLocaleDateString()}</td>
                    <td>{audit.updated_at ? new Date(audit.updated_at).toLocaleDateString() : '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleViewDetails(audit)}
                          className="action-button view-button"
                        >
                          View
                        </button>
                        {audit.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => handleEdit(audit)}
                            className="action-button edit-button"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleExportPDF(audit)}
                          className="action-button export-button"
                        >
                          PDF
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Audit Details Modal */}
      {showModal && selectedAudit && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Audit Details - Call ID: {selectedAudit.call_id}</h2>
              <button onClick={() => setShowModal(false)} className="close-button">×</button>
            </div>
            <div className="modal-body">
              {/* Call Information */}
              <div className="section">
                <h3>Call Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Call ID</span>
                    <span className="info-value">{selectedAudit.call_id}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Agent Name</span>
                    <span className="info-value">
                      {selectedAudit.agent ? `${selectedAudit.agent.first_name} ${selectedAudit.agent.last_name}` : selectedAudit.agent_name || '-'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status</span>
                    <StatusBadge status={selectedAudit.status || 'COMPLETED'} type="audit" />
                  </div>
                  <div className="info-item">
                    <span className="info-label">Created Date</span>
                    <span className="info-value">{new Date(selectedAudit.created_at || selectedAudit.audit_date).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Updated</span>
                    <span className="info-value">{selectedAudit.updated_at ? new Date(selectedAudit.updated_at).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
              </div>

              {/* Evaluation Results */}
              <div className="section">
                <h3>Evaluation Results</h3>
                <table className="evaluation-table">
                  <thead>
                    <tr>
                      <th>Parameter Name</th>
                      <th>Evaluation</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Call Opening</td>
                      <td>{selectedAudit.call_opening || '-'}</td>
                      <td>{selectedAudit.call_opening_remark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Listening Skills</td>
                      <td>{selectedAudit.listening_skills || '-'}</td>
                      <td>{selectedAudit.listening_skills_remark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Empathy & Courtesy</td>
                      <td>{selectedAudit.empathy_courtesy || '-'}</td>
                      <td>{selectedAudit.empathy_courtesy_remark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Tone & Voice Modulation</td>
                      <td>{selectedAudit.tone_voice_modulation || '-'}</td>
                      <td>{selectedAudit.tone_voice_modulation_remark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Telephone Etiquettes</td>
                      <td>{selectedAudit.telephone_etiquettes || '-'}</td>
                      <td>{selectedAudit.telephone_etiquettes_remark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Language Skill</td>
                      <td>{selectedAudit.language_skill || '-'}</td>
                      <td>{selectedAudit.language_skill_remark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Call Closure</td>
                      <td>{selectedAudit.call_closure || '-'}</td>
                      <td>{selectedAudit.call_closure_remark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Probing Skills</td>
                      <td>{selectedAudit.probing_skills || '-'}</td>
                      <td>{selectedAudit.probing_skills_remark || '-'}</td>
                    </tr>
                    <tr>
                      <td>System Check</td>
                      <td>{selectedAudit.system_check || '-'}</td>
                      <td>{selectedAudit.system_check_remark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Explanation/Adherence to Process SOP</td>
                      <td>{selectedAudit.explanation_sop || '-'}</td>
                      <td>{selectedAudit.explanation_sop_remark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Rebuttal Handling</td>
                      <td>{selectedAudit.rebuttal_handling || '-'}</td>
                      <td>{selectedAudit.rebuttal_handling_remark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Upselling Skills</td>
                      <td>{selectedAudit.upselling_skills || '-'}</td>
                      <td>{selectedAudit.upselling_skills_remark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Add-On Pitch</td>
                      <td>{selectedAudit.add_on_pitch || '-'}</td>
                      <td>{selectedAudit.add_on_pitch_remark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Right Information</td>
                      <td>{selectedAudit.right_information || '-'}</td>
                      <td>{selectedAudit.right_information_remark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Documentation/ System/ CRM Entries</td>
                      <td>{selectedAudit.documentation_crm || '-'}</td>
                      <td>{selectedAudit.documentation_crm_remark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Documentation/ Order Related</td>
                      <td>{selectedAudit.documentation_order || '-'}</td>
                      <td>{selectedAudit.documentation_order_remark || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Scores Summary */}
              <div className="section">
                <h3>Scores Summary</h3>
                <div className="scores-summary">
                  <div className="score-item">
                    <span className="score-label">Fatal Status</span>
                    <StatusBadge status={selectedAudit.fatal_status || 'No'} type="fatal" />
                  </div>
                  <div className="score-item">
                    <span className="score-label">Fatal Count</span>
                    <span className="score-value">{selectedAudit.fatal_count || 0}</span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">Scorable</span>
                    <span className="score-value">{selectedAudit.scorable || 100}</span>
                  </div>
                  <div className="score-item">
                    <span className="score-label">Scored</span>
                    <span className="score-value">{selectedAudit.scored || 0}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => handleExportPDF(selectedAudit)} className="export-pdf-button">
                Export as PDF
              </button>
              <button onClick={() => setShowModal(false)} className="close-modal-button">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
