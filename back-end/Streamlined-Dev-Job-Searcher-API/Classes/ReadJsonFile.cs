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
            bool canAdd = true;

            //Go through all existing company links and make sure their name doesn't pop up already
            for (int j = 0; j < existingCompanyJobSearchLinks.Count; j++)
            {
                CompaniesFile newLinkToAdd = companyLinksReadFromFile[i];


                if (newLinkToAdd.name.Contains(existingCompanyJobSearchLinks[j].DisplayName))
                {
                    canAdd = false;
                    break;
                }
            };


            if (canAdd)
            {
                AddLinkToList(companyLinksReadFromFile[i].url, companyLinksReadFromFile[i].name, i);
            }
        }
    }

    private void AddLinkToList(string url, string name, int i)
    {
        Random random = new Random();
        string[] randomColours = ["Blue", "BlueViolet", "Brown", "Crimson", "Red", "DarkBlue", "Green", "FireBrick", "Gold", "DodgerBlue"];
        int randomColourIndex = random.Next(0, randomColours.Length);


        LinksToAdd.Add(new JobSearchLink(
        id: (int)MathF.Floor(DateTime.Now.Millisecond / 1000) + i,
        link: url,
        displayName: name,
        category: "F500",
        colour: randomColours[randomColourIndex],
        isCompanySite: true
        ));
    }
}