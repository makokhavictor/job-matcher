import { create } from 'zustand'
import { apiClient } from '@/lib/utils/apiClient'
import { CvTemplateProps } from '@/components/analysis/CvTemplate'

export type KeyMatch = {
  skill: string;
  explanation: string;
};

export type CriticalMissingSkill = {
  skill: string;
  why_important: string;
  suggestions: string;
};

export type AnalysisResults = {
  key_matches: KeyMatch[];
  critical_missing_skills: CriticalMissingSkill[];
  resume_improvements: string[];
  match_score: number;
  score_breakdown: string;
  title?: string;
  tailored_cv?: CvTemplateProps['tailoredCv'];
};

export type RecentAnalysis = {
  id: number;
  user_id: number;
  input_data: {
    cv_content: string;
    job_content: string;
    cv_filename: string | null;
    job_filename: string | null;
  };
  result_data: {
    key_matches: KeyMatch[];
    critical_missing_skills: CriticalMissingSkill[];
    resume_improvements: string[];
    match_score: number;
    score_breakdown: string;
    title?: string;
    tailored_cv?: CvTemplateProps['tailoredCv'];
  };
  created_at: string;
  updated_at: string;
};

export type AnalysisStore = {
  results: AnalysisResults | null;
  loading: boolean;
  error: string | null;
  recentAnalyses: RecentAnalysis[];
  originalCv: File | string | null;
  originalJd: File | string | null;
  currentAnalysis: RecentAnalysis | null;
  setResults: (results: AnalysisResults | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setOriginals: (cv: File | string, jd: File | string) => void;
  setCurrentAnalysis: (analysis: RecentAnalysis | null) => void;
  reset: () => void;
  fetchRecentAnalyses: () => Promise<void>;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  results: null,
  loading: false,
  error: null,
  recentAnalyses: [],
  originalCv: null,
  originalJd: null,
  currentAnalysis: null,
  setResults: (results) => set({ results, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  setOriginals: (cv, jd) => set({ originalCv: cv, originalJd: jd }),
  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),
  reset: () => set({ results: null, loading: false, error: null, originalCv: null, originalJd: null, currentAnalysis: null }),
  fetchRecentAnalyses: async () => {
    set({ loading: true, error: null })
    try {
      const data = await apiClient('/matcher/results')
      set({ recentAnalyses: data, loading: false })
    } catch (error: unknown) {
      let message = 'Failed to fetch recent analyses';
      if (error instanceof Error) message = error.message;
      set({ error: message, loading: false })
    }
  },
}))
