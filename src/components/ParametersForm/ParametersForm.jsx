import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { CollapsibleCard } from '../common/Card/Card';
import Dropdown from '../common/Dropdown/Dropdown';
import './ParametersForm.css';

/* ── Option generators ───────────────────────────── */
const yesOption = (score) => ({ value: 'YES - Parameter met', label: 'YES - Parameter met', score });

const callOpeningOpts = [
  yesOption(5),
  { value: 'NO - Late Call Opening Post 3 Secs', label: 'NO - Late Call Opening Post 3 Secs', score: 0 },
  { value: 'NO - Self-Introduction not given', label: 'NO - Self-Introduction not given', score: 0 },
  { value: 'NO - Brand Name verbiage not adhered', label: 'NO - Brand Name verbiage not adhered', score: 0 },
  { value: 'NO - Purpose of call not informed', label: 'NO - Purpose of call not informed', score: 0 },
  { value: 'NO - Customer permission not seeked', label: 'NO - Customer permission not seeked', score: 0 },
  { value: 'NO - Dull tone/unenthusiastic opening', label: 'NO - Dull tone/unenthusiastic opening', score: 0 }
];

const listeningSkillsOpts = [
  yesOption(8),
  { value: 'NO - Attentiveness was Missing', label: 'NO - Attentiveness was Missing', score: 0 },
  { value: 'NO - Missed building rapport with customer', label: 'NO - Missed building rapport with customer', score: 0 },
  { value: 'NO - Did not use assurance statement', label: 'NO - Did not use assurance statement', score: 0 },
  { value: 'NO - Did not acknowledge underline query', label: 'NO - Did not acknowledge underline query', score: 0 },
  { value: 'NO - Did not provide space to customer to share concern', label: 'NO - Did not provide space to customer to share concern', score: 0 }
];

const empathyCourtesyOpts = [
  yesOption(5),
  { value: 'NO - Empathy and Courtesy Statements/Attitude Was Missing/Incorrect', label: 'NO - Empathy and Courtesy Statements/Attitude Was Missing/Incorrect', score: 0 },
  { value: 'NO - Apology Was Not Offered Wherever Required', label: 'NO - Apology Was Not Offered Wherever Required', score: 0 },
  { value: 'NO - Too Many Apology Statements', label: 'NO - Too Many Apology Statements', score: 0 },
  { value: 'NO - Did not respond to customer grievances', label: 'NO - Did not respond to customer grievances', score: 0 }
];

const toneVoiceModulationOpts = [
  yesOption(6),
  { value: 'no-Interruption observed', label: 'no-Interruption observed', score: 0 },
  { value: 'no-Rushing observed on the call', label: 'no-Rushing observed on the call', score: 0 },
  { value: 'no-Fumbled/ Stammered', label: 'no-Fumbled/ Stammered', score: 0 },
  { value: 'no-Sounded Draggy Tone And Dull on the call', label: 'no-Sounded Draggy Tone And Dull on the call', score: 0 },
  { value: 'no-Sounded Scripted Or Robotic-No Human Touch', label: 'no-Sounded Scripted Or Robotic-No Human Touch', score: 0 },
  { value: 'no-Speech Unclear', label: 'no-Speech Unclear', score: 0 },
  { value: 'no-Confidence Missing', label: 'no-Confidence Missing', score: 0 },
  { value: 'no-Did not display energy and enthusiasm', label: 'no-Did not display energy and enthusiasm', score: 0 },
  { value: 'fatal-Rude/sarcastic/curt/commanding tone-ZTP', label: 'fatal-Rude/sarcastic/curt/commanding tone-ZTP', score: 0 }
];

