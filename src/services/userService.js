import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const userService = {
  bulkUploadUsers: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(
      `${API_BASE_URL}/users/bulk-upload`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  },
  
  downloadSampleTemplate: () => {
    const csvContent = `UserId,FirstName,LastName,Email,Password,Phone,Language,Role
SAMPLE_001,John,Doe,john.doe@example.com,Pass@123,1234567890,English,AGENT
SAMPLE_002,Jane,Smith,jane.smith@example.com,Pass@456,9876543210,Spanish,QA`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user_upload_template.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  }
};
