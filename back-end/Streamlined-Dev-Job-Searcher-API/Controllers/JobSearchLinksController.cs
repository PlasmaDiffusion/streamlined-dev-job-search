using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Microsoft.AspNetCore.Mvc;
using StreamlinedJobSearcher.Classes;


namespace DynamoDB.Demo.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobSearchLinksController : ControllerBase
    {
        private readonly IDynamoDBContext context;

        public JobSearchLinksController()
        {
            var config = new DynamoDBContextConfig { Conversion = DynamoDBEntryConversion.V2 };
            this.context = new DynamoDBContext(new AmazonDynamoDBClient(Environment.GetEnvironmentVariable("AccessKey", EnvironmentVariableTarget.User), Environment.GetEnvironmentVariable("AWS__SecretKey", EnvironmentVariableTarget.User), Amazon.RegionEndpoint.USEast2), config);

        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id, string barcode)
        {
            var JobSearchLink = await context.LoadAsync<JobSearchLink>(id, barcode);
            if (JobSearchLink == null) return NotFound();
            return Ok(JobSearchLink);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var JobSearchLinks = await context.ScanAsync<JobSearchLink>(default).GetRemainingAsync();
            return Ok(JobSearchLinks);
        }

        [HttpPost]
        public async Task<IActionResult> Create(JobSearchLink request)
        {
            var JobSearchLink = await context.LoadAsync<JobSearchLink>(request.Id);
            if (JobSearchLink != null) return BadRequest($"JobSearchLink with Id {request.Id} Already Exists");
            await context.SaveAsync(request);
            return Ok(request);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id, string barcode)
        {
            var JobSearchLink = await context.LoadAsync<JobSearchLink>(id, barcode);
            if (JobSearchLink == null) return NotFound();
            await context.DeleteAsync(JobSearchLink);
            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> Update(JobSearchLink request)
        {
            var JobSearchLink = await context.LoadAsync<JobSearchLink>(request.Id);
            if (JobSearchLink == null) return NotFound();
            await context.SaveAsync(request);
            return Ok(request);
        }
    }
}