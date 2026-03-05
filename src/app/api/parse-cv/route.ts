import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  if (file.name.endsWith('.pdf')) {
    const pdfParse = (await import('pdf-parse-fork')).default
    const parsed = await pdfParse(buffer)
    return NextResponse.json({ text: parsed.text })
  }

  if (file.name.endsWith('.docx')) {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    return NextResponse.json({ text: result.value })
  }

  // Plain text
  return NextResponse.json({ text: buffer.toString('utf-8') })
}
