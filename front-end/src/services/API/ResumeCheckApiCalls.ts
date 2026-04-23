import axios from "axios";

export interface ResumeSuggestion {
  original: string;
  suggested: string;
}

export interface ResumeAnalysisItem {
  original: string;
  pro: string;
  con: string;
}

export interface ResumeCheckResult {
  suggestions: ResumeSuggestion[];
  analysis: ResumeAnalysisItem[];
}

export async function checkResume(
  resume: string,
  jobPosting: string,
  subtlety: number,
  matchStrength: number
): Promise<ResumeCheckResult | null> {
  const response = await axios
    .post(`${import.meta.env.VITE_API_URL}/resume-check`, {
      resume,
      jobPosting,
      subtlety,
      matchStrength,
    })
    .catch((e) => {
      console.error("Resume check failed:", e);
      return null;
    });

  return response?.data ?? null;
}
