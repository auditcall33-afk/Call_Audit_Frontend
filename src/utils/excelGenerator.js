import * as XLSX from 'xlsx';

export const generateAuditsExcel = (audits) => {
  // Transform data for Excel
  const excelData = audits.map(audit => ({
    'Call ID': audit.call_id,
    'Audit Date': new Date(audit.created_at || audit.audit_date).toLocaleDateString(),
    'Agent Name': audit.agent ? `${audit.agent.first_name} ${audit.agent.last_name}` : audit.agent_name || '-',
    'QA Name': audit.qa ? `${audit.qa.first_name} ${audit.qa.last_name}` : audit.qa_name || '-',
    'Call Opening': audit.call_opening || '-',
    'Call Opening Remark': audit.call_opening_remark || '',
    'Listening Skills': audit.listening_skills || '-',
    'Listening Skills Remark': audit.listening_skills_remark || '',
    'Empathy & Courtesy': audit.empathy_courtesy || '-',
    'Empathy & Courtesy Remark': audit.empathy_courtesy_remark || '',
    'Tone & Voice Modulation': audit.tone_voice_modulation || '-',
    'Tone & Voice Modulation Remark': audit.tone_voice_modulation_remark || '',
    'Telephone Etiquettes': audit.telephone_etiquettes || '-',
    'Telephone Etiquettes Remark': audit.telephone_etiquettes_remark || '',
    'Language Skill': audit.language_skill || '-',
    'Language Skill Remark': audit.language_skill_remark || '',
    'Call Closure': audit.call_closure || '-',
    'Call Closure Remark': audit.call_closure_remark || '',
    'Probing Skills': audit.probing_skills || '-',
    'Probing Skills Remark': audit.probing_skills_remark || '',
    'System Check': audit.system_check || '-',
    'System Check Remark': audit.system_check_remark || '',
    'Explanation/Adherence to Process SOP': audit.explanation_sop || '-',
    'Explanation/Adherence to Process SOP Remark': audit.explanation_sop_remark || '',
    'Rebuttal Handling': audit.rebuttal_handling || '-',
    'Rebuttal Handling Remark': audit.rebuttal_handling_remark || '',
    'Upselling Skills': audit.upselling_skills || '-',
    'Upselling Skills Remark': audit.upselling_skills_remark || '',
    'Add-On Pitch': audit.add_on_pitch || '-',
    'Add-On Pitch Remark': audit.add_on_pitch_remark || '',
    'Right Information': audit.right_information || '-',
    'Right Information Remark': audit.right_information_remark || '',
    'Documentation/ System/ CRM Entries': audit.documentation_crm || '-',
    'Documentation/ System/ CRM Entries Remark': audit.documentation_crm_remark || '',
    'Documentation/ Order Related': audit.documentation_order || '-',
    'Documentation/ Order Related Remark': audit.documentation_order_remark || '',
    'Fatal Status': audit.fatal_status || 'No',
    'Fatal Count': audit.fatal_count || 0,
    'Scored': audit.scored || 0,
    'Scorable': audit.scorable || 100
  }));
  
  // Create workbook
  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Audits');
  
  // Auto-fit columns
  const colWidths = Object.keys(excelData[0] || {}).map(() => ({ wch: 20 }));
  ws['!cols'] = colWidths;
  
  // Download
  XLSX.writeFile(wb, `Audits_Export_${Date.now()}.xlsx`);
};

export const generateErrorReportExcel = (errors) => {
  const excelData = errors.map(error => ({
    'Row Number': error.row,
    'Error Message': error.message,
    'Data': JSON.stringify(error.data)
  }));
  
  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Errors');
  
  ws['!cols'] = [{ wch: 15 }, { wch: 50 }, { wch: 50 }];
  
  XLSX.writeFile(wb, `Upload_Errors_${Date.now()}.xlsx`);
};
