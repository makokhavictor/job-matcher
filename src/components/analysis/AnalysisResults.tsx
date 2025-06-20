'use client'

import { Card } from '@/components/ui/card'
import { useAnalysisStore } from '@/stores/analysis.store'

export function AnalysisResults() {
  const { results: parsed, loading, error } = useAnalysisStore()

  // Score color logic
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500 text-white'; // green
    if (score >= 70) return 'bg-blue-500 text-white'; // blue
    if (score >= 50) return 'bg-orange-500 text-white'; // slate
    return 'bg-red-500 text-white'; // fallback for low scores
  }

  if (loading) {
    return <div className="text-primary-700">Loading analysis...</div>
  }
  if (error) {
    return <div className="text-red-600">{error}</div>
  }
  if (!parsed) {
    return <div className="text-secondary-500">No analysis results available.</div>
  }

  return (
    <div className="space-y-6" role="region" aria-label="Analysis Results">
      {/* Match Score */}
      <Card className="p-6 flex flex-col items-center justify-center">
        <div className={`rounded-full px-8 py-4 text-4xl font-bold shadow-lg mb-2 ${getScoreColor(parsed.match_score)}`}
          aria-label="Matching Score">
          {parsed.match_score}% match
        </div>
        <div className="text-secondary-700 text-center text-lg font-medium">
          {parsed.score_breakdown}
        </div>
      </Card>

      {/* Key Matches */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-primary-700 mb-4">Key Matches</h2>
        <ul className="space-y-3">
          {parsed.key_matches?.map((match, i) => (
            <li key={i} className="bg-accent-50 border-l-4 border-accent-500 p-4 rounded">
              <div className="font-semibold text-accent-700">{match.skill}</div>
              <div className="text-secondary-700">{match.explanation}</div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Critical Missing Skills */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-primary-700 mb-4">Critical Missing Skills</h2>
        <ul className="space-y-3">
          {parsed.critical_missing_skills?.map((miss, i) => (
            <li key={i} className="bg-secondary-50 border-l-4 border-primary-500 p-4 rounded">
              <div className="font-semibold text-primary-700">{miss.skill}</div>
              <div className="text-secondary-700 mb-1">{miss.why_important}</div>
              <div className="text-accent-700 italic">{miss.suggestions}</div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Resume Improvements */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-primary-700 mb-4">Resume Improvement Suggestions</h2>
        <ul className="list-disc pl-6 space-y-2">
          {parsed.resume_improvements?.map((tip: string, i: number) => (
            <li key={i} className="text-secondary-700">{tip}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}
