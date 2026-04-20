import React, { useState, useCallback } from 'react';
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
  qa_id: '',
  call_id: ''
};

const INITIAL_SCORES = {
  scorable: 100,
  scored: 0
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
  qa_id: 'QA ID',
  call_id: 'Call ID',
  scorable: 'Scorable',
  scored: 'Scored'
};

export default function AuditForm() {
  const user = authService.getCurrentUser();
  const [params, setParams] = useState(INITIAL_PARAMS);
  const [others, setOthers] = useState(INITIAL_OTHERS);
  const [scores, setScores] = useState(INITIAL_SCORES);
  const [showModal, setShowModal] = useState(false);
  const [savedState, setSavedState] = useState(null);
  const [loading, setLoading] = useState(false);

  const dirty =
    JSON.stringify({ ...params, ...others, ...scores }) !==
    JSON.stringify({ ...INITIAL_PARAMS, ...INITIAL_OTHERS, ...INITIAL_SCORES });

  const updateParam = useCallback((id, val) =>
    setParams(prev => ({ ...prev, [id]: val })), []);

  const updateOther = useCallback((id, val) =>
    setOthers(prev => ({ ...prev, [id]: val })), []);

  const updateScore = useCallback((id, val) =>
    setScores(prev => ({ ...prev, [id]: val })), []);

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
      
      // Prepare audit data
      const auditData = {
        agent_id: others.agent_id,
        qa_id: user.qa_id,
        call_id: others.call_id,
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
        status: 'COMPLETED'
      };

      await auditService.createAudit(auditData);
      
      setSavedState({ ...params, ...others, ...scores });
      setShowModal(false);
      toast.success('Audit saved successfully!');
      
      // Reset form
      setParams(INITIAL_PARAMS);
      setOthers(INITIAL_OTHERS);
      setScores(INITIAL_SCORES);
      setSavedState(null);
    } catch (error) {
      toast.error('Failed to save audit');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const FATAL_PARAMS = [
    'toneVoiceModulation',
    'telephoneEtiquettes',
    'probingSkills',
    'systemCheck',
    'explanationSop',
    'rebuttalHandling',
    'upsellingSkills',
    'addOnPitch',
    'rightInformation',
    'documentationCrm',
    'documentationOrder'
  ];

  const fatalCount = FATAL_PARAMS.reduce((count, key) => {
    const val = params[key];
    if (val && val.startsWith('NO')) {
      return count + 1;
    }
    return count;
  }, 0);

  const fatalStatus = fatalCount > 0 ? "Yes" : "No";

  const calculateScored = () => {
    let totalScore = 0;
    for (const field of FIELDS) {
      const selectedValue = params[field.id];
      if (selectedValue) {
        const selectedOpt = field.opts.find(o => o.value === selectedValue);
        if (selectedOpt && selectedOpt.score !== undefined) {
          totalScore += selectedOpt.score;
        }
      }
    }
    return totalScore;
  };

  const totalScored = calculateScored();

  return (
    <div className="audit-form-page">
      <div className="page-header">
        <h1>New Call Audit</h1>
        <p className="page-subtitle">Create a new audit for agent call performance</p>
      </div>

      <div className="audit-layout">
        <div className="audit-col-main">
          <div style={{ marginTop: 16 }}>
            <ParametersForm values={params} onChange={updateParam} />
          </div>
          <div style={{ marginTop: 16 }}>
            <OtherInputsForm values={others} onChange={updateOther} />
          </div>
        </div>

        <div className="audit-col-side">
          <ScoresSection values={{...scores, fatalCount, fatalStatus, scored: totalScored}} onChange={updateScore} />

          <div className="card quick-summary" style={{ marginTop: 16 }}>
            <div className="card-header">
              <h3>Audit Summary</h3>
            </div>
            <div className="card-body">
              <div className="summary-rows">
                <div className="summary-row">
                  <span className="summary-key">Status</span>
                  <span className={`summary-val status-chip ${
                    fatalStatus === 'Yes' ? 'status-fatal' : 'status-ok'
                  }`}>
                    {fatalStatus === 'Yes' ? '⚠ Fatal' : '✓ Non-Fatal'}
                  </span>
                </div>
                <div className="summary-row">
                  <span className="summary-key">Agent ID</span>
                  <span className="summary-val">{others.agent_id || '—'}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-key">QA ID</span>
                  <span className="summary-val">{user?.qa_id || '—'}</span>
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
      </div>

      {showModal && (
        <UpdateModal
          changes={buildChanges()}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
