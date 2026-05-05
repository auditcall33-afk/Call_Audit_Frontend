import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const auditService = {
  getAudits: async () => {
    const response = await axios.get(`${API_BASE_URL}/audits`, {
      withCredentials: true
    });
    return response.data;
  },

  getAuditById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/audits/${id}`, {
      withCredentials: true
    });
    return response.data;
  },

  getAuditsByAgentId: async (agentId) => {
    const response = await axios.get(`${API_BASE_URL}/audits/me`, {
      withCredentials: true
    });
    return response.data;
  },

  getAuditsByQaId: async (qaId) => {
    const response = await axios.get(`${API_BASE_URL}/audits`, {
      withCredentials: true
    });
    console.log('User QA ID passed:', qaId);
    console.log('All audits:', response.data);
    // Try filtering by qaId first, then by qa.userId
    const filtered = response.data.filter(audit =>
      audit.qaId === qaId ||
      (audit.qa && audit.qa.userId === qaId) ||
      (audit.qa && audit.qa.qaId === qaId)
    );
    console.log('Filtered audits:', filtered);
    return filtered;
  },

  createAudit: async (auditData) => {
    // Transform field names from snake_case to camelCase for backend
    const transformedData = {
      agentId: auditData.agent_id,
      qaId: auditData.qa_id,
      callId: auditData.call_id,
      auditStatus: auditData.status || 'IN_PROGRESS',
      callOpening: auditData.call_opening,
      callOpeningRemark: auditData.call_opening_remark,
      listeningSkills: auditData.listening_skills,
      listeningSkillsRemark: auditData.listening_skills_remark,
      empathyCourtesy: auditData.empathy_courtesy,
      empathyCourtesyRemark: auditData.empathy_courtesy_remark,
      toneVoiceModulation: auditData.tone_voice_modulation,
      toneVoiceModulationRemark: auditData.tone_voice_modulation_remark,
      telephoneEtiquettes: auditData.telephone_etiquettes,
      telephoneEtiquettesRemark: auditData.telephone_etiquettes_remark,
      languageSkill: auditData.language_skill,
      languageSkillRemark: auditData.language_skill_remark,
      callClosure: auditData.call_closure,
      callClosureRemark: auditData.call_closure_remark,
      probingSkills: auditData.probing_skills,
      probingSkillsRemark: auditData.probing_skills_remark,
      systemCheck: auditData.system_check,
      systemCheckRemark: auditData.system_check_remark,
      explanationSop: auditData.explanation_sop,
      explanationSopRemark: auditData.explanation_sop_remark,
      rebuttalHandling: auditData.rebuttal_handling,
      rebuttalHandlingRemark: auditData.rebuttal_handling_remark,
      upsellingSkills: auditData.upselling_skills,
      upsellingSkillsRemark: auditData.upselling_skills_remark,
      addOnPitch: auditData.add_on_pitch,
      addOnPitchRemark: auditData.add_on_pitch_remark,
      rightInformation: auditData.right_information,
      rightInformationRemark: auditData.right_information_remark,
      documentationCrm: auditData.documentation_crm,
      documentationCrmRemark: auditData.documentation_crm_remark,
      documentationOrder: auditData.documentation_order,
      documentationOrderRemark: auditData.documentation_order_remark,
      fatalStatus: auditData.fatal_status,
      fatalCount: auditData.fatal_count,
      scorable: auditData.scorable,
      scored: auditData.scored,
      nonFatalScore: auditData.non_fatal_score,
      auditStartedTime: new Date().toISOString()
    };

    const response = await axios.post(`${API_BASE_URL}/audits`, transformedData, {
      withCredentials: true
    });
    return response.data;
  },

  updateAudit: async (id, auditData) => {
    // Transform field names from snake_case to camelCase for backend
    const transformedData = {};
    if (auditData.call_id) transformedData.callId = auditData.call_id;
    if (auditData.agent_id) transformedData.agentId = auditData.agent_id;
    if (auditData.qa_id) transformedData.qaId = auditData.qa_id;
    if (auditData.status) transformedData.auditStatus = auditData.status;
    if (auditData.call_opening) transformedData.callOpening = auditData.call_opening;
    if (auditData.call_opening_remark) transformedData.callOpeningRemark = auditData.call_opening_remark;
    if (auditData.listening_skills) transformedData.listeningSkills = auditData.listening_skills;
    if (auditData.listening_skills_remark) transformedData.listeningSkillsRemark = auditData.listening_skills_remark;
    if (auditData.empathy_courtesy) transformedData.empathyCourtesy = auditData.empathy_courtesy;
    if (auditData.empathy_courtesy_remark) transformedData.empathyCourtesyRemark = auditData.empathy_courtesy_remark;
    if (auditData.tone_voice_modulation) transformedData.toneVoiceModulation = auditData.tone_voice_modulation;
    if (auditData.tone_voice_modulation_remark) transformedData.toneVoiceModulationRemark = auditData.tone_voice_modulation_remark;
    if (auditData.telephone_etiquettes) transformedData.telephoneEtiquettes = auditData.telephone_etiquettes;
    if (auditData.telephone_etiquettes_remark) transformedData.telephoneEtiquettesRemark = auditData.telephone_etiquettes_remark;
    if (auditData.language_skill) transformedData.languageSkill = auditData.language_skill;
    if (auditData.language_skill_remark) transformedData.languageSkillRemark = auditData.language_skill_remark;
    if (auditData.call_closure) transformedData.callClosure = auditData.call_closure;
    if (auditData.call_closure_remark) transformedData.callClosureRemark = auditData.call_closure_remark;
    if (auditData.probing_skills) transformedData.probingSkills = auditData.probing_skills;
    if (auditData.probing_skills_remark) transformedData.probingSkillsRemark = auditData.probing_skills_remark;
    if (auditData.system_check) transformedData.systemCheck = auditData.system_check;
    if (auditData.system_check_remark) transformedData.systemCheckRemark = auditData.system_check_remark;
    if (auditData.explanation_sop) transformedData.explanationSop = auditData.explanation_sop;
    if (auditData.explanation_sop_remark) transformedData.explanationSopRemark = auditData.explanation_sop_remark;
    if (auditData.rebuttal_handling) transformedData.rebuttalHandling = auditData.rebuttal_handling;
    if (auditData.rebuttal_handling_remark) transformedData.rebuttalHandlingRemark = auditData.rebuttal_handling_remark;
    if (auditData.upselling_skills) transformedData.upsellingSkills = auditData.upselling_skills;
    if (auditData.upselling_skills_remark) transformedData.upsellingSkillsRemark = auditData.upselling_skills_remark;
    if (auditData.add_on_pitch) transformedData.addOnPitch = auditData.add_on_pitch;
    if (auditData.add_on_pitch_remark) transformedData.addOnPitchRemark = auditData.add_on_pitch_remark;
    if (auditData.right_information) transformedData.rightInformation = auditData.right_information;
    if (auditData.right_information_remark) transformedData.rightInformationRemark = auditData.right_information_remark;
    if (auditData.documentation_crm) transformedData.documentationCrm = auditData.documentation_crm;
    if (auditData.documentation_crm_remark) transformedData.documentationCrmRemark = auditData.documentation_crm_remark;
    if (auditData.documentation_order) transformedData.documentationOrder = auditData.documentation_order;
    if (auditData.documentation_order_remark) transformedData.documentationOrderRemark = auditData.documentation_order_remark;
    if (auditData.fatal_status) transformedData.fatalStatus = auditData.fatal_status;
    if (auditData.fatal_count) transformedData.fatalCount = auditData.fatal_count;
    if (auditData.scorable) transformedData.scorable = auditData.scorable;
    if (auditData.scored) transformedData.scored = auditData.scored;
    if (auditData.non_fatal_score) transformedData.nonFatalScore = auditData.non_fatal_score;

    const response = await axios.put(`${API_BASE_URL}/audits/${id}`, transformedData, {
      withCredentials: true
    });
    return response.data;
  },

  completeAudit: async (id) => {
    const response = await axios.put(`${API_BASE_URL}/audits/${id}/complete`, {}, {
      withCredentials: true
    });
    return response.data;
  },

  acknowledgeAudit: async (id, acknowledgmentData) => {
    const transformedData = {
      acknowledgement: acknowledgmentData.acknowledgmentStatus,
      acknowledgeRemark: acknowledgmentData.acknowledgmentComment || ''
    };
    const response = await axios.put(`${API_BASE_URL}/audits/${id}/acknowledgement`, transformedData, {
      withCredentials: true
    });
    return response.data;
  },

  rejectAcknowledgment: async (id) => {
    const response = await axios.put(`${API_BASE_URL}/audits/${id}/acknowledgement/reject`, {}, {
      withCredentials: true
    });
    return response.data;
  }
};
