using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using OpenAI;
using OpenAI.Chat;
using Streamlined_Dev_Job_Searcher_API.Models;

namespace Streamlined_Dev_Job_Searcher_API.Controllers;

[Route("api/parse-job-posting")]
[ApiController]
public class ParseJobPostingController : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Parse([FromBody] ParseJobPostingRequest request)
    {
        var jobPosting = request.JobPosting?.Trim();

        if (string.IsNullOrWhiteSpace(jobPosting))
            return BadRequest(new { error = "jobPosting is required." });

        var prompt = $$"""
            You are a job posting parser. Extract the job title and company name from the posting below.

            JOB POSTING:
            {{jobPosting}}

            Return ONLY a valid JSON object — no markdown, no extra text — using this exact schema:
            {
              "jobTitle": "<the job title, or empty string if not found>",
              "company": "<the company name, or empty string if not found>"
            }
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
            using var document = JsonDocument.Parse(content);
            var result = document.RootElement.Clone();
            return Ok(result);
        }
        catch (JsonException ex)
        {
            return StatusCode(500, new { error = $"Failed to parse AI response: {ex.Message}" });
        }
        catch (Exception ex)
        {
            Logger.Log(ex.ToString(), Logger.LogTypes.ERROR);
            return StatusCode(500, new { error = "An unexpected error occurred." });
        }
    }
}
