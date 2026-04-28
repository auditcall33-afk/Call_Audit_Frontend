import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUploader = ({ onFileSelect, accept = ['.csv', '.xlsx'], maxSize = 10 }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: maxSize * 1024 * 1024,
    multiple: false
  });

  return (
    <div>
      <div
        {...getRootProps()}
        style={{
          border: '2px dashed',
          borderColor: isDragActive ? '#667eea' : '#D1D5DB',
          borderRadius: '12px',
          padding: '48px',
          textAlign: 'center',
          cursor: 'pointer',
          background: isDragActive ? '#F5F3FF' : '#F9FAFB',
          transition: 'all 0.2s'
        }}
      >
        <input {...getInputProps()} />
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
        {isDragActive ? (
          <p style={{ color: '#667eea', fontSize: '16px', fontWeight: '600' }}>
            Drop the file here...
          </p>
        ) : (
          <div>
            <p style={{ color: '#374151', fontSize: '16px', fontWeight: '600' }}>
              Drag & Drop file here
            </p>
            <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '8px' }}>
              or
            </p>
            <button
              type="button"
              style={{
                marginTop: '16px',
                padding: '10px 24px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Choose File
            </button>
          </div>
        )}
        <p style={{ color: '#9CA3AF', fontSize: '12px', marginTop: '16px' }}>
          Supported: .xlsx (Max size: {maxSize}MB)
        </p>
      </div>

      {/* File Rejections */}
      {fileRejections.length > 0 && (
        <div style={{ marginTop: '16px', padding: '12px', background: '#FEE2E2', borderRadius: '6px' }}>
          {fileRejections.map(({ file, errors }) => (
            <div key={file.name} style={{ color: '#DC2626', fontSize: '14px' }}>
              {file.name}: {errors[0].message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
