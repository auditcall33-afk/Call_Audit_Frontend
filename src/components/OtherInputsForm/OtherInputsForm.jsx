import React from 'react';
import { ClipboardList } from 'lucide-react';
import { CollapsibleCard } from '../common/Card/Card';
import Dropdown from '../common/Dropdown/Dropdown';
import { Input, Textarea } from '../common/Input/Input';
import './OtherInputsForm.css';



export default function OtherInputsForm({ values, onChange }) {
  return (
    <CollapsibleCard title="Other Inputs" icon={<ClipboardList size={15} />} defaultOpen={true}>
      <div className="other-inputs-wrapper">

        <div className="form-grid form-grid-2">
          <Input id="agent_id" label="Agent ID" placeholder="Enter Agent ID…"
            value={values.agent_id || ''} onChange={v => onChange('agent_id', v)} />
          <Input id="call_id" label="Call ID" placeholder="Enter Call ID…"
            value={values.call_id || ''} onChange={v => onChange('call_id', v)} />
        </div>

      </div>
    </CollapsibleCard>
  );
}
