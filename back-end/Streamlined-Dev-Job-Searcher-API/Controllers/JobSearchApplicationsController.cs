using System.Globalization;
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

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var jobApplications = await _context.ScanAsync<JobSearchApplication>(default).GetRemainingAsync();
            return Ok(jobApplications);
        }


        [HttpGet("currentMonth")]
        public async Task<IActionResult> GetAllApplicationsThisMonth()
        {
            DateTime today = DateTime.Now;


            ScanCondition isMonthCondition = new ScanCondition("DateApplied", ScanOperator.Contains, today.Month.ToString());
            ScanCondition isYearCondition = new ScanCondition("DateApplied", ScanOperator.Contains, today.Year.ToString());


            var jobApplications = await _context.ScanAsync<JobSearchApplication>([isMonthCondition, isYearCondition]).GetRemainingAsync();

            return Ok(jobApplications);
        }

        [HttpGet("{primaryKey}/{sortKeyCondition}")]
        public async Task<IActionResult> GetItemsByKeysAndCondition(string primaryKey, string sortKeyCondition)
        {
            // Parse the sort key condition
            var sortKeyConditionValue = DateTime.ParseExact(sortKeyCondition, "yyyy-MM-ddTHH:mm:ss", CultureInfo.InvariantCulture);

            var queryRequest = new QueryRequest
            {
                TableName = "YourTableName",
                KeyConditionExpression = "PrimaryKey = :pk AND SortKey >= :sk",
                ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                { ":pk", new AttributeValue { S = primaryKey } },
                { ":sk", new AttributeValue { S = sortKeyConditionValue.ToString("yyyy-MM-ddTHH:mm:ss") } }
            }
            };


            var queryResponse = await _context.QueryAsync<JobSearchApplication>(queryRequest).GetRemainingAsync();



            return Ok(queryResponse);
        }

        [HttpPost]
        public async Task<IActionResult> Create(JobSearchApplication request)
        {
            //Automatically set the date before posting (it's the sort key)
            request.DateApplied = DateTime.Now.ToString();

            var jobApplication = await _context.LoadAsync<JobSearchApplication>(request.User, request.DateApplied);
            if (jobApplication != null) return BadRequest($"JobApplication with Id {request.User}, {request.DateApplied} Already Exists");
            await _context.SaveAsync(request);
            return Ok(request);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var jobApplication = await _context.LoadAsync<JobSearchApplication>(id);
            if (jobApplication == null) return NotFound();
            await _context.DeleteAsync(jobApplication);
            return NoContent();
        }

        [HttpPatch]
        public async Task<IActionResult> Update(JobSearchApplication request)
        {
            var jobApplication = await _context.LoadAsync<JobSearchApplication>(request.User, request.DateApplied);
            if (jobApplication == null) return NotFound();
            await _context.SaveAsync(request);
            return Ok(request);
        }
    }
}