const BASE_STYLE = `
  font-family: 'DM Mono', 'Courier New', monospace;
  background: #F4EFE6;
  color: #1C1917;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 24px;
`

export function resultReadyTemplate(params: {
  name: string
  score: number
  targetRole: string
  reportUrl: string
}): { html: string; text: string } {
  const html = `
<div style="${BASE_STYLE}">
  <p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#A09690;">CAREER POSITION</p>
  <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;margin:8px 0 24px;">Your report is ready</h1>
  <div style="border-top:1px solid #D6C9B8;border-bottom:1px solid #D6C9B8;padding:24px 0;margin:24px 0;">
    <p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#A09690;">FITTED READINESS SCORE</p>
    <p style="font-size:72px;font-family:'DM Mono',monospace;font-weight:400;margin:8px 0;color:#1C1917;">${params.score}</p>
    <p style="color:#6B6460;">Your position for ${params.targetRole}</p>
  </div>
  <a href="${params.reportUrl}" style="display:inline-block;background:#1C1917;color:#F4EFE6;padding:12px 24px;text-decoration:none;font-size:13px;letter-spacing:0.08em;">VIEW YOUR FULL REPORT →</a>
  <p style="margin-top:40px;font-size:12px;color:#A09690;">You're receiving this because you ran a career position analysis.</p>
</div>`
  const text = `Your Career Position Report is ready.\n\nFitted Readiness Score: ${params.score}\n\nView your report: ${params.reportUrl}`
  return { html, text }
}

export function welcomeTemplate(params: {
  name: string
  dashboardUrl: string
}): { html: string; text: string } {
  const html = `
<div style="${BASE_STYLE}">
  <p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#A09690;">WELCOME</p>
  <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;margin:8px 0 24px;">Hi ${params.name},</h1>
  <p style="line-height:1.7;color:#6B6460;">Your Career Position score tells you how competitive you are for the roles you actually want — and what to do about it.</p>
  <p style="line-height:1.7;color:#6B6460;">Run your first analysis in 60 seconds.</p>
  <a href="${params.dashboardUrl}" style="display:inline-block;background:#1C1917;color:#F4EFE6;padding:12px 24px;text-decoration:none;font-size:13px;letter-spacing:0.08em;margin-top:16px;">ANALYZE MY POSITION →</a>
</div>`
  const text = `Welcome, ${params.name}!\n\nRun your first career position analysis: ${params.dashboardUrl}`
  return { html, text }
}

export function weeklyDigestTemplate(params: {
  name: string
  score: number
  previousScore: number | null
  targetRole: string
  actions: string[]
  reportUrl: string
}): { html: string; text: string } {
  const delta = params.previousScore != null ? params.score - params.previousScore : null
  const deltaStr = delta != null ? (delta >= 0 ? `↑ ${delta} from last week` : `↓ ${Math.abs(delta)} from last week`) : ''
  const actionsHtml = params.actions.map((a, i) => `<li style="margin-bottom:8px;">${i + 1}. ${a}</li>`).join('')
  const html = `
<div style="${BASE_STYLE}">
  <p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#A09690;">WEEKLY UPDATE</p>
  <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;margin:8px 0;">Your career position this week</h1>
  <div style="border-top:1px solid #D6C9B8;padding:24px 0;margin:24px 0;">
    <p style="font-size:72px;font-family:'DM Mono',monospace;font-weight:400;margin:0;color:#1C1917;">${params.score}</p>
    ${deltaStr ? `<p style="color:#5C8A6E;font-size:13px;">${deltaStr}</p>` : ''}
    <p style="color:#6B6460;">${params.targetRole}</p>
  </div>
  <p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#A09690;margin-bottom:12px;">THIS WEEK'S FOCUS</p>
  <ol style="padding-left:0;list-style:none;line-height:1.7;">${actionsHtml}</ol>
  <a href="${params.reportUrl}" style="display:inline-block;background:#1C1917;color:#F4EFE6;padding:12px 24px;text-decoration:none;font-size:13px;letter-spacing:0.08em;margin-top:24px;">VIEW FULL REPORT →</a>
</div>`
  const text = `Your career position this week: ${params.score}\n\n${deltaStr}\n\nThis week's focus:\n${params.actions.join('\n')}\n\nFull report: ${params.reportUrl}`
  return { html, text }
}
