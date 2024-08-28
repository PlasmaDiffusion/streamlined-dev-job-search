using System.Text.Json;
using StreamlinedJobSearcher.Classes;

class ReadJsonFile
{

    private record CompaniesFile(string name, string[] shortNames, string url);

    public List<JobSearchLink> LinksToAdd { set; get; }

    public ReadJsonFile(List<JobSearchLink> existingCompanyJobSearchLinks, string fileName)
    {
        List<CompaniesFile> companyLinksReadFromFile = new List<CompaniesFile>();

        //Read companies in a file
        using (StreamReader r = new StreamReader(fileName))
        {
            string json = r.ReadToEnd();
            companyLinksReadFromFile = JsonSerializer.Deserialize<List<CompaniesFile>>(json);
        }

        Console.WriteLine(companyLinksReadFromFile);

        LinksToAdd = new List<JobSearchLink>();
        for (int i = 0; i < companyLinksReadFromFile.Count; i++)
        {
            for (int j = 0; j < existingCompanyJobSearchLinks.Count; j++)
            {
                CompaniesFile newLinkToAdd = companyLinksReadFromFile[i];


                if (!newLinkToAdd.name.Contains(existingCompanyJobSearchLinks[j].DisplayName))
                {
                    LinksToAdd.Add(new JobSearchLink(id: MathF.Floor(DateTime.Now.Millisecond / 1000), link:
                    newLinkToAdd.url, displayName: newLinkToAdd.url
                    ));
                    break;
                }
            };
        }
        
    }


}