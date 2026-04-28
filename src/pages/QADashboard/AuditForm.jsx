import React, { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ParametersForm, { FIELDS } from '../../components/ParametersForm/ParametersForm';
import OtherInputsForm from '../../components/OtherInputsForm/OtherInputsForm';
import ScoresSection from '../../components/ScoresSection/ScoresSection';
import UpdateModal from '../../components/UpdateModal/UpdateModal';
import { auditService } from '../../services/auditService';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import './AuditForm.css';

const INITIAL_PARAMS = {
  callOpening: '',
  listeningSkills: '',
  empathyCourtesy: '',
  toneVoiceModulation: '',
  telephoneEtiquettes: '',
  languageSkill: '',
  callClosure: '',
  probingSkills: '',
  systemCheck: '',
  explanationSop: '',
  rebuttalHandling: '',
  upsellingSkills: '',
  addOnPitch: '',
  rightInformation: '',
  documentationCrm: '',
  documentationOrder: ''
};

const INITIAL_OTHERS = {
  agent_id: '',
  team_leader: '',
  call_id: '',
  calling_number: '',
  call_date: '',
  call_time: '',
  call_duration: '',
  call_category: '',
  call_type: '',
  lob: '',
  order_non_order: '',
  data_type: '',
  type_of_audit: '',
  primary_call_tag_agent: '',
  primary_call_tag_actual: '',
  secondary_call_tag_agent: '',
  secondary_call_tag_actual: '',
  call_opening_language: '',
  customer_language: '',
  call_language: '',
  acpt: '',
  fatal_reason: '',
  acpt_reasons: '',
  process_voc: '',
  product_voc: '',
  tech_voc: '',
  tni: '',
  areas_of_improvement: '',
  call_brief: '',
  fully_paid_delivery_orders: ''
};

const INITIAL_SCORES = {
  fatalStatus: 'No',
  fatalCount: 0,
  scorable: 100,
  scored: 0,
  nonFatalScore: 0
};

// Parameter score mapping - each parameter's score when YES is selected
const PARAMETER_SCORES = {
  callOpening: 5,
  listeningSkills: 8,
  empathyCourtesy: 5,
  toneVoiceModulation: 6,
  telephoneEtiquettes: 6,
  languageSkill: 5,
  callClosure: 5,
  probingSkills: 6,
  systemCheck: 6,
  explanationSop: 8,
  rebuttalHandling: 8,
  upsellingSkills: 8,
  addOnPitch: 2,
  rightInformation: 6,
  documentationCrm: 6,
  documentationOrder: 10
};

const FIELD_LABELS = {
  callOpening: 'Call Opening',
  listeningSkills: 'Listening Skills & Understanding',
  empathyCourtesy: 'Empathy & Courtesy',
  toneVoiceModulation: 'Tone & Voice Modulation',
  telephoneEtiquettes: 'Telephone etiquettes',
  languageSkill: 'Language Skill',
  callClosure: 'Call Closure',
  probingSkills: 'Probing Skills',
  systemCheck: 'System check',
  explanationSop: 'Explanation/Adherence to Process SOP',
  rebuttalHandling: 'Rebuttal Handling',
  upsellingSkills: 'Upselling skills',
  addOnPitch: 'Add-On Pitch',
  rightInformation: 'Right Information',
  documentationCrm: 'Documentation/ System/ CRM Entries',
  documentationOrder: 'Documentation/ Order Related',
  agent_id: 'Agent ID',
  team_leader: 'Team Leader',
  call_id: 'Call ID',
  calling_number: 'Calling Number',
  call_date: 'Call Date',
  call_time: 'Call Time',
  call_duration: 'Call Duration',
  call_category: 'Call Category',
  call_type: 'Call Type',
  lob: 'LOB',
  order_non_order: 'Order/Non-Order',
  data_type: 'Data Type',
  type_of_audit: 'Type Of Audit',
  primary_call_tag_agent: 'Primary Call Tag (Agent)',
  primary_call_tag_actual: 'Primary Call Tag (Actual)',
  secondary_call_tag_agent: 'Secondary Call Tag (Agent)',
  secondary_call_tag_actual: 'Secondary Call Tag (Actual)',
  call_opening_language: 'Call Opening Language',
  customer_language: 'Customer Language',
  call_language: 'Call Language',
  acpt: 'ACPT',
  fatal_reason: 'Fatal Reason',
  acpt_reasons: 'ACPT Reasons',
  process_voc: 'Process VOC',
  product_voc: 'Product VOC',
  tech_voc: 'Tech VOC',
  tni: 'TNI',
  areas_of_improvement: 'Areas Of Improvement',
  call_brief: 'Call Brief',
  fully_paid_delivery_orders: 'Fully Paid Delivery Orders',
  scorable: 'Scorable',
  scored: 'Scored',
  fatalStatus: 'Fatal Status',
  fatalCount: 'Fatal Count',
  nonFatalScore: 'Non Fatal Score'
};

export default function AuditForm() {
  const user = authService.getCurrentUser();
  const location = useLocation();
  const [params, setParams] = useState(INITIAL_PARAMS);
  const [others, setOthers] = useState(INITIAL_OTHERS);
  const [scores, setScores] = useState(INITIAL_SCORES);
  const [showModal, setShowModal] = useState(false);
  const [savedState, setSavedState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editAuditId, setEditAuditId] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(false);

  const updateParam = useCallback((id, val) =>
    setParams(prev => ({ ...prev, [id]: val })), []);

  const updateOther = useCallback((id, val) =>
    setOthers(prev => ({ ...prev, [id]: val })), []);

  const updateScore = useCallback((id, val) =>
    setScores(prev => ({ ...prev, [id]: val })), []);

  // Calculate scores based on parameter selections
  const calculateScores = useCallback(() => {
    const allParams = { ...params };
    
    console.log('Calculating scores with params:', allParams);
    
    // Calculate fatal status and count - only for fatal parameters with fatal- prefix
    let fatalCount = 0;
    let fatalStatus = 'No';
    let hasFatal = false;
    
    Object.entries(allParams).forEach(([key, value]) => {
      console.log(`Checking ${key}: ${value}`);
      if (value && value.startsWith('fatal-')) {
        console.log(`FATAL DETECTED: ${key} = ${value}`);
        fatalCount++;
        fatalStatus = 'Yes';
        hasFatal = true;
      }
    });
    
    console.log(`Fatal count: ${fatalCount}, Fatal status: ${fatalStatus}, Has fatal: ${hasFatal}`);
    
    // Calculate scored - if any fatal selected, score is 0 (locked)
    let scored = 0;
    
    if (hasFatal) {
      scored = 0; // Lock at 0 if any fatal is selected
      console.log('Score locked to 0 due to fatal selection');
    } else {
      // Calculate score based on parameter selections using actual parameter scores
      Object.entries(allParams).forEach(([key, value]) => {
        if (value && value.startsWith('YES') && PARAMETER_SCORES[key]) {
          scored += PARAMETER_SCORES[key];
          console.log(`Adding score for ${key}: ${PARAMETER_SCORES[key]}`);
        }
      });
      console.log(`Calculated score: ${scored}`);
    }
    
    // Calculate non_fatal_score - same calculation as scored but does NOT reset on fatal
    let nonFatalScore = 0;
    Object.entries(allParams).forEach(([key, value]) => {
      if (value && value.startsWith('YES') && PARAMETER_SCORES[key]) {
        nonFatalScore += PARAMETER_SCORES[key];
        console.log(`Adding non-fatal score for ${key}: ${PARAMETER_SCORES[key]}`);
      }
    });
    console.log(`Non-fatal score: ${nonFatalScore} (same calculation, no reset on fatal)`);

    const newScores = {
      fatalStatus,
      fatalCount,
      scorable: 100,
      scored,
      nonFatalScore
    };

    console.log('Final scores:', newScores);

    setScores(newScores);

    // Auto-fill call_type based on fatal status
    setOthers(prev => ({
      ...prev,
      call_type: hasFatal ? 'Fatal' : 'Non Fatal'
    }));
  }, [params]);

  // Recalculate scores when params change
  useEffect(() => {
    calculateScores();
  }, [calculateScores]);

  // Load audit data if in edit mode
  useEffect(() => {
    if (location.state?.auditId) {
      setEditMode(true);
      setEditAuditId(location.state.auditId);
      loadAuditData(location.state.auditId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  const loadAuditData = async (auditId) => {
    try {
      setFetchLoading(true);
      const audit = await auditService.getAuditById(auditId);
      console.log('Loaded audit data:', audit);
      
      // Populate form with existing audit data (backend returns camelCase)
      setParams({
        callOpening: audit.callOpening || '',
        callOpeningRemark: audit.callOpeningRemark || '',
        listeningSkills: audit.listeningSkills || '',
        listeningSkillsRemark: audit.listeningSkillsRemark || '',
        empathyCourtesy: audit.empathyCourtesy || '',
        empathyCourtesyRemark: audit.empathyCourtesyRemark || '',
        toneVoiceModulation: audit.toneVoiceModulation || '',
        toneVoiceModulationRemark: audit.toneVoiceModulationRemark || '',
        telephoneEtiquettes: audit.telephoneEtiquettes || '',
        telephoneEtiquettesRemark: audit.telephoneEtiquettesRemark || '',
        languageSkill: audit.languageSkill || '',
        languageSkillRemark: audit.languageSkillRemark || '',
        callClosure: audit.callClosure || '',
        callClosureRemark: audit.callClosureRemark || '',
        probingSkills: audit.probingSkills || '',
        probingSkillsRemark: audit.probingSkillsRemark || '',
        systemCheck: audit.systemCheck || '',
        systemCheckRemark: audit.systemCheckRemark || '',
        explanationSop: audit.explanationSop || '',
        explanationSopRemark: audit.explanationSopRemark || '',
        rebuttalHandling: audit.rebuttalHandling || '',
        rebuttalHandlingRemark: audit.rebuttalHandlingRemark || '',
        upsellingSkills: audit.upsellingSkills || '',
        upsellingSkillsRemark: audit.upsellingSkillsRemark || '',
        addOnPitch: audit.addOnPitch || '',
        addOnPitchRemark: audit.addOnPitchRemark || '',
        rightInformation: audit.rightInformation || '',
        rightInformationRemark: audit.rightInformationRemark || '',
        documentationCrm: audit.documentationCrm || '',
        documentationCrmRemark: audit.documentationCrmRemark || '',
        documentationOrder: audit.documentationOrder || '',
        documentationOrderRemark: audit.documentationOrderRemark || ''
      });

      setOthers({
        agent_id: audit.agent?.agentId || audit.agentId || '',
        team_leader: audit.teamLeader || '',
        call_id: audit.callId || '',
        calling_number: audit.callingNumber || '',
        call_date: audit.callDate || '',
        call_time: audit.callTime || '',
        call_duration: audit.callDuration || '',
        call_category: audit.callCategory || '',
        call_type: audit.callType || '',
        lob: audit.lob || '',
        order_non_order: audit.orderNonOrder || '',
        data_type: audit.dataType || '',
        type_of_audit: audit.typeOfAudit || '',
        primary_call_tag_agent: audit.primaryCallTagAgent || '',
        primary_call_tag_actual: audit.primaryCallTagActual || '',
        secondary_call_tag_agent: audit.secondaryCallTagAgent || '',
        secondary_call_tag_actual: audit.secondaryCallTagActual || '',
        call_opening_language: audit.callOpeningLanguage || '',
        customer_language: audit.customerLanguage || '',
        call_language: audit.callLanguage || '',
        acpt: audit.acpt || '',
        fatal_reason: audit.fatalReason || '',
        acpt_reasons: audit.acptReasons || '',
        process_voc: audit.processVoc || '',
        product_voc: audit.productVoc || '',
        tech_voc: audit.techVoc || '',
        tni: audit.tni || '',
        areas_of_improvement: audit.areasOfImprovement || '',
        call_brief: audit.callBrief || '',
        fully_paid_delivery_orders: audit.fullyPaidDeliveryOrders || ''
      });

      setScores({
        fatalStatus: audit.fatalStatus || 'No',
        fatalCount: audit.fatalCount || 0,
        scorable: audit.scorable || 100,
        scored: audit.scored || 0,
        nonFatalScore: audit.nonFatalScore || 0
      });

      setSavedState({
        ...params,
        ...others,
        ...scores
      });
    } catch (error) {
      console.error('Error loading audit data:', error);
      toast.error('Failed to load audit data');
    } finally {
      setFetchLoading(false);
    }
  };

  const buildChanges = () => {
    const base = savedState || {
      ...INITIAL_PARAMS, ...INITIAL_OTHERS, ...INITIAL_SCORES
    };
    const current = { ...params, ...others, ...scores };
    return Object.entries(current)
      .filter(([k, v]) => String(base[k] ?? '') !== String(v))
      .map(([k, v]) => ({
        field: FIELD_LABELS[k] || k,
        oldValue: String(base[k] ?? ''),
        newValue: String(v),
      }));
  };

  const handleSaveClick = () => {
    const changes = buildChanges();
    if (!changes.length) {
      toast.info('No changes to save.');
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = async ({ remarks }) => {
    try {
      setLoading(true);

      console.log('Scores state before submission:', scores);

      // Prepare audit data
      const auditData = {
        agent_id: others.agent_id,
        qa_id: user.id,
        call_id: others.call_id,
        team_leader: others.team_leader,
        calling_number: others.calling_number,
        call_date: others.call_date,
        call_time: others.call_time,
        call_duration: others.call_duration,
        call_category: others.call_category,
        call_type: others.call_type,
        lob: others.lob,
        order_non_order: others.order_non_order,
        data_type: others.data_type,
        type_of_audit: others.type_of_audit,
        primary_call_tag_agent: others.primary_call_tag_agent,
        primary_call_tag_actual: others.primary_call_tag_actual,
        secondary_call_tag_agent: others.secondary_call_tag_agent,
        secondary_call_tag_actual: others.secondary_call_tag_actual,
        call_opening_language: others.call_opening_language,
        customer_language: others.customer_language,
        call_language: others.call_language,
        acpt: others.acpt,
        fatal_reason: others.fatal_reason,
        acpt_reasons: others.acpt_reasons,
        process_voc: others.process_voc,
        product_voc: others.product_voc,
        tech_voc: others.tech_voc,
        tni: others.tni,
        areas_of_improvement: others.areas_of_improvement,
        call_brief: others.call_brief,
        fully_paid_delivery_orders: others.fully_paid_delivery_orders,
        call_opening: params.callOpening,
        call_opening_remark: params.callOpeningRemark || '',
        listening_skills: params.listeningSkills,
        listening_skills_remark: params.listeningSkillsRemark || '',
        empathy_courtesy: params.empathyCourtesy,
        empathy_courtesy_remark: params.empathyCourtesyRemark || '',
        tone_voice_modulation: params.toneVoiceModulation,
        tone_voice_modulation_remark: params.toneVoiceModulationRemark || '',
        telephone_etiquettes: params.telephoneEtiquettes,
        telephone_etiquettes_remark: params.telephoneEtiquettesRemark || '',
        language_skill: params.languageSkill,
        language_skill_remark: params.languageSkillRemark || '',
        call_closure: params.callClosure,
        call_closure_remark: params.callClosureRemark || '',
        probing_skills: params.probingSkills,
        probing_skills_remark: params.probingSkillsRemark || '',
        system_check: params.systemCheck,
        system_check_remark: params.systemCheckRemark || '',
        explanation_sop: params.explanationSop,
        explanation_sop_remark: params.explanationSopRemark || '',
        rebuttal_handling: params.rebuttalHandling,
        rebuttal_handling_remark: params.rebuttalHandlingRemark || '',
        upselling_skills: params.upsellingSkills,
        upselling_skills_remark: params.upsellingSkillsRemark || '',
        add_on_pitch: params.addOnPitch,
        add_on_pitch_remark: params.addOnPitchRemark || '',
        right_information: params.rightInformation,
        right_information_remark: params.rightInformationRemark || '',
        documentation_crm: params.documentationCrm,
        documentation_crm_remark: params.documentationCrmRemark || '',
        documentation_order: params.documentationOrder,
        documentation_order_remark: params.documentationOrderRemark || '',
        fatal_status: scores.fatalStatus,
        fatal_count: scores.fatalCount,
        scored: scores.scored,
        scorable: scores.scorable,
        non_fatal_score: scores.nonFatalScore,
        status: 'IN_PROGRESS'
      };

      if (editMode && editAuditId) {
        // Update existing audit
        await auditService.updateAudit(editAuditId, auditData);
        toast.success('Audit updated successfully!');
      } else {
        // Create new audit
        await auditService.createAudit(auditData);
        toast.success('Audit saved successfully!');
      }
      
      setSavedState({ ...params, ...others, ...scores });
      setShowModal(false);
      
      // Reset form and exit edit mode
      setParams(INITIAL_PARAMS);
      setOthers(INITIAL_OTHERS);
      setScores(INITIAL_SCORES);
      setSavedState(null);
      setEditMode(false);
      setEditAuditId(null);
    } catch (error) {
      console.error('Audit submission error:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      let errorMessage = editMode ? 'Failed to update audit' : 'Failed to save audit';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="audit-form-page">
      <div className="page-header">
        <h1>{editMode ? 'Edit Call Audit' : 'New Call Audit'}</h1>
        <p className="page-subtitle">{editMode ? 'Edit existing audit for agent call performance' : 'Create a new audit for agent call performance'}</p>
      </div>

      <div className="audit-layout">
        {fetchLoading ? (
          <div className="loading-state">Loading audit data...</div>
        ) : (
          <>
            <div className="audit-col-main">
              <div style={{ marginTop: 16 }}>
                <ParametersForm values={params} onChange={updateParam} />
              </div>
              <div style={{ marginTop: 16 }}>
                <OtherInputsForm values={others} onChange={updateOther} />
              </div>
            </div>

            <div className="audit-col-side">
              <ScoresSection values={scores} onChange={updateScore} />

              <div className="card quick-summary" style={{ marginTop: 16 }}>
                <div className="card-header">
                  <h3>Audit Summary</h3>
                </div>
                <div className="card-body">
                  <div className="summary-rows">
                    <div className="summary-row">
                      <span className="summary-key">Status</span>
                      <span className={`summary-val status-chip ${
                        scores.fatalStatus === 'Yes' ? 'status-fatal' : 'status-ok'
                      }`}>
                        {scores.fatalStatus === 'Yes' ? '⚠ Fatal' : '✓ Non-Fatal'}
                      </span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-key">Agent ID</span>
                      <span className="summary-val">{others.agent_id || '—'}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-key">Call ID</span>
                      <span className="summary-val">{others.call_id || '—'}</span>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary btn-md"
                    style={{ width: '100%', marginTop: 16 }}
                    onClick={handleSaveClick}
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Audit'}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <UpdateModal
          changes={buildChanges()}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
          loading={loading}
        />
      )}
    </div>
  );
}
