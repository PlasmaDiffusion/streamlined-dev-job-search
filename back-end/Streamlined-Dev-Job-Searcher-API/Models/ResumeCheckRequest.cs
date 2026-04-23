namespace Streamlined_Dev_Job_Searcher_API.Models;

public class ResumeCheckRequest
{
    public string Resume { get; set; } = "";
    public string JobPosting { get; set; } = "";
    public float Subtlety { get; set; } = 0.5f;
    public float MatchStrength { get; set; } = 0.5f;
}
