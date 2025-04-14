import { type ParsedDocument } from '../parsers/documentParser';
import { AnalysisResult } from '../nlp/documentAnalyzer';
import { MetricsService } from '../metrics/metricsService';
import { PrismaClient } from '@/generated/prisma';


// Reuse a single PrismaClient instance to avoid connection issues
const prisma = new PrismaClient();

export enum DocumentType {
  CV = 'cv',
  JobDescription = 'jobDescription',
}

// Helper functions to prepare data for API calls
export function prepareSaveDocumentPayload(
  file: File,
  type: DocumentType,
  parsedDocument: ParsedDocument
) {
  return {
    type,
    content: parsedDocument.text,
    filename: file.name,
    fileType: file.type,
    metadata: parsedDocument.metadata || {},
  };
}

export function prepareSaveAnalysisResultPayload(
  cvId: string,
  jobDescriptionId: string,
  result: AnalysisResult
) {
  return {
    score: result.score,
    matchedSkills: result.matches.skills,
    matchedKeywords: result.matches.keywords,
    missingSkills: result.missing.skills,
    suggestions: result.suggestions,
    cvId,
    jobDescriptionId,
  };
}

export async function saveDocument(
  file: File,
  type: DocumentType,
  parsedDocument: ParsedDocument
) {
  const metrics = MetricsService.getInstance();
  const startTime = performance.now();
  try {
    const result = await prisma.document.create({
      data: prepareSaveDocumentPayload(file, type, parsedDocument),
    });

    metrics.trackApiResponse(performance.now() - startTime);
    return result;
  } catch (error) {
    metrics.trackError('dbErrors');
    throw error;
  }
}

export async function saveAnalysisResult(
  cvId: string,
  jobDescriptionId: string,
  result: AnalysisResult
) {
  const metrics = MetricsService.getInstance();
  const startTime = performance.now();
  try {
    const savedResult = await prisma.analysisResult.create({
      data: prepareSaveAnalysisResultPayload(cvId, jobDescriptionId, result),
    });

    metrics.trackApiResponse(performance.now() - startTime);
    return savedResult;
  } catch (error) {
    metrics.trackError('dbErrors');
    throw error;
  }
}

export async function getRecentAnalyses(limit = 5) {
  const metrics = MetricsService.getInstance();
  const startTime = performance.now();
  try {
    const results = await prisma.analysisResult.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        cv: true,
        jobDescription: true,
      },
    });

    metrics.trackApiResponse(performance.now() - startTime);
    return results;
  } catch (error) {
    metrics.trackError('dbErrors');
    throw error;
  }
}

export async function getDocumentById(id: string) {
  return prisma.document.findUnique({
    where: { id },
  });
}