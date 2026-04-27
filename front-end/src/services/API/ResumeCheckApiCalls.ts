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

    /* The backend streams the OpenAI response as SSE (Server-Sent Events) to avoid Heroku's
      30-second request timeout (H12). We read the stream chunk by chunk, accumulate the JSON,
      and only parse it once the server signals completion with "[DONE]".
    */
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let jsonAccumulator = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const chunk = line.slice(6);
          if (chunk === "[DONE]") break;
          jsonAccumulator += chunk;
        }
      }
    }

    return JSON.parse(jsonAccumulator) as ResumeCheckResult;
  } catch (e) {
    console.error("Resume check failed:", e);
    return null;
  }
}
