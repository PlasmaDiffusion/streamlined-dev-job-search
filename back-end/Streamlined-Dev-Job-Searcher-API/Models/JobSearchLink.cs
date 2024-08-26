using Amazon.DynamoDBv2.DataModel;


namespace StreamlinedJobSearcher.Classes;

[DynamoDBTable("JobSearchLinks")]
public class JobSearchLink
{

    public JobSearchLink(int id, string link, string displayName, int timesClicked,
    DateTime lastClicked, string category, string colour, bool isCompanySite) =>
    (Id, Link, DisplayName, TimesClicked, LastClicked, Category, Colour, IsCompanySite) =
    (id, link, displayName, timesClicked, lastClicked, category, colour, isCompanySite);

    public JobSearchLink()
    {
    }

    [DynamoDBHashKey("Id")]
    public int Id { get; set; } = 0;

    [DynamoDBLocalSecondaryIndexRangeKey("User")]
    public string User {get; set;} = "guest";

    public string Link { get; set; } = "";

    public string DisplayName { get; set; } = "";

    public int TimesClicked { get; set; } = 0;

    public DateTime? LastClicked { get; set; } = null;

    public string Category { get; set; } = "";

    public string Colour { get; set; } = "";
    
    public bool IsCompanySite { get; set; } = false;


    public static List<JobSearchLink> SortByCategory(List<JobSearchLink> links)
    {
        links.Sort((a, b) => string.Compare(a.Category, b.Category));

        return links;
    }

    public static List<JobSearchLink> GetCompanySitesOnly(List<JobSearchLink> links)
    {
        links.RemoveAll((link) => !link.IsCompanySite);

        return links;
    }

    public static List<JobSearchLink> GetJobBoardSitesOnly(List<JobSearchLink> links)
    {
        links.RemoveAll((link) => link.IsCompanySite);

        return links;
    }

    public static List<JobSearchLink> SortLinksByTotalClicksInCategory(List<JobSearchLink> links)
    {
        return links.OrderBy(link => link.Category).ThenBy(link => link.TimesClicked).ToList();
    }
}