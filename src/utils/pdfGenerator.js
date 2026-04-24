import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateAuditPDF = (auditData, agentData, qaData) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.text('Call Audit Report', 105, 15, { align: 'center' });
  
  // Agent Info
  doc.setFontSize(12);
  doc.text(`Agent: ${agentData?.first_name || ''} ${agentData?.last_name || ''} (ID: ${agentData?.agent_id || auditData.agent_id})`, 20, 30);
  doc.text(`Call ID: ${auditData.call_id}`, 20, 38);
  doc.text(`Audit Date: ${new Date(auditData.created_at || auditData.audit_date).toLocaleDateString()}`, 20, 46);
  doc.text(`Audited By: ${qaData?.first_name || ''} ${qaData?.last_name || ''} (QA)`, 20, 54);
  
  // Evaluation Table
  const tableData = [
    ['Call Opening', auditData.call_opening || '-', auditData.call_opening_remark || '-'],
    ['Listening Skills', auditData.listening_skills || '-', auditData.listening_skills_remark || '-'],
    ['Empathy & Courtesy', auditData.empathy_courtesy || '-', auditData.empathy_courtesy_remark || '-'],
    ['Tone & Voice Modulation', auditData.tone_voice_modulation || '-', auditData.tone_voice_modulation_remark || '-'],
    ['Telephone Etiquettes', auditData.telephone_etiquettes || '-', auditData.telephone_etiquettes_remark || '-'],
    ['Language Skill', auditData.language_skill || '-', auditData.language_skill_remark || '-'],
    ['Call Closure', auditData.call_closure || '-', auditData.call_closure_remark || '-'],
    ['Probing Skills', auditData.probing_skills || '-', auditData.probing_skills_remark || '-'],
    ['System Check', auditData.system_check || '-', auditData.system_check_remark || '-'],
    ['Explanation/Adherence to Process SOP', auditData.explanation_sop || '-', auditData.explanation_sop_remark || '-'],
    ['Rebuttal Handling', auditData.rebuttal_handling || '-', auditData.rebuttal_handling_remark || '-'],
    ['Upselling Skills', auditData.upselling_skills || '-', auditData.upselling_skills_remark || '-'],
    ['Add-On Pitch', auditData.add_on_pitch || '-', auditData.add_on_pitch_remark || '-'],
    ['Right Information', auditData.right_information || '-', auditData.right_information_remark || '-'],
    ['Documentation/ System/ CRM Entries', auditData.documentation_crm || '-', auditData.documentation_crm_remark || '-'],
    ['Documentation/ Order Related', auditData.documentation_order || '-', auditData.documentation_order_remark || '-'],
  ];
  
  doc.autoTable({
    head: [['Parameter', 'Evaluation', 'Remarks']],
    body: tableData,
    startY: 65,
    theme: 'striped',
    headStyles: { fillColor: [102, 126, 234] },
    styles: { fontSize: 8 }
  });
  
  // Scores Summary
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text('Scores Summary:', 20, finalY);
  doc.text(`Fatal Status: ${auditData.fatal_status || 'No'}`, 20, finalY + 8);
  doc.text(`Fatal Count: ${auditData.fatal_count || 0}`, 20, finalY + 16);
  doc.text(`Scored: ${auditData.scored || 0}/100`, 20, finalY + 24);
  
  // Footer
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
  
  // Save
  doc.save(`Audit_${auditData.call_id}_${Date.now()}.pdf`);
};

export const generatePerformanceReportPDF = (reportData, agentData, dateRange) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.text('Performance Report', 105, 15, { align: 'center' });
  
  // Agent Info
  doc.setFontSize(12);
  doc.text(`Agent: ${agentData?.first_name || ''} ${agentData?.last_name || ''} (ID: ${agentData?.agent_id || ''})`, 20, 30);
  doc.text(`Report Period: ${dateRange.from} to ${dateRange.to}`, 20, 38);
  
  // Summary
  doc.setFontSize(14);
  doc.text('Summary', 20, 55);
  doc.setFontSize(12);
  doc.text(`Total Audits: ${reportData.totalAudits || 0}`, 20, 65);
  doc.text(`Average Score: ${reportData.averageScore || 0}/100`, 20, 73);
  doc.text(`Fatal Errors Count: ${reportData.fatalErrorsCount || 0}`, 20, 81);
  
  // Parameter-wise Analysis
  doc.setFontSize(14);
  doc.text('Parameter-wise Success Rate', 20, 95);
  
  const paramData = reportData.parameterAnalysis || [];
  const paramTable = paramData.map(param => [
    param.parameter,
    `${param.successRate || 0}%`,
    param.issues || '-'
  ]);
  
  doc.autoTable({
    head: [['Parameter', 'Success Rate', 'Common Issues']],
    body: paramTable,
    startY: 100,
    theme: 'striped',
    headStyles: { fillColor: [102, 126, 234] },
    styles: { fontSize: 9 }
  });
  
  // Trend
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text('Trend', 20, finalY);
  doc.setFontSize(12);
  doc.text(`Status: ${reportData.trend || 'Stable'}`, 20, finalY + 10);
  
  // Footer
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
  
  doc.save(`Performance_Report_${agentData?.agent_id || 'agent'}_${Date.now()}.pdf`);
};

export const generateQAActivityReportPDF = (reportData, qaData, dateRange) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.text('QA Activity Report', 105, 15, { align: 'center' });
  
  // QA Info
  doc.setFontSize(12);
  doc.text(`QA: ${qaData?.first_name || ''} ${qaData?.last_name || ''} (ID: ${qaData?.qa_id || ''})`, 20, 30);
  doc.text(`Report Period: ${dateRange.from} to ${dateRange.to}`, 20, 38);
  
  // Summary
  doc.setFontSize(14);
  doc.text('Summary', 20, 55);
  doc.setFontSize(12);
  doc.text(`Total Audits Completed: ${reportData.totalAudits || 0}`, 20, 65);
  doc.text(`Average Score: ${reportData.averageScore || 0}/100`, 20, 73);
  doc.text(`Most Common Issues: ${reportData.mostCommonIssues || 'None'}`, 20, 81);
  doc.text(`Fatal Errors Count: ${reportData.fatalErrorsCount || 0}`, 20, 89);
  
  // Agent-wise Breakdown
  doc.setFontSize(14);
  doc.text('Agent-wise Breakdown', 20, 103);
  
  const agentDataArray = reportData.agentBreakdown || [];
  const agentTable = agentDataArray.map(agent => [
    agent.agentName,
    agent.auditCount || 0,
    agent.averageScore || 0
  ]);
  
  doc.autoTable({
    head: [['Agent Name', 'Audit Count', 'Average Score']],
    body: agentTable,
    startY: 108,
    theme: 'striped',
    headStyles: { fillColor: [102, 126, 234] },
    styles: { fontSize: 9 }
  });
  
  // Footer
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 280);
  
  doc.save(`QA_Activity_Report_${qaData?.qa_id || 'qa'}_${Date.now()}.pdf`);
};