const telephoneEtiquettesOpts = [
  yesOption(6),
  { value: 'no-Approach Was Casual', label: 'no-Approach Was Casual', score: 0 },
  { value: 'no-Dead Air Threshold Exceeded', label: 'no-Dead Air Threshold Exceeded', score: 0 },
  { value: 'no-Hold Threshold Exceeded', label: 'no-Hold Threshold Exceeded', score: 0 },
  { value: 'no-Slang Words/Jargons observed', label: 'no-Slang Words/Jargons observed', score: 0 },
  { value: 'fatal-Yawning/singing/cross talk observed-Fatal', label: 'fatal-Yawning/singing/cross talk observed-Fatal', score: 0 },
  { value: 'fatal-Laughing/Cross talk observed-Derogatory/aimed at customer-ZTP', label: 'fatal-Laughing/Cross talk observed-Derogatory/aimed at customer-ZTP', score: 0 },
  { value: 'fatal-Late replies/Unnecessary hold/Mute amounting to call avoidance-ZTP', label: 'fatal-Late replies/Unnecessary hold/Mute amounting to call avoidance-ZTP', score: 0 },
  { value: 'fatal-Did not follow the transfer procedure-ZTP', label: 'fatal-Did not follow the transfer procedure-ZTP', score: 0 }
];

const languageSkillOpts = [
  yesOption(5),
  { value: 'NO - Not Spoken In Customers Language/Seek permission before switching to another language', label: 'NO - Not Spoken In Customers Language/Seek permission before switching to another language', score: 0 },
  { value: 'NO - Tense Formations And Grammatical Errors', label: 'NO - Tense Formations And Grammatical Errors', score: 0 },
  { value: 'NO - Incorrect Pronunciation', label: 'NO - Incorrect Pronunciation', score: 0 },
  { value: 'NO - MTI influence/observed', label: 'NO - MTI influence/observed', score: 0 }
];

const callClosureOpts = [
  yesOption(5),
  { value: 'NO - Did not pitch further assistance', label: 'NO - Did not pitch further assistance', score: 0 },
  { value: 'NO - Call Closure Not As Per Defined Or Standard Script', label: 'NO - Call Closure Not As Per Defined Or Standard Script', score: 0 },
  { value: 'NO - Call closure not given(Opportunity available)', label: 'NO - Call closure not given(Opportunity available)', score: 0 },
  { value: 'NO - Touch points/Self-care not informed', label: 'NO - Touch points/Self-care not informed', score: 0 },
  { value: 'NO - Tone of the call closure - did not show enthusiasm', label: 'NO - Tone of the call closure - did not show enthusiasm', score: 0 }
];

const probingSkillsOpts = [
  yesOption(6),
  { value: 'fatal-1. Did not probe according customer concern', label: 'fatal-1. Did not probe according customer concern', score: 0 },
  { value: 'fatal-2. Did Not Attempt To Ask Questions For Better Understanding', label: 'fatal-2. Did Not Attempt To Ask Questions For Better Understanding', score: 0 },
  { value: 'fatal-3. Incorrect/Irrelevant Probing Done', label: 'fatal-3. Incorrect/Irrelevant Probing Done', score: 0 },
  { value: 'fatal-4. Negative Probing done', label: 'fatal-4. Negative Probing done', score: 0 },
  { value: 'fatal-5. Unnecessary Probing Done', label: 'fatal-5. Unnecessary Probing Done', score: 0 }
];

const systemCheckOpts = [
  yesOption(6),
  { value: 'fatal-Did not relate to SPQ/VPQ', label: 'fatal-Did not relate to SPQ/VPQ', score: 0 },
  { value: 'fatal-Customer concern/history not checked', label: 'fatal-Customer concern/history not checked', score: 0 }
];

const explanationSopOpts = [
  yesOption(8),
  { value: 'fatal-Did not use the scripts basis the customer profile M1/M2/M3/Mn', label: 'fatal-Did not use the scripts basis the customer profile M1/M2/M3/Mn', score: 0 },
  { value: 'fatal-Failed to explain science', label: 'fatal-Failed to explain science', score: 0 },
  { value: 'fatal-Failed to explain adaptation process', label: 'fatal-Failed to explain adaptation process', score: 0 },
  { value: 'fatal-Failed to explain usage procedure', label: 'fatal-Failed to explain usage procedure', score: 0 },
  { value: 'fatal-Failed to explain the benefits of key ingredients', label: 'fatal-Failed to explain the benefits of key ingredients', score: 0 },
  { value: 'fatal-Failed to address customer concern', label: 'fatal-Failed to address customer concern', score: 0 },
  { value: 'fatal-Underline query not addressed', label: 'fatal-Underline query not addressed', score: 0 },
  { value: 'fatal-Seasonal script-Add on pitch according to concern', label: 'fatal-Seasonal script-Add on pitch according to concern', score: 0 }
];

