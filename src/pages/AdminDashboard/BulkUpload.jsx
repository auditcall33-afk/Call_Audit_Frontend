import React, { useState } from 'react';
import { userService } from '../../services/userService';
import FileUploader from '../../components/common/FileUploader';
import { toast } from 'react-toastify';
import './BulkUpload.css';

export default function BulkUpload() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadResults, setUploadResults] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleDownloadTemplate = () => {
    userService.downloadSampleTemplate();
    toast.success('Template downloaded successfully');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    setLoading(true);
    try {
      const results = await userService.bulkUploadUsers(selectedFile);
      setUploadResults(results);
      setShowResultsModal(true);
      toast.success('File uploaded successfully');
      setSelectedFile(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload file');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowResultsModal(false);
    setUploadResults(null);
  };

  return (
    <div className="bulk-upload">
      <div className="page-header">
        <h1>Bulk User Upload</h1>
        <p className="page-subtitle">Upload multiple users at once using Excel file</p>
      </div>

      <div className="upload-container">
        <div className="upload-section">
          <h2>Upload File</h2>
          <p className="upload-description">
            Upload Excel file with users to add them to the system.
          </p>

          <FileUploader
            onFileSelect={handleFileSelect}
            accept={['.xlsx']}
            maxSize={10}
          />

          {selectedFile && (
            <div className="selected-file-info">
              <div className="file-info-card">
                <div className="file-icon">📄</div>
                <div className="file-details">
                  <p className="file-name">{selectedFile.name}</p>
                  <p className="file-size">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="remove-file-button"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <div className="upload-actions">
            <button
              onClick={handleDownloadTemplate}
              className="download-template-button"
            >
              Download Sample Template
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              className="upload-button"
            >
              {loading ? 'Processing...' : 'Upload & Process'}
            </button>
          </div>
        </div>

        <div className="instructions-section">
          <h2>File Format Instructions</h2>
          <div className="instructions-content">
            <h3>Required Columns:</h3>
            <ul>
              <li><strong>Email</strong> - User's email (must be unique)</li>
              <li><strong>Role</strong> - User's role (AGENT, QA, or ADMIN)</li>
              <li><strong>FirstName</strong> - User's first name</li>
              <li><strong>LastName</strong> - User's last name</li>
              <li><strong>Phone</strong> - User's phone number</li>
              <li><strong>DOJ</strong> - Date of Joining (format: DD-MMM-YY, e.g., 1-Aug-25)</li>
            </ul>

            <h3>Important Notes:</h3>
            <ul>
              <li>File must be in Excel format (.xlsx) only</li>
              <li>Maximum file size is 10MB</li>
              <li>Email addresses must be unique</li>
              <li>Role must be either "AGENT", "QA", or "ADMIN" (case-insensitive)</li>
              <li>FirstName and LastName are stored only in the User table</li>
              <li>DOJ format should be DD-MMM-YY (e.g., 1-Aug-25)</li>
            </ul>

            <h3>Example Row:</h3>
            <div className="example-row">
              <code>akashaysrivastav@gmail.com,AGENT,Akshay,Srivastav,9346792878,1-Aug-25</code>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Results Modal */}
      {showResultsModal && uploadResults && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Results</h2>
              <button onClick={handleCloseModal} className="close-button">×</button>
            </div>
            <div className="modal-body">
              <div className="results-summary">
                <div className="result-item success">
                  <div className="result-icon">✅</div>
                  <div className="result-content">
                    <h3>Total Rows</h3>
                    <p className="result-value">{uploadResults.totalRows}</p>
                  </div>
                </div>
                <div className="result-item success">
                  <div className="result-icon">✅</div>
                  <div className="result-content">
                    <h3>Successfully Added</h3>
                    <p className="result-value">{uploadResults.successCount}</p>
                  </div>
                </div>
                <div className="result-item error">
                  <div className="result-icon">❌</div>
                  <div className="result-content">
                    <h3>Failed</h3>
                    <p className="result-value">{uploadResults.failureCount}</p>
                  </div>
                </div>
              </div>

              {uploadResults.errors && uploadResults.errors.length > 0 && (
                <div className="errors-section">
                  <h3>Errors:</h3>
                  <ul className="errors-list">
                    {uploadResults.errors.map((error, index) => (
                      <li key={index} className="error-item">{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {uploadResults.successfulUserIds && uploadResults.successfulUserIds.length > 0 && (
                <div className="success-section">
                  <h3>Successfully Added User IDs:</h3>
                  <div className="user-ids-list">
                    {uploadResults.successfulUserIds.map((userId, index) => (
                      <span key={index} className="user-id-chip">{userId}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button onClick={handleCloseModal} className="close-modal-button">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
