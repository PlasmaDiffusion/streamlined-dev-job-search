import axios from "axios";

export interface ParsedJobPosting {
  jobTitle: string;
  company: string;
}

export async function parseJobPostingWithAI(
  jobPosting: string
): Promise<ParsedJobPosting | null> {
  const response = await axios
    .post(`${import.meta.env.VITE_API_URL}/parse-job-posting`, {
      jobPosting,
    })
    .catch((e) => {
      console.error("Job posting parse failed:", e);
      return null;
    });

  return response?.data ?? null;
}
