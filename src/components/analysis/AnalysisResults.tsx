'use client'

import { 
  Card, 
  CardDescription, 
  CardTitle 
} from '@/components/ui/card'
import { useAnalysisStore } from '@/stores/analysis.store'
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs'
import { useAuth } from '@/app/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'
import Link from 'next/link'

import { useTailorCv } from '@/hooks/useTailorCv';
import { CvTemplate } from './CvTemplate';

export function AnalysisResults() {
  const { results: parsed, loading, error, currentAnalysis } = useAnalysisStore()
  const { user } = useAuth()
  const { tailorCv, tailoredCv, loading: tailoringLoading, error: tailoringError } = useTailorCv();

  // Check if we have an existing tailored CV from analysis history
  const existingTailoredCv = parsed?.tailored_cv

  const hasAdvancedMatchScoring = user?.subscription?.plan?.features?.advanced_match_scoring
  const hasTailoredImprovementSuggestions = user?.subscription?.plan?.features?.tailored_improvement_suggestions
  const hasTailoredCv = user?.subscription?.plan?.features?.generate_tailored_cv

  // Enhanced score color and styling logic
  const getScorestyling = (score: number) => {
    if (score >= 90) return {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      accent: 'bg-emerald-500'
    }
    if (score >= 70) return {
      bg: 'bg-blue-100',
      text: 'text-blue-800', 
      border: 'border-blue-200',
      accent: 'bg-blue-500'
    }
    if (score >= 50) return {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-200', 
      accent: 'bg-amber-500'
    }
    return {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      accent: 'bg-red-500'
    }
  }

  // Loading state with better visual feedback
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-16 bg-gray-200 rounded-full"></div>
            <div className="w-48 h-4 bg-gray-200 rounded"></div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="w-32 h-6 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <div className="text-red-700 font-medium">Analysis Error</div>
        </div>
        <div className="text-red-600 mt-2">{error}</div>
      </Card>
    )
  }

  if (!parsed) {
    return (
      <Card className="p-8 text-center border-dashed border-gray-300">
        <div className="text-gray-400 text-lg">No analysis results available</div>
        <div className="text-gray-500 text-sm mt-2">Upload a resume and job description to get started</div>
      </Card>
    )
  }

  const scoreStyle = getScorestyling(parsed.match_score)

  const renderLockedContent = () => (
    <Card className="p-6 text-center border-dashed border-gray-300 mt-4">
      <div className="flex flex-col items-center gap-4">
        <Lock className="w-12 h-12 text-gray-400" />
        <CardTitle>Available on Pro Plan</CardTitle>
        <CardDescription>Upgrade to unlock this feature and get a more detailed analysis.</CardDescription>
        <Link href="/dashboard/packages/upgrade">
          <Button>Upgrade</Button>
        </Link>
      </div>
    </Card>
  )

  return (
    <div className="space-y-6" role="region" aria-label="Analysis Results">
      {/* Enhanced Match Score Card */}
      <Card className={`p-8 ${scoreStyle.bg} ${scoreStyle.border} border-2`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className={`${scoreStyle.accent} w-24 h-24 rounded-full flex items-center justify-center shadow-sm`}>
              <span className="text-white text-2xl font-bold">{parsed.match_score}%</span>
            </div>
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
              <div className={`w-3 h-3 ${scoreStyle.accent} rounded-full`}></div>
            </div>
          </div>
          <div className="text-center">
            <div className={`${scoreStyle.text} text-xl font-semibold mb-1`}>
              {parsed.match_score >= 90 ? 'Excellent Match' : 
               parsed.match_score >= 70 ? 'Good Match' :
               parsed.match_score >= 50 ? 'Fair Match' : 'Needs Improvement'}
            </div>
            <div className="text-gray-600 max-w-md">
              {parsed.score_breakdown}
            </div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="summary" className="w-full">
        <TabsList className={'grid w-full grid-cols-4'}>
          <TabsTrigger value="summary">Key Matches</TabsTrigger>
          <TabsTrigger value="full-match">
            Critical Missing Skills
            {!hasAdvancedMatchScoring && <Lock className="w-4 h-4 ml-2" />}
          </TabsTrigger>
          <TabsTrigger value="semantic-match">
            Resume Improvements
            {!hasTailoredImprovementSuggestions && <Lock className="w-4 h-4 ml-2" />}
          </TabsTrigger>
          <TabsTrigger value="tailored-cv">
            Tailored CV
            {!hasTailoredCv && <Lock className="w-4 h-4 ml-2" />}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <Card className="p-6 border-emerald-200 bg-emerald-50 mt-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <h2 className="text-xl font-semibold text-emerald-800">Key Matches</h2>
            </div>
            
            <div className="grid gap-4">
              {parsed.key_matches?.map((match, i) => (
                <div key={i} className="bg-white p-5 rounded-lg border border-emerald-200 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-emerald-800 text-lg mb-2">{match.skill}</div>
                      <div className="text-gray-700 leading-relaxed">{match.explanation}</div>
                    </div>
                    <div className="ml-4 w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="full-match">
          {hasAdvancedMatchScoring ? (
            <Card className="p-6 border-amber-200 bg-amber-50 mt-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <h2 className="text-xl font-semibold text-amber-800">Critical Missing Skills</h2>
              </div>
              
              <div className="grid gap-4">
                {parsed.critical_missing_skills?.map((miss, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg border border-amber-200 hover:shadow-sm transition-shadow">
                    <div className="space-y-3">
                      <div className="font-semibold text-amber-800 text-lg">{miss.skill}</div>
                      <div className="text-gray-700 leading-relaxed">{miss.why_important}</div>
                      <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                        <div className="text-blue-800 font-medium text-sm mb-1">Suggestion:</div>
                        <div className="text-blue-700">{miss.suggestions}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ) : renderLockedContent()}
        </TabsContent>
        <TabsContent value="semantic-match">
          {hasTailoredImprovementSuggestions ? (
            <Card className="p-6 border-blue-200 bg-blue-50 mt-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <h2 className="text-xl font-semibold text-blue-800">Resume Improvement Suggestions</h2>
              </div>
              
              <div className="space-y-3">
                {parsed.resume_improvements?.map((tip: string, i: number) => (
                  <div key={i} className="bg-white p-4 rounded-lg border border-blue-200 flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 text-xs font-bold">{i + 1}</span>
                    </div>
                    <div className="text-gray-700 leading-relaxed">{tip}</div>
                  </div>
                ))}
              </div>
            </Card>
          ) : renderLockedContent()}
        </TabsContent>
        <TabsContent value="tailored-cv">
          {hasTailoredCv ? (
            <div className="mt-4">
              {tailoringLoading && (
                <Card className="p-6 border-blue-200 bg-blue-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <h2 className="text-xl font-semibold text-blue-800">Tailoring CV...</h2>
                  </div>
                  <p className="text-gray-600 mt-2">Please wait while we tailor your CV to the job description.</p>
                </Card>
              )}
              {tailoringError && (
                <Card className="p-6 border-red-200 bg-red-50">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <h2 className="text-xl font-semibold text-red-800">Error</h2>
                  </div>
                  <p className="text-red-600 mt-2">{tailoringError}</p>
                </Card>
              )}
              {/* Show existing tailored CV from analysis history if available */}
              {existingTailoredCv && (
                <CvTemplate tailored_cv={existingTailoredCv} />
              )}
              
              {/* Show newly generated tailored CV if available */}
              {!existingTailoredCv && tailoredCv?.results?.tailored_cv && (
                <CvTemplate tailored_cv={tailoredCv.results.tailored_cv} />
              )}
              
              {/* Show generate button if no tailored CV exists yet */}
              {!existingTailoredCv && !tailoredCv?.results?.tailored_cv && !tailoringLoading && (
                <Card className="p-6 border-blue-200 bg-blue-50">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <h2 className="text-xl font-semibold text-blue-800">Tailored CV</h2>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Generate a tailored CV optimized for this job description</p>
                    <Button onClick={() => tailorCv(
                      currentAnalysis?.input_data?.cv_content,
                      currentAnalysis?.input_data?.job_content
                    )} size="lg">Tailor CV</Button>
                  </div>
                </Card>
              )}
            </div>
          ) : renderLockedContent()}
        </TabsContent>
      </Tabs>
    </div>
  )
}