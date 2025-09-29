import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResumeUpload = ({ onUpload, isUploading = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFile(e?.dataTransfer?.files?.[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFile(e?.target?.files?.[0]);
    }
  };

  const handleFile = (file) => {
    setUploadError('');
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes?.includes(file?.type)) {
      setUploadError('Please upload a PDF or DOCX file only.');
      return;
    }
    
    // Validate file size (5MB limit)
    if (file?.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB.');
      return;
    }
    
    onUpload?.(file);
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          dragActive 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileInput}
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            dragActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}>
            <Icon name={isUploading ? "Loader2" : "Upload"} size={24} className={isUploading ? 'animate-spin' : ''} />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {isUploading ? 'Processing Resume...' : 'Upload Your Resume'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Drag and drop your resume here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              Supports PDF and DOCX files (max 5MB)
            </p>
          </div>
          
          <Button
            variant="outline"
            onClick={openFileDialog}
            disabled={isUploading}
            iconName="FileText"
            iconPosition="left"
          >
            {isUploading ? 'Processing...' : 'Choose File'}
          </Button>
        </div>
        
        {uploadError && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <div className="flex items-center space-x-2 text-destructive text-sm">
              <Icon name="AlertCircle" size={16} />
              <span>{uploadError}</span>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 bg-card border border-border rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground mb-2">What happens next?</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span>We'll extract your name, email, and phone number</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span>Any missing information will be collected via chat</span>
          </li>
          <li className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span>Your technical interview will begin automatically</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ResumeUpload;