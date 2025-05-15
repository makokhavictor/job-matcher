import mammoth from 'mammoth';
import { MetricsService } from '../metrics/metricsService';
import { PDFDocument } from 'pdf-lib';
import pdfParse from 'pdf-parse'

export interface ParsedDocument {
  text: string;
  metadata?: {
    pageCount?: number;
    title?: string;
    author?: string;
    creationDate?: Date;
    format?: string;
  };
} 

const PDF_PARSE_TIMEOUT = 10000; // 10 seconds
const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB limit for PDFs

async function parsePDF(buffer: ArrayBuffer): Promise<ParsedDocument> {
  try {
    // Check PDF size
    if (buffer.byteLength > MAX_PDF_SIZE) {
      throw new Error('PDF file too large. Maximum size is 10MB.');
    }

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`PDF parsing timed out after ${PDF_PARSE_TIMEOUT/1000} seconds`)), PDF_PARSE_TIMEOUT);
    });

    const parsePromise = async () => {
      // Use pdf-lib for metadata extraction
      const pdfDoc = await PDFDocument.load(buffer, {
        updateMetadata: false,
        ignoreEncryption: true,
      });

      // Use pdf-parse-fork for text extraction with optimized options
      const data = await pdfParse(Buffer.from(buffer), {
        max: 0, // Don't render images
        version: 'v2.0.550',
      });

      console.log('PDF parsing result:', data);

      return {
        text: data.text,
        metadata: {
          pageCount: pdfDoc.getPageCount(),
          title: pdfDoc.getTitle() || undefined,
          author: pdfDoc.getAuthor() || undefined,
          creationDate: pdfDoc.getCreationDate() || undefined,
          format: 'application/pdf'
        },
      };
    };

    return await Promise.race([parsePromise(), timeoutPromise]);
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(
      error instanceof Error
        ? `Failed to parse PDF: ${error.message}`
        : 'Failed to parse PDF document'
    );
  }
}

async function parseDOCX(buffer: ArrayBuffer): Promise<ParsedDocument> {
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return {
    text: result.value,
    metadata: {
      pageCount: undefined, // DOCX doesn't provide page count easily
    },
  };
}

async function parseTXT(buffer: ArrayBuffer): Promise<ParsedDocument> {
  const text = new TextDecoder().decode(buffer);
  return {
    text,
    metadata: {
      pageCount: 1, // Assume single page for text files
    },
  };
}

export async function parseDocument(file: File): Promise<ParsedDocument> {
  const metrics = MetricsService.getInstance();
  const startTime = performance.now();

  try {
    const buffer = await file.arrayBuffer();
    const fileType = file.type;
    let text = '';
    let metadata: ParsedDocument['metadata'] = {};

    switch (fileType) {
      case 'application/pdf':
        const pdfResult = await parsePDF(buffer);
        text = pdfResult.text;
        metadata = pdfResult.metadata || {};
        break;

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        const docxResult = await parseDOCX(buffer);
        text = docxResult.text;
        metadata = docxResult.metadata || {};
        break;

      case 'text/plain':
        const txtResult = await parseTXT(buffer);
        text = txtResult.text;
        metadata = txtResult.metadata || {};
        break;

      default:
        metrics.trackError('parseErrors');
        throw new Error(`Unsupported file format: ${fileType}`);
    }

    // Validate parsed content
    if (!text || text.trim().length === 0) {
      metrics.trackError('parseErrors');
      throw new Error('No text content could be extracted from the document');
    }

    // Track successful parse
    metrics.trackParseTime(performance.now() - startTime);
    metrics.trackDocument(file.size, fileType, true);

    return {
      text,
      metadata: {
        ...metadata,
        format: fileType,
      },
    };
  } catch (error) {
    // Track parse failure
    metrics.trackError('parseErrors');
    metrics.trackDocument(file.size, file.type, false);
    console.error('Document parsing error:', error);
    throw new Error('Failed to parse document. Please check the file format and try again.');
  }
}