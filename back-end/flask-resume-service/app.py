import json
import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI

load_dotenv()

app = Flask(__name__)
CORS(app)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def build_subtlety_desc(subtlety: float) -> str:
    if subtlety < 0.33:
        return "very subtle and minimal — only lightly adjust wording, keeping the original voice intact"
    if subtlety < 0.67:
        return "moderately bold — improve clarity and relevance while preserving most of the original phrasing"
    return "bold and significant — rewrite freely for maximum impact, changing structure and wording as needed"


def build_match_desc(match_strength: float) -> str:
    if match_strength < 0.33:
        return "focus on general writing quality improvements without specifically mirroring the job posting"
    if match_strength < 0.67:
        return "moderately align with the job posting's requirements and preferred terminology"
    return "closely mirror the exact keywords, technologies, and requirements stated in the job posting"


@app.route("/api/resume-check", methods=["POST"])
def resume_check():
    data = request.get_json(force=True)
    resume = (data.get("resume") or "").strip()
    job_posting = (data.get("jobPosting") or "").strip()

    if not resume or not job_posting:
        return jsonify({"error": "Both resume and jobPosting are required."}), 400

    subtlety = float(data.get("subtlety", 0.5))
    match_strength = float(data.get("matchStrength", 0.5))

    subtlety_desc = build_subtlety_desc(subtlety)
    match_desc = build_match_desc(match_strength)

    prompt = f"""You are an expert resume coach. Analyze each bullet point or sentence in the resume/looking-for-work ad below against the provided job posting.

JOB POSTING:
{job_posting}

RESUME / LOOKING FOR WORK AD:
{resume}

TASK:
For every distinct bullet point or sentence in the resume (split on newlines and sentence boundaries):
1. SUGGESTIONS: Provide a rewritten version. Changes should be {subtlety_desc}. The rewrite should {match_desc}.
2. ANALYSIS: State one specific pro (what already works well for this role) and one specific con (what weakens or misses the mark for this role).

Return ONLY a valid JSON object — no markdown, no extra text — using this exact schema:
{{
  "suggestions": [
    {{"original": "<exact original text>", "suggested": "<improved version>"}}
  ],
  "analysis": [
    {{"original": "<exact original text>", "pro": "<what works>", "con": "<what needs improvement>"}}
  ]
}}

Include every bullet point or sentence from the resume. Keep "original" values verbatim."""

    try:
        response = client.chat.completions.create(
            model="gpt-5-nano",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
        )
        result = json.loads(response.choices[0].message.content)
        return jsonify(result)
    except json.JSONDecodeError as e:
        return jsonify({"error": f"Failed to parse AI response: {e}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5001)
