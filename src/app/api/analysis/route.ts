import { NextRequest } from 'next/server';
import { DocumentAnalyzer } from '@/lib/nlp/documentAnalyzer';
import { parseDocument } from '@/lib/parsers/documentParser';
import { saveDocument, saveAnalysisResult, DocumentType } from '@/lib/db/documentService';
import { MetricsService } from '@/lib/metrics/metricsService';

export async function POST(request: NextRequest) {
  const metrics = MetricsService.getInstance();
  const startTime = performance.now();
  
  try {
    const formData = await request.formData();
    const cv = formData.get('cv') as File;
    const jobDescription = formData.get('jobDescription') as File;

    if (!cv || !jobDescription) {
      metrics.trackError('analysisErrors');
      return Response.json(
        { error: 'Both CV and job description are required' },
        { status: 400 }
      );
    }

    // Track uploads
    metrics.trackUpload('cv');
    metrics.trackUpload('jobDescription');

    // Track document metrics
    metrics.trackDocument(cv.size, cv.type, true);
    metrics.trackDocument(jobDescription.size, jobDescription.type, true);

    const parseStartTime = performance.now();
    // Parse documents
    const [cvDoc, jobDoc] = await Promise.all([
      parseDocument(cv),
      parseDocument(jobDescription)
    ]);
    metrics.trackParseTime(performance.now() - parseStartTime);

    // Save documents to database
    const dbStartTime = performance.now();
    const [savedCV, savedJobDesc] = await Promise.all([
      saveDocument(cv, DocumentType.CV, cvDoc),
      saveDocument(jobDescription, DocumentType.JobDescription, jobDoc)
    ]);
    metrics.trackApiResponse(performance.now() - dbStartTime);

    // Analyze the match
    const analysisStartTime = performance.now();
    const analyzer = new DocumentAnalyzer();
    const result = await analyzer.analyze(cvDoc.text, jobDoc.text);
    metrics.trackAnalysisTime(performance.now() - analysisStartTime);

    // Save analysis result
    await saveAnalysisResult(savedCV.id, savedJobDesc.id, result);

    // Track analysis metrics
    metrics.trackAnalysis();
    metrics.trackAnalysisResult(result);

    // Track total API response time
    metrics.trackApiResponse(performance.now() - startTime);

    // Check alert conditions
    const { alerts, status } = metrics.checkAlertConditions();
    if (alerts.length > 0) {
      console.warn('Alert conditions detected:', { alerts, status });
    }

    return Response.json({ result });
  } catch (error) {
    console.error('Analysis error:', error);
    metrics.trackError('analysisErrors');
    
    return Response.json(
      { error: 'Failed to analyze documents' },
      { status: 500 }
    );
  }
}