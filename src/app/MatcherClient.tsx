'use client';

import { useState, useEffect, useCallback } from 'react';
import { FileUpload } from "@/components/upload/FileUpload";
import { AnalysisResults } from "@/components/analysis/AnalysisResults";
import { Card } from "@/components/ui/card";
import type { ParsedDocument } from "@/lib/parsers/documentParser";
import { DocumentAnalyzer, type AnalysisResult } from "@/lib/nlp/documentAnalyzer";
import { prepareSaveDocumentPayload, prepareSaveAnalysisResultPayload, DocumentType } from "@/lib/db/documentService";
import { MetricsService } from "@/lib/metrics/metricsService";
import { toast } from "sonner";
import { setupDOMPolyfills } from '@/lib/domPolyfills';

// Initialize polyfills
setupDOMPolyfills();

interface UploadState {
  cv: File | string | null;
  jobDescription: File | string | null;
}

interface Analysis {
  id: string;
  score: number;
  createdAt: Date;
  cv: {
    id: string;
    filename: string;
  };
  jobDescription: {
    id: string;
    filename: string;
  };
}

interface AnalysisError extends Error {
  code?: string;
  details?: string;
}

export function MatcherClient() {
  const [uploadState, setUploadState] = useState<UploadState>({
    cv: null,
    jobDescription: null,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<Analysis[]>([]);
  const [sessionStartTime] = useState<number>(Date.now());
  const [uploadsThisSession, setUploadsThisSession] = useState<number>(0);
  
  const analyzer = new DocumentAnalyzer();
  const metrics = MetricsService.getInstance();

  const loadRecentAnalyses = useCallback(async () => {
    try {
      const response = await fetch('/api/analyses');
      const analyses = await response.json();
      setRecentAnalyses(analyses);
      if (analyses.length > 0) {
        metrics.getUserEngagementMetrics().recentAnalysesViewRate++;
      }
    } catch (error) {
      console.error('Error loading recent analyses:', error);
      metrics.trackError('dbErrors');
    }
  }, [metrics]);

  useEffect(() => {
    const initializeSession = () => {
      // Load recent analyses on component mount
      loadRecentAnalyses();

      // Track session start
      const lastSessionTime = localStorage.getItem('lastSessionTime');
      if (lastSessionTime) {
        const isReturn = (Date.now() - parseInt(lastSessionTime)) > 24 * 60 * 60 * 1000;
        if (isReturn) {
          metrics.getUserEngagementMetrics().returnRate++;
        }
      }
      localStorage.setItem('lastSessionTime', Date.now().toString());
    };

    initializeSession();

    // Cleanup on unmount
    return () => {
      // Track session duration
      const sessionDuration = (Date.now() - sessionStartTime) / 1000; // in seconds
      metrics.getUserEngagementMetrics().averageTimeSpent = 
        (metrics.getUserEngagementMetrics().averageTimeSpent + sessionDuration) / 2;
    };
  }, [loadRecentAnalyses, metrics, sessionStartTime]);

  const handleFileUpload = async (type: keyof UploadState, fileOrText: File | string) => {
    const uploadStartTime = performance.now();
    try {
      setUploadsThisSession((prev) => prev + 1);
      metrics.getUserEngagementMetrics().uploadsPerSession = uploadsThisSession + 1;

      if (typeof fileOrText === 'string') {
        // Handle pasted text
        if (fileOrText.trim() === '') {
          throw new Error('Pasted text is empty.');
        }
        setUploadState((prev) => ({ ...prev, [type]: fileOrText }));
        console.log('Text uploaded:', type, fileOrText);
      } else {
        // Validate file size (10MB limit as per PRD)
        if (fileOrText.size > 10 * 1024 * 1024) {
          metrics.trackError('uploadErrors');
          throw new Error('File size exceeds 10MB limit');
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(fileOrText.type)) {
          metrics.trackError('uploadErrors');
          throw new Error('Invalid file type. Please upload PDF or DOCX files only.');
        }

        setUploadState((prev) => ({ ...prev, [type]: fileOrText }));
        metrics.trackUpload(type);
        metrics.trackDocument(fileOrText.size, fileOrText.type, true);
        metrics.trackApiResponse(performance.now() - uploadStartTime);
        console.log('File uploaded:', type, uploadState);
      }

      // If both inputs are provided, trigger analysis
      if (
        (type === 'cv' && uploadState.jobDescription) ||
        (type === 'jobDescription' && uploadState.cv)
      ) {
        await runAnalysis(
          type === 'cv' ? fileOrText : uploadState.cv!,
          type === 'jobDescription' ? fileOrText : uploadState.jobDescription!
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error processing input';
      console.error('Upload error:', error);
      metrics.trackError('uploadErrors');
      toast.error(message);
    }
  };

  const runAnalysis = async (cv: File | string, jobDescription: File | string) => {
    const analysisStartTime = performance.now();
    try {
      setIsAnalyzing(true);
      toast.info('Analyzing documents...');

      // Add timeout for analysis (5 seconds as per PRD)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          metrics.trackError('timeoutErrors');
          reject(new Error('Analysis timeout'));
        }, 5000);
      });

      // Parse both documents with timeout
      const parsePromises = [cv, jobDescription].map(async (input) => {
        if (typeof input === 'string') {
          return { text: input }; // Mock parsed document for text input
        }

        const formData = new FormData();
        formData.append('file', input);
        
        const response = await fetch('/api/documents/parse', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to parse document');
        }
        
        return response.json();
      });

      const [cvDoc, jobDoc] = await Promise.race([
        Promise.all(parsePromises),
        timeoutPromise
      ]) as [ParsedDocument, ParsedDocument];

      // Save documents via API
      const [cvPayload, jobDescPayload] = [
        prepareSaveDocumentPayload(cv, DocumentType.CV, cvDoc),
        prepareSaveDocumentPayload(jobDescription, DocumentType.JobDescription, jobDoc),
      ];
      const [savedCV, savedJobDesc] = await Promise.all([
        fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cvPayload),
        }).then((res) => res.json()),
        fetch('/api/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jobDescPayload),
        }).then((res) => res.json()),
      ]);

      // Analyze the match
      const result = await analyzer.analyze(cvDoc.text, jobDoc.text);

      // Save analysis result via API
      const analysisPayload = prepareSaveAnalysisResultPayload(savedCV.id, savedJobDesc.id, result);
      await fetch('/api/analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisPayload),
      });

      setAnalysisResult(result);
      await loadRecentAnalyses();

      // Track analysis completion
      metrics.trackAnalysis();
      metrics.trackAnalysisResult(result);
      metrics.getUserEngagementMetrics().analysisCompletionRate++;
      metrics.trackAnalysisTime(performance.now() - analysisStartTime);

      toast.success('Analysis complete!');
    } catch (error) {
      const analysisError = error as AnalysisError;
      console.error('Analysis error:', analysisError);
      
      let errorMessage = 'Error analyzing documents';
      if (analysisError.code === 'TIMEOUT') {
        metrics.trackError('timeoutErrors');
        errorMessage = 'Analysis took too long. Please try again.';
      } else if (analysisError.code === 'PARSE_ERROR') {
        metrics.trackError('parseErrors');
        errorMessage = 'Could not read the document. Please check the file format.';
      } else {
        metrics.trackError('analysisErrors');
      }
      
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-secondary-800">Upload Documents</h2>
        
        <Card className="p-6">
          <h3 className="text-lg font-medium text-secondary-800 mb-4">Your CV</h3>
          <FileUpload 
            type="cv"
            onUploadComplete={(file) => handleFileUpload('cv', file)}
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-medium text-secondary-800 mb-4">Job Description</h3>
          <FileUpload 
            type="jobDescription"
            onUploadComplete={(file) => handleFileUpload('jobDescription', file)}
          />
        </Card>

        {recentAnalyses.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-medium text-secondary-800 mb-4">Recent Analyses</h3>
            <div className="space-y-4">
              {recentAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-secondary-800">
                      {analysis.cv.filename} ↔ {analysis.jobDescription.filename}
                    </p>
                    <p className="text-xs text-secondary-500">
                      {new Date(analysis.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-primary">
                    {analysis.score}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-secondary-800">Analysis Results</h2>
        <div className="h-[calc(100vh-16rem)] overflow-y-auto pr-4">
          {isAnalyzing ? (
            <Card className="p-6">
              <div className="text-center text-secondary-600">
                <p>Analyzing your documents...</p>
              </div>
            </Card>
          ) : analysisResult ? (
            <AnalysisResults result={analysisResult} />
          ) : (
            <Card className="p-6">
              <div className="text-center text-secondary-600">
                <p>Upload your CV and a job description to see the analysis results.</p>
              </div>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}