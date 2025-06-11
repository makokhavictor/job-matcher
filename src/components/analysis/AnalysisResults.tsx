'use client'

import { Card } from '@/components/ui/card'

type AnalysisResultsProps = {
  result: {
    results: string,
    success: boolean,
    message: string,
  }
}

export function AnalysisResults({ result }: AnalysisResultsProps) {

  const stripCodeBlock = (htmlString: string) =>  {
    return htmlString
      .replace(/^```html\s*/i, '')   // remove starting ```html or ```HTML
      .replace(/```$/i, '')          // remove trailing ```
      .trim();                       // clean whitespace
  }

  return (
    <div className="space-y-6" role="region" aria-label="Analysis Results">
      {/* Overall Score Card */}
      <Card className="p-6">
        <div className="space-y-4">
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: stripCodeBlock(result.results) }}
          />
        </div>
      </Card>
    </div>
  )
}
