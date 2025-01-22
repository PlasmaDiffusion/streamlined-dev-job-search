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

    [DynamoDBRangeKey("DateApplied")] //DynamoDB doesn't seem to have a date type, so I'm storing it as a string
    public string DateApplied { get; set; } = DateTime.Now.ToString();
    public string JobTitle { get; set; } = "";

    public string Company { get; set; } = "";

    public string LinkToPosting { get; set; } = "";

    public string JobDescription { get; set; } = "";

    public string? CoverLetter { get; set; } = "";

    public string[] Tags { get; set; } = [""];

    public bool Applied { get; set; } = false;

    public static List<JobSearchApplication> SortApplicationsByDate(List<JobSearchApplication> applications)
    {
        return applications.OrderBy(application => application.SortByDateString(application)).ToList();
    }


    /*
    As said above DynamoDB doesn't have a date so we're using a string in the YY-MM-DD HH:MM:SS format.
    When sorting date strings, applications will be ordered like the 1st and 11th next to each other,
    so we need to convert date values to ints.
    */
    private int SortByDateString(JobSearchApplication application)
    {
        if (application.DateApplied.Contains("-") && application.DateApplied.Contains(" "))
        {
            int dayOfMonth = int.Parse(application.DateApplied.Split("-")[2].Split(" ")[0]);
            // Months are a high int value to make sure the yearly table groups months together (so you don't see Oct 11th, then Nov 12th, then Oct 12th in a table)
            int month = int.Parse(application.DateApplied.Split("-")[1]) * 1000;
            int year = int.Parse(application.DateApplied.Split("-")[0]);

            return year + month + dayOfMonth;
        }
        else
        {
            // Handle non-date strings or any other appropriate default value
            return int.MaxValue;
        }
    }

}