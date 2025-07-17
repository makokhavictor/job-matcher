import { create } from 'zustand'
import { apiClient } from '@/lib/utils/apiClient'

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
  };
  created_at: string;
  updated_at: string;
};

export type AnalysisStore = {
  results: AnalysisResults | null;
  loading: boolean;
  error: string | null;
  recentAnalyses: RecentAnalysis[];
  setResults: (results: AnalysisResults) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  fetchRecentAnalyses: () => Promise<void>;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  results: null,
  loading: false,
  error: null,
  recentAnalyses: [],
  setResults: (results) => set({ results, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  reset: () => set({ results: null, loading: false, error: null }),
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
