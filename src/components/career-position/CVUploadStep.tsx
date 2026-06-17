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
      if (file.name.endsWith('.pdf') || file.name.endsWith('.docx')) {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/parse-cv', { method: 'POST', body: fd })
        if (!res.ok) throw new Error('Parse failed')
        const data = await res.json()
        text = data.text
      } else {
        text = await file.text()
      }
      if (!text.trim()) {
        setError('Could not extract text from this file. Try a different format.')
        return
      }
      onComplete(text)
    } catch {
      setError('Failed to read file. Try a PDF, DOCX, or plain text file.')
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

        {/* Progress track */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 32 }}>
          <div style={{ flex: 1, height: 2, background: 'var(--foreground)' }} />
          <div style={{ flex: 1, height: 2, background: 'var(--accent-dim)' }} />
        </div>

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--subtle)', marginBottom: 24 }}>
          Step 1 of 2 — Upload CV
        </p>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 400, color: 'var(--foreground)', marginBottom: 8 }}>
          Start with your CV
        </h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32, lineHeight: 1.6 }}>
          We&apos;ll read it once to understand your experience. Nothing is stored.
        </p>

        <div
          {...getRootProps()}
          style={{
            border: `1px dashed var(--accent-dim)`,
            borderRadius: 'var(--radius)',
            padding: '56px 32px',
            textAlign: 'center',
            cursor: uploading ? 'default' : 'pointer',
            background: isDragActive ? 'var(--surface)' : 'transparent',
            transition: 'background 200ms, border-color 200ms',
            borderColor: isDragActive ? 'var(--accent)' : 'var(--accent-dim)',
          }}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <>
              <p style={{ color: 'var(--muted)', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.08em', marginBottom: 4 }}>
                Reading your CV…
              </p>
              <p style={{ color: 'var(--subtle)', fontSize: 12 }}>This takes a second</p>
            </>
          ) : isDragActive ? (
            <p style={{ color: 'var(--foreground)', fontSize: 15 }}>Drop it here</p>
          ) : (
            <>
              <p style={{ color: 'var(--foreground)', fontSize: 15, marginBottom: 8 }}>
                Drop your CV here, or <span style={{ borderBottom: '1px solid var(--accent-dim)' }}>click to browse</span>
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--subtle)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                PDF · DOCX · TXT &nbsp;·&nbsp; Max 10 MB
              </p>
            </>
          )}
        </div>

        {error && (
          <p style={{ color: 'var(--destructive)', fontSize: 13, marginTop: 12 }}>{error}</p>
        )}

        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--subtle)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 32 }}>
          Next — set your target role
        </p>
      </div>
    </div>
  )
}
