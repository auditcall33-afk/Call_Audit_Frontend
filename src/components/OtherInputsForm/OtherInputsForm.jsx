import React from 'react';
import { ClipboardList } from 'lucide-react';
import { CollapsibleCard } from '../common/Card/Card';
import Dropdown from '../common/Dropdown/Dropdown';
import { Input, Textarea } from '../common/Input/Input';
import './OtherInputsForm.css';

const CALL_CATEGORY_OPTIONS = [
  { value: 'Average', label: 'Average' },
  { value: 'Good', label: 'Good' },
  { value: 'Very Good', label: 'Very Good' },
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Poor', label: 'Poor' }
];

const CALL_TYPE_OPTIONS = [
  { value: 'Non Fatal', label: 'Non Fatal' },
  { value: 'Fatal', label: 'Fatal' }
];

const LOB_OPTIONS = [
  { value: 'Vedix', label: 'Vedix' },
  { value: 'Skinkraft', label: 'Skinkraft' }
];

const ORDER_NON_ORDER_OPTIONS = [
  { value: 'Order', label: 'Order' },
  { value: 'Non-Order', label: 'Non-Order' }
];

const DATA_TYPE_OPTIONS = [
  { value: 'M1', label: 'M1' },
  { value: 'M2', label: 'M2' },
  { value: 'M3', label: 'M3' },
  { value: 'Mn', label: 'Mn' }
];

const FATAL_REASON_OPTIONS = [
  { value: 'Tone & Voice Modulation', label: 'Tone & Voice Modulation' },
  { value: 'Telephone etiquettes', label: 'Telephone etiquettes' },
  { value: 'Probing Skills', label: 'Probing Skills' },
  { value: 'System check', label: 'System check' },
  { value: 'Explanation/Adherence to Process SOP', label: 'Explanation/Adherence to Process SOP' },
  { value: 'Rebuttal Handling', label: 'Rebuttal Handling' },
  { value: 'Upselling skills', label: 'Upselling skills' },
  { value: 'Add-On Pitch', label: 'Add-On Pitch' },
  { value: 'Right Information', label: 'Right Information' },
  { value: 'Documentation/ System/ CRM Entries', label: 'Documentation/ System/ CRM Entries' },
  { value: 'Documentation/ Order Related', label: 'Documentation/ Order Related' }
];

const AUDIT_TYPE_OPTIONS = [
  { value: 'BAU', label: 'BAU' },
  { value: 'OJT', label: 'OJT' },
  { value: 'Certification', label: 'Certification' },
  { value: 'Others', label: 'Others' }
];

