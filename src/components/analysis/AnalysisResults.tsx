'use client';

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import type { AnalysisResult } from "@/lib/nlp/documentAnalyzer";
import { useCallback } from "react";

type AnalysisResultsProps = {
  result: AnalysisResult;
};

export function AnalysisResults({ result }: AnalysisResultsProps) {
  const getAriaLabel = useCallback((score: number) => {
    if (score >= 80) return 'Excellent match';
    if (score >= 60) return 'Good match';
    if (score >= 40) return 'Fair match';
    return 'Poor match';
  }, []);

  return (
    <div className="space-y-6" role="region" aria-label="Analysis Results">
      {/* Overall Score Card */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4" id="match-score">Match Score</h2>
        <div className="space-y-4">
          <div role="presentation" aria-hidden="true">
            <Progress 
              value={result.score} 
              className="h-3" 
              aria-labelledby="match-score"
            />
          </div>
          <p 
            className="text-4xl font-bold text-primary"
            role="status"
            aria-live="polite"
            aria-label={`Match score: ${result.score}%. ${getAriaLabel(result.score)}`}
          >
            {result.score}
            <span className="text-lg text-secondary-500 ml-1">%</span>
          </p>
        </div>
      </Card>

      {/* Matches Section */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Matches Found</h2>
        <div className="space-y-4">
          <MatchSection
            title="Skills"
            items={result.matches.skills}
            icon={<CheckCircle2 className="w-5 h-5 text-accent" aria-hidden="true" />}
          />
          <MatchSection
            title="Experience"
            items={result.matches.experience}
            icon={<CheckCircle2 className="w-5 h-5 text-accent" aria-hidden="true" />}
          />
          <MatchSection
            title="Education"
            items={result.matches.education}
            icon={<CheckCircle2 className="w-5 h-5 text-accent" aria-hidden="true" />}
          />
        </div>
      </Card>

      {/* Missing Requirements */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Missing Requirements</h2>
        <div className="space-y-4">
          <MatchSection
            title="Missing Skills"
            items={result.missing.skills}
            icon={<XCircle className="w-5 h-5 text-destructive" aria-hidden="true" />}
          />
          <MatchSection
            title="Missing Experience"
            items={result.missing?.experience ?? []}
            icon={<XCircle className="w-5 h-5 text-destructive" aria-hidden="true" />}
          />
        </div>
      </Card>

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Improvement Suggestions</h2>
          <ul className="space-y-2" role="list">
            {result.suggestions.map((suggestion, index) => (
              <li 
                key={index}
                className="flex items-start gap-2 text-secondary-700"
              >
                <AlertCircle className="w-5 h-5 text-warning mt-1 flex-shrink-0" aria-hidden="true" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}

type MatchSectionProps = {
  title: string;
  items: string[];
  icon: React.ReactNode;
};

function MatchSection({ title, items, icon }: MatchSectionProps) {
  if ((items ?? []).length === 0) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-medium text-secondary-700" id={`${title.toLowerCase()}-list`}>
        {title}
      </h3>
      <ul 
        className="space-y-1"
        role="list"
        aria-labelledby={`${title.toLowerCase()}-list`}
      >
        {items.map((item, index) => (
          <li 
            key={index}
            className="flex items-center gap-2 text-secondary-600"
          >
            {icon}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}