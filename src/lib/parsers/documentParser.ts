import mammoth from 'mammoth';
import { MetricsService } from '../metrics/metricsService';
import pdfParse from 'pdf-parse';

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

async function parsePDF(buffer: ArrayBuffer): Promise<ParsedDocument> {
  try {
    const typedArray = new Uint8Array(buffer);
    if (typedArray.length < 4 ||
        String.fromCharCode(typedArray[0], typedArray[1], typedArray[2], typedArray[3]) !== '%PDF') {
      throw new Error('Invalid PDF format');
    }

    // Convert ArrayBuffer to Buffer for pdf-parse
    const data = await pdfParse(Buffer.from(typedArray));
    
    return {
      text: data.text,
      metadata: {
        pageCount: data.numpages,
        author: data.info?.Author,
        title: data.info?.Title,
        creationDate: data.info?.CreationDate ? new Date(data.info.CreationDate) : undefined,
        format: 'application/pdf'
      },
    };
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