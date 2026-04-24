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
  const [expandedCommentId, setExpandedCommentId] = useState(null);

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
      console.log('Current user:', user);
      console.log('User ID:', user.id);
      console.log('User userId:', user.userId);
      console.log('User qaId:', user.qaId);
      // Try userId first, then id, then qaId
      const userIdToUse = user.userId || user.id || user.qaId;
      console.log('Using ID:', userIdToUse);
      const data = await auditService.getAuditsByQaId(userIdToUse);
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

  const toggleCommentDropdown = (auditId) => {
    setExpandedCommentId(expandedCommentId === auditId ? null : auditId);
  };

  const handleViewDetails = (audit) => {
    setSelectedAudit(audit);
    setShowModal(true);
  };

  const handleEdit = (audit) => {
    navigate('/qa', { state: { auditId: audit.id || audit.auditId } });
  };

  const handleRejectAcknowledgment = async (audit) => {
    if (!window.confirm('Are you sure you want to reject this acknowledgment?')) {
      return;
    }

    try {
      await auditService.rejectAcknowledgment(audit.id || audit.auditId);
      toast.success('Acknowledgment rejected successfully');
      fetchAudits(); // Refresh the audits list
    } catch (error) {
      console.error('Reject acknowledgment error:', error);
      toast.error(error.response?.data?.message || 'Failed to reject acknowledgment');
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
                  <th>Actions</th>
                  <th>Acknowledge</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(audit => (
                  <tr key={audit.id || audit.auditId}>
                    <td>{audit.call_id || audit.callId}</td>
                    <td>
                      {audit.agent ? `${audit.agent.first_name || audit.agent.firstName} ${audit.agent.last_name || audit.agent.lastName}` : audit.agent_name || audit.agentName || '-'}
                    </td>
                    <td>
                      <StatusBadge status={audit.status || audit.auditStatus || 'COMPLETED'} type="audit" />
                    </td>
                    <td>{audit.scored || audit.scored || 0}/100</td>
                    <td>
                      <StatusBadge status={audit.fatal_status || audit.fatalStatus || 'No'} type="fatal" />
                    </td>
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
                    <td>
                      {audit.acknowledgement ? (
                        audit.acknowledgement === 'SATISFIED' ? (
                          <span className="acknowledgment-badge satisfied">Satisfied</span>
                        ) : audit.acknowledgement === 'NOT_SATISFIED' ? (
                          audit.status === 'COMPLETED' || audit.auditStatus === 'COMPLETED' ? (
                            <span className="acknowledgment-badge resolved">Resolved</span>
                          ) : (
                            <div className="acknowledgment-with-dropdown">
                              <span className="acknowledgment-badge not_satisfied">Not Satisfied</span>
                              <button
                                onClick={() => toggleCommentDropdown(audit.id || audit.auditId)}
                                className="comment-toggle-button"
                              >
                                View Comment
                              </button>
                              {expandedCommentId === (audit.id || audit.auditId) && (
                                <div className="comment-dropdown">
                                  {audit.acknowledgeRemark || 'No comment provided'}
                              </div>
                            )}
                          </div>
                        )
                      ) : (
                        <span className="acknowledgment-badge pending">Pending</span>
                      )
                      ) : (
                        <span className="acknowledgment-badge pending">Pending</span>
                      )}
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
                    <span className="info-value">{selectedAudit.call_id || selectedAudit.callId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Agent Name</span>
                    <span className="info-value">
                      {selectedAudit.agent ? `${selectedAudit.agent.first_name || selectedAudit.agent.firstName} ${selectedAudit.agent.last_name || selectedAudit.agent.lastName}` : selectedAudit.agent_name || selectedAudit.agentName || '-'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Status</span>
                    <StatusBadge status={selectedAudit.status || selectedAudit.auditStatus || 'COMPLETED'} type="audit" />
                  </div>
                  <div className="info-item">
                    <span className="info-label">Created Date</span>
                    <span className="info-value">{new Date(selectedAudit.created_at || selectedAudit.createdAt || selectedAudit.audit_date || selectedAudit.auditDate).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Last Updated</span>
                    <span className="info-value">{selectedAudit.updated_at || selectedAudit.updatedAt ? new Date(selectedAudit.updated_at || selectedAudit.updatedAt).toLocaleDateString() : '-'}</span>
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
                      <td>{selectedAudit.callOpening || '-'}</td>
                      <td>{selectedAudit.callOpeningRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Listening Skills</td>
                      <td>{selectedAudit.listeningSkills || '-'}</td>
                      <td>{selectedAudit.listeningSkillsRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Empathy & Courtesy</td>
                      <td>{selectedAudit.empathyCourtesy || '-'}</td>
                      <td>{selectedAudit.empathyCourtesyRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Tone & Voice Modulation</td>
                      <td>{selectedAudit.toneVoiceModulation || '-'}</td>
                      <td>{selectedAudit.toneVoiceModulationRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Telephone Etiquettes</td>
                      <td>{selectedAudit.telephoneEtiquettes || '-'}</td>
                      <td>{selectedAudit.telephoneEtiquettesRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Language Skill</td>
                      <td>{selectedAudit.languageSkill || '-'}</td>
                      <td>{selectedAudit.languageSkillRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Call Closure</td>
                      <td>{selectedAudit.callClosure || '-'}</td>
                      <td>{selectedAudit.callClosureRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Probing Skills</td>
                      <td>{selectedAudit.probingSkills || '-'}</td>
                      <td>{selectedAudit.probingSkillsRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>System Check</td>
                      <td>{selectedAudit.systemCheck || '-'}</td>
                      <td>{selectedAudit.systemCheckRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Explanation/Adherence to Process SOP</td>
                      <td>{selectedAudit.explanationSop || '-'}</td>
                      <td>{selectedAudit.explanationSopRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Rebuttal Handling</td>
                      <td>{selectedAudit.rebuttalHandling || '-'}</td>
                      <td>{selectedAudit.rebuttalHandlingRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Upselling Skills</td>
                      <td>{selectedAudit.upsellingSkills || '-'}</td>
                      <td>{selectedAudit.upsellingSkillsRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Add-On Pitch</td>
                      <td>{selectedAudit.addOnPitch || '-'}</td>
                      <td>{selectedAudit.addOnPitchRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Right Information</td>
                      <td>{selectedAudit.rightInformation || '-'}</td>
                      <td>{selectedAudit.rightInformationRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Documentation/ System/ CRM Entries</td>
                      <td>{selectedAudit.documentationCrm || '-'}</td>
                      <td>{selectedAudit.documentationCrmRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Documentation/ Order Related</td>
                      <td>{selectedAudit.documentationOrder || '-'}</td>
                      <td>{selectedAudit.documentationOrderRemark || '-'}</td>
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
                    <StatusBadge status={selectedAudit.fatal_status || selectedAudit.fatalStatus || 'No'} type="fatal" />
                  </div>
                  <div className="score-item">
                    <span className="score-label">Fatal Count</span>
                    <span className="score-value">{selectedAudit.fatal_count || selectedAudit.fatalCount || 0}</span>
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

              {/* Agent Acknowledgment Section */}
              {selectedAudit.acknowledgement && selectedAudit.acknowledgement !== 'PENDING' && (
                <div className="section">
                  <h3>Agent Acknowledgment</h3>
                  <div className="acknowledgment-status">
                    <div className="status-item">
                      <span className="status-label">Status:</span>
                      <span className={`status-value ${selectedAudit.acknowledgement === 'SATISFIED' ? 'satisfied' : 'not-satisfied'}`}>
                        {selectedAudit.acknowledgement === 'SATISFIED' ? 'Satisfied' : 'Not Satisfied'}
                      </span>
                    </div>
                    {selectedAudit.acknowledgeRemark && (
                      <div className="status-item">
                        <span className="status-label">Agent Comment:</span>
                        <span className="status-value comment">{selectedAudit.acknowledgeRemark}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={() => handleExportPDF(selectedAudit)} className="export-pdf-button">
                Export as PDF
              </button>
              {selectedAudit.acknowledgement === 'NOT_SATISFIED' &&
               (selectedAudit.status !== 'COMPLETED' && selectedAudit.auditStatus !== 'COMPLETED') && (
                <>
                  <button onClick={() => handleEdit(selectedAudit)} className="edit-modal-button">
                    Edit
                  </button>
                  <button onClick={() => handleRejectAcknowledgment(selectedAudit)} className="reject-modal-button">
                    Reject
                  </button>
                </>
              )}
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
