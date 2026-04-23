using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using OpenAI;
using OpenAI.Chat;
using Streamlined_Dev_Job_Searcher_API.Models;

namespace Streamlined_Dev_Job_Searcher_API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ResumeCheckController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Check([FromBody] ResumeCheckRequest request)
    {
        var resume = request.Resume.Trim();
        var jobPosting = request.JobPosting.Trim();

        if (string.IsNullOrEmpty(resume) || string.IsNullOrEmpty(jobPosting))
            return BadRequest(new { error = "Both resume and jobPosting are required." });

        var subtlety = Math.Clamp(request.Subtlety, 0f, 1f);
        var matchStrength = Math.Clamp(request.MatchStrength, 0f, 1f);

        var subtletyDesc = BuildSubtletyDesc(subtlety);
        var matchDesc = BuildMatchDesc(matchStrength);

        var prompt = $$"""
            You are an expert resume coach. Analyze each bullet point or sentence in the resume/looking-for-work ad below against the provided job posting.

            JOB POSTING:
            {{jobPosting}}

            RESUME / LOOKING FOR WORK AD:
            {{resume}}

            TASK:
            For every distinct bullet point or sentence in the resume (split on newlines and sentence boundaries):
            1. SUGGESTIONS: Provide a rewritten version. Changes should be {{subtletyDesc}}. The rewrite should {{matchDesc}}.
            2. ANALYSIS: State one specific pro (what already works well for this role) and one specific con (what weakens or misses the mark for this role).

            Return ONLY a valid JSON object — no markdown, no extra text — using this exact schema:
            {
              "suggestions": [
                {"original": "<exact original text>", "suggested": "<improved version>"}
              ],
              "analysis": [
                {"original": "<exact original text>", "pro": "<what works>", "con": "<what needs improvement>"}
              ]
            }

            Include every bullet point or sentence from the resume. Keep "original" values verbatim.
            """;

        try
        {
            var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY")
                ?? throw new InvalidOperationException("OPENAI_API_KEY environment variable is not set.");

            var client = new OpenAIClient(apiKey);
            var chatClient = client.GetChatClient("gpt-5-nano");

            var completion = await chatClient.CompleteChatAsync(
                [new UserChatMessage(prompt)],
                new ChatCompletionOptions { ResponseFormat = ChatResponseFormat.CreateJsonObjectFormat() }
            );

            var content = completion.Value.Content[0].Text;
            var result = JsonDocument.Parse(content).RootElement;
            return Ok(result);
        }
        catch (JsonException ex)
        {
            return StatusCode(500, new { error = $"Failed to parse AI response: {ex.Message}" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = ex.Message });
        }
    }

    private static string BuildSubtletyDesc(float subtlety) => subtlety switch
    {
        < 0.33f => "very subtle and minimal — only lightly adjust wording, keeping the original voice intact",
        < 0.67f => "moderately bold — improve clarity and relevance while preserving most of the original phrasing",
        _ => "bold and significant — rewrite freely for maximum impact, changing structure and wording as needed"
    };

    private static string BuildMatchDesc(float matchStrength) => matchStrength switch
    {
        < 0.33f => "focus on general writing quality improvements without specifically mirroring the job posting",
        < 0.67f => "moderately align with the job posting's requirements and preferred terminology",
        _ => "closely mirror the exact keywords, technologies, and requirements stated in the job posting"
    };
}
