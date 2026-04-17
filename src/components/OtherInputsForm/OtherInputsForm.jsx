import React from 'react';
import { ClipboardList } from 'lucide-react';
import { CollapsibleCard } from '../common/Card/Card';
import Dropdown from '../common/Dropdown/Dropdown';
import { Input, Textarea } from '../common/Input/Input';
import './OtherInputsForm.css';



export default function OtherInputsForm({ values, onChange }) {
  const dd = (id, label, opts, placeholder='Select…') => (
    <Dropdown id={id} label={label} options={opts} placeholder={placeholder}
      value={values[id]||''} onChange={v=>onChange(id,v)} clearable />
  );
  const inp = (id, label, placeholder='') => (
    <Input id={id} label={label} placeholder={placeholder}
      value={values[id]||''} onChange={v=>onChange(id,v)} />
  );
  const ta = (id, label, placeholder='', rows=3) => (
    <Textarea id={id} label={label} placeholder={placeholder} rows={rows}
      value={values[id]||''} onChange={v=>onChange(id,v)} />
  );

  return (
    <CollapsibleCard title="Other Inputs" icon={<ClipboardList size={15} />} defaultOpen={true}>
      <div className="other-inputs-wrapper">

        <div className="form-grid form-grid-3">
          <Input id="agent_id" label="Agent ID" placeholder="Enter Agent ID…"
            value={values.agent_id || ''} onChange={v => onChange('agent_id', v)} />
          <Input id="qa_id" label="QA ID" placeholder="Enter QA ID…"
            value={values.qa_id || ''} onChange={v => onChange('qa_id', v)} />
          <Input id="call_id" label="Call ID" placeholder="Enter Call ID…"
            value={values.call_id || ''} onChange={v => onChange('call_id', v)} />
        </div>

      </div>
    </CollapsibleCard>
  );
}
