import { NextRequest } from 'next/server';
import { parseDocument } from '@/lib/parsers/documentParser';
export const runtime = 'nodejs';
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const parsedDocument = await parseDocument(file);
    
    return Response.json(parsedDocument);
  } catch (error) {
    console.error('Document parsing error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to parse document' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}