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
import { useJobsStore } from '@/stores/jobs.store';
import { CvTemplate } from './CvTemplate';
import { Loader2 } from 'lucide-react';

export function AnalysisResults() {
  const { results: parsed, loading, error, currentAnalysis } = useAnalysisStore()
  const { user } = useAuth()
  const { tailorCv, tailoredCv, loading: tailoringLoading, error: tailoringError, tailoringJobId } = useTailorCv();
  const tailoringJob = useJobsStore((state) => tailoringJobId ? state.jobs.get(tailoringJobId) : undefined);

  const existingTailoredCv = parsed?.tailored_cv

  const hasAdvancedMatchScoring = user?.subscription?.plan?.features?.advanced_match_scoring
  const hasTailoredImprovementSuggestions = user?.subscription?.plan?.features?.tailored_improvement_suggestions
  const hasTailoredCv = user?.subscription?.plan?.features?.generate_tailored_cv

  const getScorestyling = (score: number) => {
    if (score >= 90) return {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800/50',
      accent: 'bg-emerald-500 dark:bg-emerald-400',
      sectionBg: 'bg-emerald-50 dark:bg-emerald-950/20',
      sectionBorder: 'border-emerald-200 dark:border-emerald-800/50',
      sectionText: 'text-emerald-800 dark:text-emerald-300',
      label: 'Excellent Match'
    }
    if (score >= 70) return {
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-800 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800/50',
      accent: 'bg-blue-500 dark:bg-blue-400',
      sectionBg: 'bg-blue-50 dark:bg-blue-950/20',
      sectionBorder: 'border-blue-200 dark:border-blue-800/50',
      sectionText: 'text-blue-800 dark:text-blue-300',
      label: 'Good Match'
    }
    if (score >= 50) return {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800/50',
      accent: 'bg-amber-500 dark:bg-amber-400',
      sectionBg: 'bg-amber-50 dark:bg-amber-950/20',
      sectionBorder: 'border-amber-200 dark:border-amber-800/50',
      sectionText: 'text-amber-800 dark:text-amber-300',
      label: 'Fair Match'
    }
    return {
      bg: 'bg-red-50 dark:bg-red-950/30',
      text: 'text-red-800 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800/50',
      accent: 'bg-red-500 dark:bg-red-400',
      sectionBg: 'bg-red-50 dark:bg-red-950/20',
      sectionBorder: 'border-red-200 dark:border-red-800/50',
      sectionText: 'text-red-800 dark:text-red-300',
      label: 'Needs Improvement'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Card className="p-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-32 h-16 bg-muted rounded-full"></div>
            <div className="w-48 h-4 bg-muted rounded"></div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="w-32 h-6 bg-muted rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted/60 rounded"></div>
            ))}
          </div>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-6 border-destructive/30 bg-destructive/5">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-destructive rounded-full"></div>
          <div className="text-destructive font-medium">Analysis Error</div>
        </div>
        <div className="text-destructive/80 mt-2">{error}</div>
      </Card>
    )
  }

  if (!parsed) {
    return (
      <Card className="p-8 text-center border-dashed border-border">
        <div className="text-muted-foreground text-lg">No analysis results available</div>
        <div className="text-muted-foreground/70 text-sm mt-2">Upload a resume and job description to get started</div>
      </Card>
    )
  }

  const scoreStyle = getScorestyling(parsed.match_score)

  const renderLockedContent = () => (
    <Card className="p-6 text-center border-dashed border-border mt-4">
      <div className="flex flex-col items-center gap-4">
        <Lock className="w-12 h-12 text-muted-foreground" />
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
      {/* Match Score Card */}
      <Card className={`p-8 ${scoreStyle.bg} ${scoreStyle.border} border-2`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className={`${scoreStyle.accent} size-24 rounded-full flex items-center justify-center shadow-sm`}>
              <span className="text-white dark:text-gray-900 text-2xl font-bold tabular-nums">{parsed.match_score}%</span>
            </div>
            <div className="absolute -bottom-2 -right-2 size-6 bg-card rounded-full flex items-center justify-center shadow-sm">
              <div className={`size-3 ${scoreStyle.accent} rounded-full`}></div>
            </div>
          </div>
          <div className="text-center">
            <div className={`${scoreStyle.text} text-xl font-semibold mb-1 text-balance`}>
              {scoreStyle.label}
            </div>
            <div className="text-muted-foreground max-w-md text-pretty">
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
          <Card className="p-6 border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 mt-4">
            <div className="flex items-center space-x-3 mb-6">
              <div className="size-6 bg-emerald-500 dark:bg-emerald-400 rounded-full flex items-center justify-center">
                <div className="size-3 bg-white rounded-full"></div>
              </div>
              <h2 className="text-xl font-semibold text-emerald-800 dark:text-emerald-300 text-balance">Key Matches</h2>
            </div>
            <div className="grid gap-4">
              {parsed.key_matches?.map((match, i) => (
                <div key={i} className="bg-card p-5 rounded-lg border border-emerald-200 dark:border-emerald-800/40 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-semibold text-emerald-800 dark:text-emerald-300 text-lg mb-2">{match.skill}</div>
                      <div className="text-foreground leading-relaxed">{match.explanation}</div>
                    </div>
                    <div className="ml-4 w-2 h-2 bg-emerald-400 dark:bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="full-match">
          {hasAdvancedMatchScoring ? (
            <Card className="p-6 border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-950/20 mt-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="size-6 bg-amber-500 dark:bg-amber-400 rounded-full flex items-center justify-center">
                  <div className="size-3 bg-white rounded-full"></div>
                </div>
                <h2 className="text-xl font-semibold text-amber-800 dark:text-amber-300 text-balance">Critical Missing Skills</h2>
              </div>
              <div className="grid gap-4">
                {parsed.critical_missing_skills?.map((miss, i) => (
                  <div key={i} className="bg-card p-5 rounded-lg border border-amber-200 dark:border-amber-800/40 hover:shadow-sm transition-shadow">
                    <div className="space-y-3">
                      <div className="font-semibold text-amber-800 dark:text-amber-300 text-lg">{miss.skill}</div>
                      <div className="text-foreground leading-relaxed">{miss.why_important}</div>
                      <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded border-l-4 border-blue-400 dark:border-blue-600">
                        <div className="text-blue-800 dark:text-blue-300 font-medium text-sm mb-1">Suggestion:</div>
                        <div className="text-blue-700 dark:text-blue-400">{miss.suggestions}</div>
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
            <Card className="p-6 border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/20 mt-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="size-6 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center">
                  <div className="size-3 bg-white rounded-full"></div>
                </div>
                <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 text-balance">Resume Improvement Suggestions</h2>
              </div>
              <div className="space-y-3">
                {parsed.resume_improvements?.map((tip: string, i: number) => (
                  <div key={i} className="bg-card p-4 rounded-lg border border-blue-200 dark:border-blue-800/40 flex items-start space-x-3">
                    <div className="size-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-blue-600 dark:text-blue-400 text-xs font-bold">{i + 1}</span>
                    </div>
                    <div className="text-foreground leading-relaxed">{tip}</div>
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
                <Card className="p-6 border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex items-center space-x-3">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500 dark:text-blue-400 shrink-0" />
                    <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 text-balance">
                      {tailoringJob?.status === 'pending' ? 'Job queued…' : 'Tailoring CV…'}
                    </h2>
                  </div>
                  <p className="text-muted-foreground mt-2 text-pretty">
                    {tailoringJob?.status === 'pending'
                      ? 'Your tailoring job is queued and will start shortly.'
                      : 'Please wait while we tailor your CV to the job description.'}
                  </p>
                </Card>
              )}
              {tailoringError && (
                <Card className="p-6 border-destructive/30 bg-destructive/5">
                  <div className="flex items-center space-x-3">
                    <div className="size-6 bg-destructive rounded-full flex items-center justify-center">
                      <div className="size-3 bg-white rounded-full"></div>
                    </div>
                    <h2 className="text-xl font-semibold text-destructive">Error</h2>
                  </div>
                  <p className="text-destructive/80 mt-2">{tailoringError}</p>
                </Card>
              )}
              {existingTailoredCv && (
                <CvTemplate tailored_cv={existingTailoredCv} />
              )}
              {!existingTailoredCv && tailoredCv?.results?.tailored_cv && (
                <CvTemplate tailored_cv={tailoredCv.results.tailored_cv} />
              )}
              {!existingTailoredCv && !tailoredCv?.results?.tailored_cv && !tailoringLoading && (
                <Card className="p-6 border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="size-6 bg-blue-500 dark:bg-blue-400 rounded-full flex items-center justify-center">
                      <div className="size-3 bg-white rounded-full"></div>
                    </div>
                    <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 text-balance">Tailored CV</h2>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4 text-pretty">Generate a tailored CV optimized for this job description</p>
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
