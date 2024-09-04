using Amazon.DynamoDBv2.DataModel;


namespace StreamlinedJobSearcher.Classes;

[DynamoDBTable("JobSearchApplications")]
public class JobSearchApplication
{

    public JobSearchApplication(string user, string dateApplied, string jobTitle, string company, string linkToPosting, string jobDescription, string coverLetter, string[] tags, bool applied) =>
    (User, DateApplied, JobTitle, Company, LinkToPosting, JobDescription, CoverLetter, Tags, Applied) =
    (user, dateApplied, jobTitle, company, linkToPosting, jobDescription, coverLetter, tags, applied);

    public JobSearchApplication()
    {
    }

    [DynamoDBHashKey("User")]
    public string User { get; set; } = "guest";

    [DynamoDBRangeKey("DateApplied")]
    public string DateApplied { get; set; } = DateTime.Now.ToString();
    public string JobTitle { get; set; } = "";

    public string Company { get; set; } = "";

    public string LinkToPosting { get; set; } = "";

    public string JobDescription { get; set; } = "";

    public string? CoverLetter { get; set; } = "";

    public string[] Tags { get; set; } = [""];

    public bool Applied { get; set; } = false;
}