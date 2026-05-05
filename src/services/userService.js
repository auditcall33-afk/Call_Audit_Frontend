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
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true
      }
    );
    return response.data;
  },

  downloadSampleTemplate: () => {
    // Create a sample CSV template matching new Excel format
    const headers = ['Email', 'Role', 'FirstName', 'LastName', 'Phone', 'DOJ'];
    const sampleData = [
      headers.join(','),
      'akashaysrivastav@gmail.com,AGENT,Akshay,Srivastav,9346792878,1-Aug-25',
      'beingvickysingh@gmail.com,AGENT,Vicky,Kumar,6301931389,1-Aug-25',
      'parveenshadiba@gmail.com,QA,Shadiba,Parveen,7895018606,1-Aug-25',
      'shrutisharmaoza0221@gmail.com,QA,Shruthi,Sharma,8374284186,1-Aug-25'
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
