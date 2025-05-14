declare module 'pdf-parse-fork' {
  interface PDFParseOptions {
    version?: string;
    max?: number;
    disableFontFace?: boolean;
    verbosity?: number;
  }

  interface PDFParseResult {
    text: string;
    numpages: number;
    info: {
      Author?: string;
      Title?: string;
      CreationDate?: string;
      [key: string]: string | undefined;
    };
    metadata: Record<string, string | number | boolean | null | undefined>;
    version?: string;
  }

  function pdfParse(dataBuffer: Buffer | Uint8Array, options?: PDFParseOptions): Promise<PDFParseResult>;
  
  export = pdfParse;
}