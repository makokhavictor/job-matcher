import { create } from 'zustand'

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
};

export type AnalysisStore = {
  results: AnalysisResults | null;
  loading: boolean;
  error: string | null;
  setResults: (results: AnalysisResults) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  results: null,
  loading: false,
  error: null,
  setResults: (results) => set({ results, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  reset: () => set({ results: null, loading: false, error: null }),
}))
