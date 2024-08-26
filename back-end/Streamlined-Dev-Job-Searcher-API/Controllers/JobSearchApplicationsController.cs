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
    public class JobSearchApplicationsController : ControllerBase
    {
        private readonly IDynamoDBContext _context;

        public JobSearchApplicationsController()
        {
            var config = new DynamoDBContextConfig { Conversion = DynamoDBEntryConversion.V2 };
            _context = new DynamoDBContext(new AmazonDynamoDBClient(Environment.GetEnvironmentVariable("AWS_AccessKey", EnvironmentVariableTarget.User), Environment.GetEnvironmentVariable("AWS_SecretKey", EnvironmentVariableTarget.User), Amazon.RegionEndpoint.USEast2), config);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var jobApplication = await _context.LoadAsync<JobApplication>(id);
            if (jobApplication == null) return NotFound();
            return Ok(jobApplication);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var jobApplications = await _context.ScanAsync<JobApplication>(default).GetRemainingAsync();
            return Ok(jobApplications);
        }


        [HttpGet("currentMonth")]
        public async Task<IActionResult> GetAllApplicationsThisMonth()
        {
            DateTime today = DateTime.Now;



            ScanCondition isMonthCondition = new ScanCondition("DateApplied", ScanOperator.Contains, today.Month);
            ScanCondition isYearCondition = new ScanCondition("DateApplied", ScanOperator.Contains, today.Year);


            var jobApplications = await _context.ScanAsync<JobApplication>([isMonthCondition, isYearCondition]).GetRemainingAsync();

            return Ok(jobApplications);
        }

        [HttpPost]
        public async Task<IActionResult> Create(JobApplication request, string? updateLastClickedDate)
        {
            var jobApplication = await _context.LoadAsync<JobApplication>(request.Id);
            if (jobApplication != null) return BadRequest($"JobApplication with Id {request.Id} Already Exists");
            await _context.SaveAsync(request);
            return Ok(request);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var jobApplication = await _context.LoadAsync<JobApplication>(id);
            if (jobApplication == null) return NotFound();
            await _context.DeleteAsync(jobApplication);
            return NoContent();
        }

        [HttpPatch("{updateLastClickedDate?}")]
        public async Task<IActionResult> Update(JobApplication request)
        {
            var jobApplication = await _context.LoadAsync<JobApplication>(request.Id);
            if (jobApplication == null) return NotFound();
            await _context.SaveAsync(request);
            return Ok(request);
        }
    }
}