const rebuttalHandlingOpts = [
  yesOption(8),
  { value: 'fatal-Did not try to retain customer', label: 'fatal-Did not try to retain customer', score: 0 },
  { value: 'fatal-Did not pitch USPs of the brand', label: 'fatal-Did not pitch USPs of the brand', score: 0 },
  { value: 'fatal-Did not inform about follow up/switch/regimen review link', label: 'fatal-Did not inform about follow up/switch/regimen review link', score: 0 }
];

const upsellingSkillsOpts = [
  yesOption(8),
  { value: 'fatal-Lack of convincing skills-Effective pitching missing-Only markdown', label: 'fatal-Lack of convincing skills-Effective pitching missing-Only markdown', score: 0 },
  { value: 'fatal-Did not follow quantity left rebuttal', label: 'fatal-Did not follow quantity left rebuttal', score: 0 },
  { value: 'fatal-Did not pitch individual product', label: 'fatal-Did not pitch individual product', score: 0 },
  { value: 'fatal-Weaker confirmation/Force Sale-ZTP', label: 'fatal-Weaker confirmation/Force Sale-ZTP', score: 0 }
];

const addOnPitchOpts = [
  yesOption(2),
  { value: 'fatal-Did not pitch add-on products', label: 'fatal-Did not pitch add-on products', score: 0 }
];

const rightInformationOpts = [
  yesOption(6),
  { value: 'fatal-Membership Plan Benefits, Membership Plan Expiry Date & Year not explained', label: 'fatal-Membership Plan Benefits, Membership Plan Expiry Date & Year not explained', score: 0 },
  { value: 'fatal-Incorrect Delivery TAT informed', label: 'fatal-Incorrect Delivery TAT informed', score: 0 },
  { value: 'fatal-No TAT informed for delivery/complaint resolution', label: 'fatal-No TAT informed for delivery/complaint resolution', score: 0 },
  { value: 'fatal-Did not inform the price(amount payable) of the order placed', label: 'fatal-Did not inform the price(amount payable) of the order placed', score: 0 },
  { value: 'fatal-RPC not confirmed-Fatal', label: 'fatal-RPC not confirmed-Fatal', score: 0 },
  { value: 'fatal-Address with phone number not confirmed', label: 'fatal-Address with phone number not confirmed', score: 0 },
  { value: 'fatal-Did not inform payment method', label: 'fatal-Did not inform payment method', score: 0 }
];

const documentationCrmOpts = [
  yesOption(6),
  { value: 'fatal-No tagging observed', label: 'fatal-No tagging observed', score: 0 },
  { value: 'fatal-Incorrect/Incomplete tagging observed', label: 'fatal-Incorrect/Incomplete tagging observed', score: 0 },
  { value: 'fatal-No VOC captured', label: 'fatal-No VOC captured', score: 0 },
  { value: 'fatal-Incorrect/Incomplete VOC captured', label: 'fatal-Incorrect/Incomplete VOC captured', score: 0 },
  { value: 'fatal-Product complaint not raised', label: 'fatal-Product complaint not raised', score: 0 }
];

const documentationOrderOpts = [
  yesOption(10),
  { value: 'fatal-Not Captured Updated Billing Address', label: 'fatal-Not Captured Updated Billing Address', score: 0 },
  { value: 'fatal-Not Selected Correct Order Date', label: 'fatal-Not Selected Correct Order Date', score: 0 },
  { value: 'fatal-Cancellation request not taken', label: 'fatal-Cancellation request not taken', score: 0 },
  { value: 'fatal-Incorrect Selection Of Add-on product', label: 'fatal-Incorrect Selection Of Add-on product', score: 0 },
  { value: 'fatal-Did not select Add-on product', label: 'fatal-Did not select Add-on product', score: 0 },
  { value: 'fatal-Pending action not raised', label: 'fatal-Pending action not raised', score: 0 },
  { value: 'fatal-Order not created', label: 'fatal-Order not created', score: 0 }
];

