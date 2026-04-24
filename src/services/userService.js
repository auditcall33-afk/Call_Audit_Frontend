import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

export const userService = {
  bulkUploadUsers: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(
      `${API_BASE_URL}/users/bulk-upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  },

  downloadSampleTemplate: () => {
    // Create a sample CSV template matching backend expectations
    const headers = ['UserId', 'FirstName', 'LastName', 'Email', 'Password', 'Phone', 'Language', 'Role'];
    const sampleData = [
      headers.join(','),
      'EMP_001,John,Doe,john.doe@example.com,Pass@123,1234567890,English,AGENT',
      'EMP_002,Jane,Smith,jane.smith@example.com,Pass@123,9876543210,English,AGENT',
      'QA_001,Admin,User,admin@example.com,Admin@123,5555555555,English,QA'
    ];
    
    const csvContent = sampleData.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'bulk_upload_template.csv';
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
};
