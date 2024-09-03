using Amazon.DynamoDBv2.DataModel;


namespace StreamlinedJobSearcher.Classes;

[DynamoDBTable("JobApplications")]
public class JobApplication
{

    public JobApplication(int id, string jobTitle, string company, string linkToPosting, string jobDescription, string coverLetter, string[] tags, bool applied) =>
    (Id, JobTitle, Company, LinkToPosting, JobDescription, CoverLetter, Tags, Applied) =
    (id, jobTitle, company, linkToPosting, jobDescription, coverLetter, tags, applied);

    public JobApplication()
    {
    }

    [DynamoDBHashKey("Id")]
    public int Id { get; set; } = 0;

    [DynamoDBRangeKey("User")]
    public string User { get; set; } = "guest";

    public string JobTitle { get; set; } = "";

    public string Company { get; set; } = "";

    public string LinkToPosting { get; set; } = "";

    public string JobDescription { get; set; } = "";

    public string? CoverLetter { get; set; } = "";

    public DateTime? DateApplied { get; set; } = null;

    public string[] Tags { get; set; } = [""];

    public bool Applied { get; set; } = false;
}