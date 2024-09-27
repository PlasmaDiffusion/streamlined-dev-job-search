using System.Text.Json;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using Microsoft.AspNetCore.Mvc;
using StreamlinedJobSearcher.Classes;


namespace DynamoDB.Demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobSearchLinksController : ControllerBase
    {
        private readonly IDynamoDBContext _context;

        public JobSearchLinksController()
        {
            var config = new DynamoDBContextConfig { Conversion = DynamoDBEntryConversion.V2 };
            _context = new DynamoDBContext(new AmazonDynamoDBClient(Environment.GetEnvironmentVariable("AWS_AccessKey"), Environment.GetEnvironmentVariable("AWS_SecretKey"), Amazon.RegionEndpoint.USEast2), config);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var jobSearchLink = await _context.LoadAsync<JobSearchLink>(id);
            if (jobSearchLink == null) return NotFound();
            return Ok(jobSearchLink);
        }

        private record ResponseLinks(List<JobSearchLink> jobBoardLinks, List<JobSearchLink> companySiteLinks);


        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var jobSearchLinks = await _context.ScanAsync<JobSearchLink>(default).GetRemainingAsync();
            jobSearchLinks = JobSearchLink.SortLinksByTotalClicksInCategory(jobSearchLinks);

            var jobBoardLinks = new List<JobSearchLink>(jobSearchLinks);
            var companySiteLinks = new List<JobSearchLink>(jobSearchLinks);

            jobBoardLinks = JobSearchLink.GetJobBoardSitesOnly(jobBoardLinks);
            companySiteLinks = JobSearchLink.GetCompanySitesOnly(companySiteLinks);


            return Ok(new ResponseLinks(jobBoardLinks, companySiteLinks));
        }

        [HttpGet("CompanySite")]
        public async Task<IActionResult> GetAllCompanyLinks()
        {
            ScanCondition isCompanySiteCondition = new ScanCondition("IsCompanySite", ScanOperator.Equal, true);

            var jobSearchLinks = await _context.ScanAsync<JobSearchLink>([isCompanySiteCondition]).GetRemainingAsync();
            jobSearchLinks = JobSearchLink.SortLinksByTotalClicksInCategory(jobSearchLinks);

            return Ok(jobSearchLinks);
        }

        [HttpGet("NonCompanySite")]
        public async Task<IActionResult> GetAllNonCompanyLinks()
        {
            ScanCondition isNonCompanySiteCondition = new ScanCondition("IsCompanySite", ScanOperator.Equal, false);

            var jobSearchLinks = await _context.ScanAsync<JobSearchLink>([isNonCompanySiteCondition]).GetRemainingAsync();
            jobSearchLinks = JobSearchLink.SortLinksByTotalClicksInCategory(jobSearchLinks);

            return Ok(jobSearchLinks);
        }

        [HttpPost]
        public async Task<IActionResult> Create(JobSearchLink request)
        {
            var jobSearchLink = await _context.LoadAsync<JobSearchLink>(request.Id);
            if (jobSearchLink != null) return BadRequest($"JobSearchLink with Id {request.Id} Already Exists");
            await _context.SaveAsync(request);
            return Ok(request);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var jobSearchLink = await _context.LoadAsync<JobSearchLink>(id);
            if (jobSearchLink == null) return NotFound();
            await _context.DeleteAsync(jobSearchLink);
            return NoContent();
        }

        [HttpPatch("{updateLastClickedDate?}")]
        public async Task<IActionResult> Update(JobSearchLink request, string updateLastClickedDate = "")
        {
            if (updateLastClickedDate != "")
            {
                request.LastClicked = DateTime.Now;
            }

            var jobSearchLink = await _context.LoadAsync<JobSearchLink>(request.Id);
            if (jobSearchLink == null) return NotFound();
            await _context.SaveAsync(request);
            return Ok(request);
        }



        [HttpGet("generateBulkCompanies")]
        public async Task<IActionResult> CreateFromFile()
        {
            //Get already existing companies, and if they exist remove them from the source
            ScanCondition isCompanySiteCondition = new ScanCondition("IsCompanySite", ScanOperator.Equal, true);
            List<JobSearchLink> existingCompanyJobSearchLinks = await _context.ScanAsync<JobSearchLink>([isCompanySiteCondition]).GetRemainingAsync();
            ReadJsonFile reader = new ReadJsonFile(existingCompanyJobSearchLinks, "./Files/companies.json");

            var bookBatch = _context.CreateBatchWrite<JobSearchLink>();
            bookBatch.AddPutItems(reader.LinksToAdd);
            await bookBatch.ExecuteAsync();
            return Ok(reader.LinksToAdd);
        }
    }
}