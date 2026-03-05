'use client'
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

interface Props {
  onComplete: (cvText: string) => void
}

export function CVUploadStep({ onComplete }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      let text = ''
      if (file.name.endsWith('.pdf')) {
        const { default: pdfParse } = await import('pdf-parse-fork')
        const buffer = await file.arrayBuffer()
        const parsed = await pdfParse(Buffer.from(buffer))
        text = parsed.text
      } else if (file.name.endsWith('.docx')) {
        const mammoth = await import('mammoth')
        const buffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer: buffer })
        text = result.value
      } else {
        text = await file.text()
      }
      if (!text.trim()) {
        setError('Could not extract text from this file. Try a different format.')
        return
      }
      onComplete(text)
    } catch {
      setError('Failed to read file. Try uploading a different format.')
    } finally {
      setUploading(false)
    }
  }, [onComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  })

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--subtle)', marginBottom: 8 }}>
          STEP 1 OF 2
        </p>
        <div style={{ width: 32, height: 1, background: 'var(--accent-dim)', marginBottom: 24 }} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, color: 'var(--foreground)', marginBottom: 32 }}>
          Upload your CV
        </h1>

        <div
          {...getRootProps()}
          style={{
            border: `1px dashed var(--accent-dim)`,
            borderRadius: 'var(--radius)',
            padding: '48px 32px',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragActive ? 'var(--surface)' : 'transparent',
            transition: 'background 200ms',
          }}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>Reading file...</p>
          ) : (
            <>
              <p style={{ color: 'var(--foreground)', marginBottom: 8 }}>
                {isDragActive ? 'Drop your CV here' : 'Drop your CV here, or click to browse'}
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--subtle)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                PDF, DOCX, or TXT · Max 10MB
              </p>
            </>
          )}
        </div>

        {error && (
          <p style={{ color: 'var(--destructive)', fontSize: 13, marginTop: 12 }}>{error}</p>
        )}

        <div style={{ marginTop: 32, borderTop: '1px solid var(--accent-dim)', paddingTop: 24 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--subtle)', marginBottom: 8 }}>
            WHY WE NEED THIS
          </p>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
            We read your CV once to extract your experience. We do not store or share it.
          </p>
        </div>
      </div>
    </div>
  )
}
