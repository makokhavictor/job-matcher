'use client';

import { useState, useRef, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  type: 'cv' | 'jobDescription';
  onUploadComplete: (file: File | string) => void; // Updated to accept string for pasted text
}

export function FileUpload({ type, onUploadComplete }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [pastedText, setPastedText] = useState(''); // New state for pasted text
  const [uploaded, setUploaded] = useState<File | string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFile = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Check file type first
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Unsupported file type: ${file.type}. Please upload a PDF, DOCX, or TXT file.`);
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size exceeds 10MB limit.');
      }

      // Verify file is not empty
      if (file.size === 0) {
        throw new Error('File appears to be empty.');
      }

      // Try to read a small portion of the file to verify it's readable
      try {
        const testSlice = file.slice(0, 4);
        await testSlice.arrayBuffer();
      } catch (error) {
        console.log(error)
        throw new Error('File appears to be corrupted or unreadable.');
      }

      // Simulate upload progress for UX
      const duration = 1000; // 1 second
      const interval = 50; // Update every 50ms
      const steps = duration / interval;
      let progress = 0;

      const progressInterval = setInterval(() => {
        progress += (100 / steps);
        setUploadProgress(Math.min(progress, 99));
      }, interval);

      // Call the completion handler
      await onUploadComplete(file);
      setUploaded(file); // Track uploaded file
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      // Reset after a brief delay
      setTimeout(() => {
        setUploadProgress(0);
        setIsUploading(false);
      }, 500);

    } catch (error) {
      console.error('File processing error:', error);
      setUploadProgress(0);
      setIsUploading(false);
      throw error instanceof Error ? error : new Error('Failed to process file');
    }
  }, [onUploadComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData('text');
    setPastedText(text);
    onUploadComplete(text); // Trigger upload complete with pasted text
    setUploaded(text); // Track uploaded text
  }, [onUploadComplete]);

  const uploadAreaId = `${type}-upload-area`;
  const fileInputId = `${type}-file-input`;

  return (
    <div
      className={`relative rounded-lg border-2 border-dashed p-6 transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-secondary-200'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      role="region"
      aria-labelledby={uploadAreaId}
    >
      <input
        ref={fileInputRef}
        type="file"
        id={fileInputId}
        className="sr-only"
        accept=".pdf,.doc,.docx"
        onChange={handleFileInput}
        aria-label={`Upload ${type === 'cv' ? 'CV' : 'job description'}`}
      />

      <div className="text-center" id={uploadAreaId}>
        <UploadCloud 
          className="mx-auto h-12 w-12 text-secondary-400" 
          aria-hidden="true"
        />
        
        <div className="mt-4">
          <Button
            onClick={handleButtonClick}
            disabled={isUploading}
            className="relative"
            aria-describedby={`${type}-upload-hint`}
          >
            {isUploading ? 'Uploading...' : 'Select file'}
          </Button>
        </div>

        <p 
          className="mt-2 text-sm text-secondary-600"
          id={`${type}-upload-hint`}
        >
          or drag and drop your {type === 'cv' ? 'CV' : 'job description'} here
        </p>
        
        <p className="mt-1 text-xs text-secondary-500">
          PDF, DOCX, or paste text below
        </p>

        {type === 'jobDescription' && (
          <textarea
            className="mt-4 w-full rounded-md border p-2 text-sm text-secondary-700"
            placeholder="Paste job description here"
            value={pastedText}
            onPaste={handlePaste}
            onChange={(e) => setPastedText(e.target.value)}
            rows={5}
          />
        )}

        {uploaded && (
          <div className="mt-4 rounded bg-secondary-50 p-3 text-left text-sm text-secondary-700 border border-secondary-200">
            {typeof uploaded === 'string' ? (
              <>
                <div className="font-semibold mb-1">Pasted Text:</div>
                <div className="whitespace-pre-line break-words max-h-32 overflow-y-auto text-xs">
                  {uploaded.length > 300 ? `${uploaded.slice(0, 300)}...` : uploaded}
                </div>
              </>
            ) : (
              <>
                <div className="font-semibold mb-1">Uploaded File:</div>
                <div className="flex items-center gap-2">
                  <span className="truncate max-w-xs" title={uploaded.name}>{uploaded.name}</span>
                  <span className="text-secondary-500 text-xs">({(uploaded.size / 1024).toFixed(1)} KB)</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {isUploading && (
        <div 
          className="mt-4 space-y-2"
          role="status"
          aria-label="Upload progress"
        >
          <Progress 
            value={uploadProgress}
            className="h-2"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={uploadProgress}
          />
          <p className="text-xs text-center text-secondary-600">
            {uploadProgress === 100 ? 'Processing...' : 'Uploading...'}
          </p>
        </div>
      )}
    </div>
  );
}