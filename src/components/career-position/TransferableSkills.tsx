'use client'
import { useState } from 'react'
import type { CareerPositionResult } from '@/lib/career-position.service'

const RELEVANCE_COLORS = { high: 'var(--success)', medium: 'var(--accent)', low: 'var(--subtle)' }

export function TransferableSkills({ result }: { result: CareerPositionResult }) {
  const skills = result.result_data.transferable_skills
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? skills : skills.slice(0, 2)
  const hidden = skills.length - 2

  return (
    <div style={{ borderTop: '1px solid var(--accent-dim)', paddingTop: 32, marginTop: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--subtle)' }}>
          TRANSFERABLE SKILLS
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>
          {skills.length} found
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {visible.map((skill, i) => (
          <div key={i} style={{ padding: '16px 0', borderBottom: '1px solid var(--surface)' }}>
            <p style={{ fontSize: 14, color: 'var(--foreground)', marginBottom: 6 }}>{skill.your_experience}</p>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>
              → {skill.maps_to}
            </p>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: RELEVANCE_COLORS[skill.relevance],
              border: `1px solid ${RELEVANCE_COLORS[skill.relevance]}`,
              padding: '2px 6px',
            }}>
              {skill.relevance} relevance
            </span>
          </div>
        ))}
      </div>

      {!expanded && hidden > 0 && (
        <button
          onClick={() => setExpanded(true)}
          style={{
            background: 'none',
            border: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.08em',
            color: 'var(--accent)',
            cursor: 'pointer',
            marginTop: 16,
            padding: 0,
          }}
        >
          + {hidden} more skills
        </button>
      )}
    </div>
  )
}