/* ── Fields config ───────────────────────────────── */
export const FIELDS = [
  { id: 'callOpening', label: 'Call Opening', badge: 'non-fatal', opts: callOpeningOpts },
  { id: 'listeningSkills', label: 'Listening Skills & Understanding', badge: 'non-fatal', opts: listeningSkillsOpts },
  { id: 'empathyCourtesy', label: 'Empathy & Courtesy', badge: 'non-fatal', opts: empathyCourtesyOpts },
  { id: 'toneVoiceModulation', label: 'Tone & Voice Modulation', badge: 'fatal', opts: toneVoiceModulationOpts },
  { id: 'telephoneEtiquettes', label: 'Telephone etiquettes', badge: 'fatal', opts: telephoneEtiquettesOpts },
  { id: 'languageSkill', label: 'Language Skill', badge: 'non-fatal', opts: languageSkillOpts },
  { id: 'callClosure', label: 'Call Closure', badge: 'non-fatal', opts: callClosureOpts },
  { id: 'probingSkills', label: 'Probing Skills', badge: 'fatal', opts: probingSkillsOpts },
  { id: 'systemCheck', label: 'System check', badge: 'fatal', opts: systemCheckOpts },
  { id: 'explanationSop', label: 'Explanation/Adherence to Process SOP', badge: 'fatal', opts: explanationSopOpts },
  { id: 'rebuttalHandling', label: 'Rebuttal Handling', badge: 'fatal', opts: rebuttalHandlingOpts },
  { id: 'upsellingSkills', label: 'Upselling skills', badge: 'fatal', opts: upsellingSkillsOpts },
  { id: 'addOnPitch', label: 'Add-On Pitch', badge: 'fatal', opts: addOnPitchOpts },
  { id: 'rightInformation', label: 'Right Information', badge: 'fatal', opts: rightInformationOpts },
  { id: 'documentationCrm', label: 'Documentation/ System/ CRM Entries', badge: 'fatal', opts: documentationCrmOpts },
  { id: 'documentationOrder', label: 'Documentation/ Order Related', badge: 'fatal', opts: documentationOrderOpts }
];

export default function ParametersForm({ values, onChange }) {
  return (
    <CollapsibleCard
      title="Parameter wise Evaluation"
      icon={<ShieldAlert size={15} />}
      defaultOpen={true}
    >
      <div className="params-legend">
        <span className="badge badge-fatal">Fatal</span>
        <span className="legend-text">— Zero tolerance; marks call as fatal</span>
        <span className="badge badge-non-fatal" style={{ marginLeft: 16 }}>Non-Fatal</span>
        <span className="legend-text">— Affects score but not fatal</span>
      </div>

      <div className="params-grid">
        {FIELDS.map((field, idx) => (
          <div key={field.id} className="param-row">
            <div className="param-index">{String(idx + 1).padStart(2, '0')}</div>
            <div className="param-content">
              <Dropdown
                id={field.id}
                label={field.label}
                badge={field.badge}
                options={field.opts}
                value={values[field.id] || ''}
                onChange={val => onChange(field.id, val)}
                placeholder="Select response based on Legend/L1 reasons…"
                clearable
                className="param-dropdown"
              />
              {/* Show remarks field automatically if a no- or fatal- parameter is chosen */}
              {values[field.id] && (values[field.id].startsWith('no-') || values[field.id].startsWith('fatal-')) && (
                <div className="param-remark">
                  <textarea
                    className="remark-input"
                    placeholder="Enter remark"
                    maxLength={130}
                    value={values[`${field.id}Remark`] || ''}
                    onChange={e => onChange(`${field.id}Remark`, e.target.value)}
                    aria-label={`Remark for ${field.label}`}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </CollapsibleCard>
  );
}
