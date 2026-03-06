import { authService } from './auth.service'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL ?? 'http://localhost:8000'

export type CareerTarget = {
  id?: number
  current_role: string
  target_role: string
  target_industry: string
  seniority: string
}

export type CareerPositionResult = {
  id: number
  score: number
  result_data: {
    pivot_readiness_score: number
    score_context: string
    score_breakdown: {
      vocabulary_alignment: number
      skills_transfer: number
      narrative_strength: number
    }
    transferable_skills: Array<{
      your_experience: string
      maps_to: string
      relevance: 'high' | 'medium' | 'low'
    }>
    // Pro fields (may be absent)
    critical_gaps?: Array<{
      skill: string
      why_matters: string
      fastest_path: string
    }>
    entry_points?: Array<{
      role: string
      competitiveness: number
      reasoning: string
    }>
    strongest_narrative?: string
  }
  created_at: string
  target?: CareerTarget
}

export const careerPositionService = {
  async getSavedTarget(): Promise<CareerTarget | null> {
    const auth = authService.getAuthData()
    if (!auth) return null
    const res = await fetch(`${API_URL}/users/career-target`, {
      headers: { Authorization: `Bearer ${auth.access_token}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.target
  },

  async getLatestResult(): Promise<CareerPositionResult | null> {
    const auth = authService.getAuthData()
    if (!auth) return null
    const res = await fetch(`${API_URL}/matcher/career-position/latest`, {
      headers: { Authorization: `Bearer ${auth.access_token}` },
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error('Failed to fetch career position result')
    return res.json()
  },

  async getResult(id: number): Promise<CareerPositionResult> {
    const auth = authService.getAuthData()
    if (!auth) throw new Error('Not authenticated')
    const res = await fetch(`${API_URL}/matcher/career-position/${id}`, {
      headers: { Authorization: `Bearer ${auth.access_token}` },
    })
    if (!res.ok) throw new Error('Career position result not found')
    return res.json()
  },

  /**
   * Enqueue analysis via Next.js API route (returns jobId for SSE polling).
   */
  async enqueueAnalysis(params: {
    cvText: string
    currentRole: string
    targetRole: string
    targetIndustry: string
    seniority: string
    userId: number
    userEmail: string
  }): Promise<string> {
    const auth = authService.getAuthData()
    if (!auth) throw new Error('Not authenticated')
    const formData = new FormData()
    formData.set('cv_text', params.cvText)
    formData.set('current_role', params.currentRole)
    formData.set('target_role', params.targetRole)
    formData.set('target_industry', params.targetIndustry)
    formData.set('seniority', params.seniority)
    formData.set('user_id', String(params.userId))
    formData.set('user_email', params.userEmail)
    const res = await fetch('/api/career-position', {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.access_token}` },
      body: formData,
    })
    if (!res.ok) throw new Error('Failed to enqueue analysis')
    const data = await res.json()
    return data.jobId
  },
}
