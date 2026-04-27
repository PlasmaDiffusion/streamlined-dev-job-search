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
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/resume-check`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobPosting, subtlety, matchStrength }),
      }
    );

    if (!response.ok || !response.body) {
      console.error("Resume check failed:", response.statusText);
      return null;
    }

    /* The backend streams raw JSON text to avoid Heroku's 30-second idle timeout (H12/H15).
       Spaces are sent as heartbeats while OpenAI is working — they are valid JSON whitespace
       and are ignored by the parser. We just read the full body and parse it once complete. */
    const text = await response.text();
    return JSON.parse(text) as ResumeCheckResult;
  } catch (e) {
    console.error("Resume check failed:", e);
    return null;
  }
}
