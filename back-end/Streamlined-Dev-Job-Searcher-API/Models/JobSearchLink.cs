using System.Drawing;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;


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

    public JobSearchLink(int id, string link, string displayName, string category, string colour, bool isCompanySite)
    {
        Id = id;
        Link = link;
        DisplayName = displayName;
        Category = category;
        Colour = colour;
        IsCompanySite = isCompanySite;
    }

    [DynamoDBHashKey("Id")]
    public int Id { get; set; } = 0;

    public string User { get; set; } = "guest";

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
        return links.OrderByDescending(link => link.TimesClicked).ThenBy(link => link.Category).ToList();
    }
}