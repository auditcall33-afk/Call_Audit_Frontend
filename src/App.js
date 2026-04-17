import React, { useState, useCallback } from 'react';
import './styles/global.css';
import './App.css';

import Sidebar         from './components/Sidebar/Sidebar';
import Header          from './components/Header/Header';
import ParametersForm, { FIELDS }  from './components/ParametersForm/ParametersForm';
import OtherInputsForm from './components/OtherInputsForm/OtherInputsForm';
import ScoresSection   from './components/ScoresSection/ScoresSection';
import UpdateModal     from './components/UpdateModal/UpdateModal';

/* ─── initial form state ─────────────────────────── */
const INITIAL_PARAMS = {
  callOpening:            '',
  listeningSkills:        '',
  empathyCourtesy:        '',
  toneVoiceModulation:    '',
  telephoneEtiquettes:    '',
  languageSkill:          '',
  callClosure:            '',
  probingSkills:          '',
  systemCheck:            '',
  explanationSop:         '',
  rebuttalHandling:       '',
  upsellingSkills:        '',
  addOnPitch:             '',
  rightInformation:       '',
  documentationCrm:       '',
  documentationOrder:     ''
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

/* ─── field human labels (for modal) ─────────────── */
const FIELD_LABELS = {
  callOpening:            'Call Opening',
  listeningSkills:        'Listening Skills & Understanding',
  empathyCourtesy:        'Empathy & Courtesy',
  toneVoiceModulation:    'Tone & Voice Modulation',
  telephoneEtiquettes:    'Telephone etiquettes',
  languageSkill:          'Language Skill',
  callClosure:            'Call Closure',
  probingSkills:          'Probing Skills',
  systemCheck:            'System check',
  explanationSop:         'Explanation/Adherence to Process SOP',
  rebuttalHandling:       'Rebuttal Handling',
  upsellingSkills:        'Upselling skills',
  addOnPitch:             'Add-On Pitch',
  rightInformation:       'Right Information',
  documentationCrm:       'Documentation/ System/ CRM Entries',
  documentationOrder:     'Documentation/ Order Related',
  agent_id:               'Agent ID',
  qa_id:                  'QA ID',
  call_id:                'Call ID',
  callStatus:             'Call Status',
  callingNumber:          'Calling Number',
  disposition2:           'Disposition',
  caseType:               'Case Type',
  customerVoc:            'Customer VOC',
  scorable:               'Scorable',
  scored:                 'Scored',
};

export default function App() {
  const [params,  setParams]  = useState(INITIAL_PARAMS);
  const [others,  setOthers]  = useState(INITIAL_OTHERS);
  const [scores,  setScores]  = useState(INITIAL_SCORES);
  const [showModal, setShowModal] = useState(false);
  const [savedState, setSavedState] = useState(null);
  const [toast, setToast] = useState(null);

  /* track whether anything changed */
  const dirty =
    JSON.stringify({ ...params, ...others, ...scores }) !==
    JSON.stringify({ ...INITIAL_PARAMS, ...INITIAL_OTHERS, ...INITIAL_SCORES });

  /* field update helpers */
  const updateParam = useCallback((id, val) =>
    setParams(prev => ({ ...prev, [id]: val })), []);

  const updateOther = useCallback((id, val) =>
    setOthers(prev => ({ ...prev, [id]: val })), []);

  const updateScore = useCallback((id, val) =>
    setScores(prev => ({ ...prev, [id]: val })), []);

  /* build diff for modal */
  const buildChanges = () => {
    const base = savedState || {
      ...INITIAL_PARAMS, ...INITIAL_OTHERS, ...INITIAL_SCORES
    };
    const current = { ...params, ...others, ...scores };
    return Object.entries(current)
      .filter(([k, v]) => String(base[k] ?? '') !== String(v))
      .map(([k, v]) => ({
        field:    FIELD_LABELS[k] || k,
        oldValue: String(base[k] ?? ''),
        newValue: String(v),
      }));
  };

  const handleSaveClick = () => {
    const changes = buildChanges();
    if (!changes.length) {
      showToast('No changes to save.', 'info');
      return;
    }
    setShowModal(true);
  };

  const handleConfirm = ({ remarks }) => {
    setSavedState({ ...params, ...others, ...scores });
    setShowModal(false);
    showToast('Audit saved successfully!', 'success');
  };

  const handleReset = () => {
    setParams(INITIAL_PARAMS);
    setOthers(INITIAL_OTHERS);
    setScores(INITIAL_SCORES);
    setSavedState(null);
    showToast('Form reset to defaults.', 'info');
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
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

  /* Count fatal errors (where value is a "NO" selection for a fatal parameter) */
  const fatalCount = FATAL_PARAMS.reduce((count, key) => {
    const val = params[key];
    if (val && val.startsWith('NO')) {
      return count + 1;
    }
    return count;
  }, 0);
  
  const fatalStatus = fatalCount > 0 ? "Yes" : "No";

  /* Calculate total scored by adding up the selected options' score point values */
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
    <div className="app-shell">
      <Sidebar />

      <div className="main-content">
        <Header onSave={handleSaveClick} onReset={handleReset} dirty={dirty} />

        <main className="page-body" id="main-content" role="main">
          {/* Page title */}
          <div className="page-title-bar">
            <div>
              <h1 className="page-heading">Call Audit</h1>
              <p className="page-desc">Quality assurance evaluation for agent call performance</p>
            </div>
            <div className="page-title-actions">
              <span className="audit-id-chip">Audit #AUD-2026-00384</span>
            </div>
          </div>

          {/* Sections */}
          <div className="audit-layout">
            {/* Left column */}
            <div className="audit-col-main">
              <div style={{ marginTop: 16 }}>
                <ParametersForm values={params} onChange={updateParam} />
              </div>
              <div style={{ marginTop: 16 }}>
                <OtherInputsForm values={others} onChange={updateOther} />
              </div>
            </div>

            {/* Right sticky column */}
            <div className="audit-col-side">
              <ScoresSection values={{...scores, fatalCount, fatalStatus, scored: totalScored}} onChange={updateScore} />

              {/* Quick summary card */}
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
                      <span className="summary-val">{others.qa_id || '—'}</span>
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
                    aria-label="Submit audit"
                  >
                    Submit Audit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <UpdateModal
          changes={buildChanges()}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`} role="alert" aria-live="polite">
          {toast.type === 'success' ? '✓' : 'ℹ'} {toast.msg}
        </div>
      )}
    </div>
  );
}
