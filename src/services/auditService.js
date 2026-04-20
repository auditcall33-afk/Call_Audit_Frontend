import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const getAuthHeader = () => ({
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
});

export const auditService = {
  // Get all audits for an agent
  getAuditsByAgentId: async (agentId) => {
    const response = await axios.get(
      `${API_BASE_URL}/audits/agent/${agentId}`,
      getAuthHeader()
    );
    return response.data;
  },
  
  // Get all audits by QA
  getAuditsByQaId: async (qaId) => {
    const response = await axios.get(
      `${API_BASE_URL}/audits/qa/${qaId}`,
      getAuthHeader()
    );
    return response.data;
  },
  
  // Get single audit
  getAuditById: async (auditId) => {
    const response = await axios.get(
      `${API_BASE_URL}/audits/${auditId}`,
      getAuthHeader()
    );
    return response.data;
  },
  
  // Create audit
  createAudit: async (auditData) => {
    const response = await axios.post(
      `${API_BASE_URL}/audits`,
      auditData,
      getAuthHeader()
    );
    return response.data;
  },
  
  // Update audit
  updateAudit: async (auditId, auditData) => {
    const response = await axios.put(
      `${API_BASE_URL}/audits/${auditId}`,
      auditData,
      getAuthHeader()
    );
    return response.data;
  }
};