export default function OtherInputsForm({ values, onChange }) {
  return (
    <CollapsibleCard title="Other Inputs" icon={<ClipboardList size={15} />} defaultOpen={true}>
      <div className="other-inputs-wrapper">

        {/* Audit Information */}
        <div className="form-section-title">Audit Information</div>
        <div className="form-grid form-grid-2">
          <Input id="agent_id" label="Agent ID" placeholder="Enter Agent ID…"
            value={values.agent_id || ''} onChange={v => onChange('agent_id', v)} />
          <Input id="team_leader" label="Team Leader" placeholder="Enter Team Leader…"
            value={values.team_leader || ''} onChange={v => onChange('team_leader', v)} />
        </div>

        {/* Call Information */}
        <div className="form-section-title">Call Information</div>
        <div className="form-grid form-grid-2">
          <Input id="call_id" label="Call ID" placeholder="Enter Call ID…"
            value={values.call_id || ''} onChange={v => onChange('call_id', v)} />
          <Input id="calling_number" label="Calling Number" placeholder="Enter Calling Number…"
            value={values.calling_number || ''} onChange={v => onChange('calling_number', v)} />
        </div>
        <div className="form-grid form-grid-3">
          <Input id="call_date" label="Call Date" type="date" placeholder="Select Call Date…"
            value={values.call_date || ''} onChange={v => onChange('call_date', v)} />
          <Input id="call_time" label="Call Time" placeholder="Enter Call Time…"
            value={values.call_time || ''} onChange={v => onChange('call_time', v)} />
          <Input id="call_duration" label="Call Duration" placeholder="Enter Call Duration…"
            value={values.call_duration || ''} onChange={v => onChange('call_duration', v)} />
        </div>

        {/* Call Classification */}
        <div className="form-section-title">Call Classification</div>
        <div className="form-grid form-grid-2">
          <Dropdown id="call_category" label="Call Category" options={CALL_CATEGORY_OPTIONS}
            value={values.call_category || ''} onChange={v => onChange('call_category', v)}
            placeholder="Select Call Category…" />
          <Input id="call_type" label="Call Type" placeholder="Auto-filled based on fatal status"
            value={values.call_type || ''} onChange={v => onChange('call_type', v)} disabled />
        </div>
        <div className="form-grid form-grid-2">
          <Dropdown id="lob" label="LOB" options={LOB_OPTIONS}
            value={values.lob || ''} onChange={v => onChange('lob', v)}
            placeholder="Select LOB…" />
          <Dropdown id="order_non_order" label="Order/Non-Order Call" options={ORDER_NON_ORDER_OPTIONS}
            value={values.order_non_order || ''} onChange={v => onChange('order_non_order', v)}
            placeholder="Select Order/Non-Order…" />
        </div>
        <div className="form-grid form-grid-2">
          <Dropdown id="data_type" label="Data Type" options={DATA_TYPE_OPTIONS}
            value={values.data_type || ''} onChange={v => onChange('data_type', v)}
            placeholder="Select Data Type…" />
          <Dropdown id="type_of_audit" label="Type Of Audit" options={AUDIT_TYPE_OPTIONS}
            value={values.type_of_audit || ''} onChange={v => onChange('type_of_audit', v)}
            placeholder="Select Type Of Audit…" />
        </div>

        {/* Call Tags */}
        <div className="form-section-title">Call Tags</div>
        <div className="form-grid form-grid-2">
          <Input id="primary_call_tag_agent" label="Primary Call Tag - Agent" placeholder="Enter Primary Call Tag (Agent)…"
            value={values.primary_call_tag_agent || ''} onChange={v => onChange('primary_call_tag_agent', v)} />
          <Input id="primary_call_tag_actual" label="Primary Call Tag - Actual" placeholder="Enter Primary Call Tag (Actual)…"
            value={values.primary_call_tag_actual || ''} onChange={v => onChange('primary_call_tag_actual', v)} />
        </div>
        <div className="form-grid form-grid-2">
          <Input id="secondary_call_tag_agent" label="Secondary Call Tag - Agent" placeholder="Enter Secondary Call Tag (Agent)…"
            value={values.secondary_call_tag_agent || ''} onChange={v => onChange('secondary_call_tag_agent', v)} />
          <Input id="secondary_call_tag_actual" label="Secondary Call Tag - Actual" placeholder="Enter Secondary Call Tag (Actual)…"
            value={values.secondary_call_tag_actual || ''} onChange={v => onChange('secondary_call_tag_actual', v)} />
        </div>

        {/* Language Information */}
        <div className="form-section-title">Language Information</div>
        <div className="form-grid form-grid-3">
          <Input id="call_opening_language" label="Call Opening Language" placeholder="Enter Call Opening Language…"
            value={values.call_opening_language || ''} onChange={v => onChange('call_opening_language', v)} />
          <Input id="customer_language" label="Customer Language" placeholder="Enter Customer Language…"
            value={values.customer_language || ''} onChange={v => onChange('customer_language', v)} />
          <Input id="call_language" label="Call Language" placeholder="Enter Call Language…"
            value={values.call_language || ''} onChange={v => onChange('call_language', v)} />
        </div>

        {/* ACPT & Reasons */}
        <div className="form-section-title">ACPT & Reasons</div>
        <div className="form-grid form-grid-2">
          <Input id="acpt" label="ACPT" placeholder="Enter ACPT…"
            value={values.acpt || ''} onChange={v => onChange('acpt', v)} />
          <Dropdown id="fatal_reason" label="Fatal Reason" options={FATAL_REASON_OPTIONS}
            value={values.fatal_reason || ''} onChange={v => onChange('fatal_reason', v)}
            placeholder="Select Fatal Reason…" />
        </div>
        <Textarea id="acpt_reasons" label="ACPT Reasons" placeholder="Enter ACPT Reasons…"
          value={values.acpt_reasons || ''} onChange={v => onChange('acpt_reasons', v)} maxLength={500} />

        {/* VOC & Improvement */}
        <div className="form-section-title">VOC & Improvement</div>
        <div className="form-grid form-grid-2">
          <Input id="process_voc" label="Process VOC" placeholder="Enter Process VOC…"
            value={values.process_voc || ''} onChange={v => onChange('process_voc', v)} />
          <Input id="product_voc" label="Product VOC" placeholder="Enter Product VOC…"
            value={values.product_voc || ''} onChange={v => onChange('product_voc', v)} />
        </div>
        <div className="form-grid form-grid-2">
          <Input id="tech_voc" label="Tech VOC" placeholder="Enter Tech VOC…"
            value={values.tech_voc || ''} onChange={v => onChange('tech_voc', v)} />
          <Input id="tni" label="TNI" placeholder="Enter TNI…"
            value={values.tni || ''} onChange={v => onChange('tni', v)} />
        </div>
        <Textarea id="areas_of_improvement" label="Areas Of Improvement - What Went Well" placeholder="Enter Areas Of Improvement…"
          value={values.areas_of_improvement || ''} onChange={v => onChange('areas_of_improvement', v)} maxLength={500} />

        {/* Additional Information */}
        <div className="form-section-title">Additional Information</div>
        <div className="form-grid form-grid-2">
          <Textarea id="call_brief" label="Call Brief" placeholder="Enter Call Brief…"
            value={values.call_brief || ''} onChange={v => onChange('call_brief', v)} maxLength={500} />
          <Input id="fully_paid_delivery_orders" label="Fully Paid Delivery Orders" placeholder="Enter Fully Paid Delivery Orders…"
            value={values.fully_paid_delivery_orders || ''} onChange={v => onChange('fully_paid_delivery_orders', v)} />
        </div>

      </div>
    </CollapsibleCard>
  );
}
