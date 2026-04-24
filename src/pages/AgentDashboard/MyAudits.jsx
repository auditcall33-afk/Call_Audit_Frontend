import React, { useState, useEffect } from 'react';
import { auditService } from '../../services/auditService';
import { authService } from '../../services/authService';
import FilterBar from '../../components/common/FilterBar';
import StatusBadge from '../../components/common/StatusBadge';
import { generateAuditPDF } from '../../utils/pdfGenerator';
import { generateAuditsExcel } from '../../utils/excelGenerator';
import { toast } from 'react-toastify';
import './MyAudits.css';

export default function MyAudits() {
  const user = authService.getCurrentUser();
  const [audits, setAudits] = useState([]);
  const [filteredAudits, setFilteredAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [acknowledgmentStatus, setAcknowledgmentStatus] = useState('');
  const [acknowledgmentComment, setAcknowledgmentComment] = useState('');
  const [submittingAcknowledgment, setSubmittingAcknowledgment] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    dateFrom: null,
    dateTo: null,
    fatalStatus: 'all'
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
      const data = await auditService.getAuditsByAgentId(user.id);
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
        audit.call_id?.toLowerCase().includes(filters.search.toLowerCase())
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

    setFilteredAudits(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleViewDetails = (audit) => {
    setSelectedAudit(audit);
    setAcknowledgmentStatus('');
    setAcknowledgmentComment('');
    setShowModal(true);
  };

  const handleSubmitAcknowledgment = async () => {
    if (!acknowledgmentStatus) {
      toast.error('Please select acknowledgment status');
      return;
    }

    if (acknowledgmentStatus === 'NOT_SATISFIED' && !acknowledgmentComment.trim()) {
      toast.error('Comment is required when you are not satisfied');
      return;
    }

    try {
      setSubmittingAcknowledgment(true);
      await auditService.acknowledgeAudit(selectedAudit.id || selectedAudit.auditId, {
        acknowledgmentStatus,
        acknowledgmentComment
      });
      toast.success('Acknowledgment submitted successfully');
      setShowModal(false);
      fetchAudits(); // Refresh the audits list
    } catch (error) {
      console.error('Acknowledgment submission error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit acknowledgment');
    } finally {
      setSubmittingAcknowledgment(false);
    }
  };

  const handleExportPDF = (audit) => {
    generateAuditPDF(audit, audit.agent || { first_name: user.first_name, last_name: user.last_name, agent_id: user.agent_id }, audit.qa);
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
    <div className="my-audits">
      <div className="page-header">
        <h1>My Audits</h1>
        <p className="page-subtitle">View all your call audits</p>
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
          <p>Your calls will appear here once audited by QA.</p>
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
                  <th>Audit Date</th>
                  <th>QA Name</th>
                  <th>Scored</th>
                  <th>Fatal Status</th>
                  <th>Audit Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map(audit => (
                  <tr key={audit.id || audit.auditId}>
                    <td>{audit.call_id || audit.callId}</td>
                    <td>{new Date(audit.created_at || audit.createdAt || audit.audit_date || audit.auditDate).toLocaleDateString()}</td>
                    <td>
                      {audit.qa ? `${audit.qa.first_name || audit.qa.firstName} ${audit.qa.last_name || audit.qa.lastName}` : audit.qa_name || audit.qaName || '-'}
                    </td>
                    <td>{audit.scored || audit.scored || 0}/100</td>
                    <td>
                      <StatusBadge status={audit.fatal_status || audit.fatalStatus || 'No'} type="fatal" />
                    </td>
                    <td>
                      <StatusBadge status={audit.status || audit.auditStatus || 'COMPLETED'} type="audit" />
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleViewDetails(audit)}
                          className="action-button view-button"
                        >
                          View
                        </button>
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
                    <span className="info-value">{selectedAudit.call_id || selectedAudit.callId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Audit Date</span>
                    <span className="info-value">{new Date(selectedAudit.created_at || selectedAudit.createdAt || selectedAudit.audit_date || selectedAudit.auditDate).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">QA Name</span>
                    <span className="info-value">
                      {selectedAudit.qa ? `${selectedAudit.qa.first_name || selectedAudit.qa.firstName} ${selectedAudit.qa.last_name || selectedAudit.qa.lastName}` : selectedAudit.qa_name || selectedAudit.qaName || '-'}
                    </span>
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
                      <td>{selectedAudit.call_opening || selectedAudit.callOpening || '-'}</td>
                      <td>{selectedAudit.call_opening_remark || selectedAudit.callOpeningRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Listening Skills</td>
                      <td>{selectedAudit.listening_skills || selectedAudit.listeningSkills || '-'}</td>
                      <td>{selectedAudit.listening_skills_remark || selectedAudit.listeningSkillsRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Empathy & Courtesy</td>
                      <td>{selectedAudit.empathy_courtesy || selectedAudit.empathyCourtesy || '-'}</td>
                      <td>{selectedAudit.empathy_courtesy_remark || selectedAudit.empathyCourtesyRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Tone & Voice Modulation</td>
                      <td>{selectedAudit.tone_voice_modulation || selectedAudit.toneVoiceModulation || '-'}</td>
                      <td>{selectedAudit.tone_voice_modulation_remark || selectedAudit.toneVoiceModulationRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Telephone Etiquettes</td>
                      <td>{selectedAudit.telephone_etiquettes || selectedAudit.telephoneEtiquettes || '-'}</td>
                      <td>{selectedAudit.telephone_etiquettes_remark || selectedAudit.telephoneEtiquettesRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Language Skill</td>
                      <td>{selectedAudit.language_skill || selectedAudit.languageSkill || '-'}</td>
                      <td>{selectedAudit.language_skill_remark || selectedAudit.languageSkillRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Call Closure</td>
                      <td>{selectedAudit.call_closure || selectedAudit.callClosure || '-'}</td>
                      <td>{selectedAudit.call_closure_remark || selectedAudit.callClosureRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Probing Skills</td>
                      <td>{selectedAudit.probing_skills || selectedAudit.probingSkills || '-'}</td>
                      <td>{selectedAudit.probing_skills_remark || selectedAudit.probingSkillsRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>System Check</td>
                      <td>{selectedAudit.system_check || selectedAudit.systemCheck || '-'}</td>
                      <td>{selectedAudit.system_check_remark || selectedAudit.systemCheckRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Explanation/Adherence to Process SOP</td>
                      <td>{selectedAudit.explanation_sop || selectedAudit.explanationSop || '-'}</td>
                      <td>{selectedAudit.explanation_sop_remark || selectedAudit.explanationSopRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Rebuttal Handling</td>
                      <td>{selectedAudit.rebuttal_handling || selectedAudit.rebuttalHandling || '-'}</td>
                      <td>{selectedAudit.rebuttal_handling_remark || selectedAudit.rebuttalHandlingRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Upselling Skills</td>
                      <td>{selectedAudit.upselling_skills || selectedAudit.upsellingSkills || '-'}</td>
                      <td>{selectedAudit.upselling_skills_remark || selectedAudit.upsellingSkillsRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Add-On Pitch</td>
                      <td>{selectedAudit.add_on_pitch || selectedAudit.addOnPitch || '-'}</td>
                      <td>{selectedAudit.add_on_pitch_remark || selectedAudit.addOnPitchRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Right Information</td>
                      <td>{selectedAudit.right_information || selectedAudit.rightInformation || '-'}</td>
                      <td>{selectedAudit.right_information_remark || selectedAudit.rightInformationRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Documentation/ System/ CRM Entries</td>
                      <td>{selectedAudit.documentation_crm || selectedAudit.documentationCrm || '-'}</td>
                      <td>{selectedAudit.documentation_crm_remark || selectedAudit.documentationCrmRemark || '-'}</td>
                    </tr>
                    <tr>
                      <td>Documentation/ Order Related</td>
                      <td>{selectedAudit.documentation_order || selectedAudit.documentationOrder || '-'}</td>
                      <td>{selectedAudit.documentation_order_remark || selectedAudit.documentationOrderRemark || '-'}</td>
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

              {/* Acknowledgment Section */}
              {(!selectedAudit.acknowledgement || selectedAudit.acknowledgement === 'PENDING') && (
                <div className="section">
                  <h3>Acknowledge Audit</h3>
                  <div className="acknowledgment-form">
                    <div className="form-group">
                      <label htmlFor="acknowledgmentStatus">Acknowledgment Status *</label>
                      <select
                        id="acknowledgmentStatus"
                        value={acknowledgmentStatus}
                        onChange={(e) => {
                          setAcknowledgmentStatus(e.target.value);
                          if (e.target.value === 'SATISFIED') {
                            setAcknowledgmentComment('');
                          }
                        }}
                        className="form-select"
                        required
                      >
                        <option value="">Select acknowledgment status</option>
                        <option value="SATISFIED">Satisfied</option>
                        <option value="NOT_SATISFIED">Not Satisfied</option>
                      </select>
                    </div>

                    {acknowledgmentStatus === 'NOT_SATISFIED' && (
                      <div className="form-group">
                        <label htmlFor="acknowledgmentComment">Comment *</label>
                        <textarea
                          id="acknowledgmentComment"
                          value={acknowledgmentComment}
                          onChange={(e) => setAcknowledgmentComment(e.target.value)}
                          className="form-textarea"
                          placeholder="Please provide details about why you are not satisfied..."
                          required
                          rows={4}
                        />
                      </div>
                    )}

                    <button
                      onClick={handleSubmitAcknowledgment}
                      disabled={submittingAcknowledgment || !acknowledgmentStatus}
                      className="btn btn-primary"
                    >
                      {submittingAcknowledgment ? 'Submitting...' : 'Submit Acknowledgment'}
                    </button>
                  </div>
                </div>
              )}

              {/* Show acknowledgment status if already acknowledged */}
              {selectedAudit.acknowledgement && selectedAudit.acknowledgement !== 'PENDING' && (
                <div className="section">
                  <h3>Acknowledgment Status</h3>
                  <div className="acknowledgment-status">
                    <div className="status-item">
                      <span className="status-label">Status:</span>
                      <span className={`status-value ${selectedAudit.acknowledgement === 'SATISFIED' ? 'satisfied' : 'not-satisfied'}`}>
                        {selectedAudit.acknowledgement === 'SATISFIED' ? 'Satisfied' : 'Not Satisfied'}
                      </span>
                    </div>
                    {selectedAudit.acknowledgeRemark && (
                      <div className="status-item">
                        <span className="status-label">Comment:</span>
                        <span className="status-value">{selectedAudit.acknowledgeRemark}</span>
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
