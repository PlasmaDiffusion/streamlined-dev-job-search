﻿using System.Globalization;
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
            _context = new DynamoDBContext(new AmazonDynamoDBClient(Environment.GetEnvironmentVariable("AWS_AccessKey"), Environment.GetEnvironmentVariable("AWS_SecretKey"), Amazon.RegionEndpoint.USEast2), config);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var jobApplications = await _context.ScanAsync<JobSearchApplication>(default).GetRemainingAsync();
            jobApplications= JobSearchApplication.SortApplicationsByDate(jobApplications);
            
            return Ok(jobApplications);
        }


        [HttpGet("currentMonth")]
        public async Task<IActionResult> GetAllApplicationsThisMonth()
        {
            DateTime today = DateTime.Now;


            ScanCondition isCurrentMonthAndYearCondition = new ScanCondition("DateApplied", ScanOperator.Contains, today.Year.ToString() + '-' + today.Month.ToString());


            var jobApplications = await _context.ScanAsync<JobSearchApplication>([isCurrentMonthAndYearCondition]).GetRemainingAsync();
            jobApplications= JobSearchApplication.SortApplicationsByDate(jobApplications);

            return Ok(jobApplications);
        }

        [HttpGet("currentYear")]
        public async Task<IActionResult> GetAllApplicationsThisYear()
        {
            DateTime today = DateTime.Now;


            ScanCondition isYearCondition = new ScanCondition("DateApplied", ScanOperator.Contains, today.Year.ToString());


            var jobApplications = await _context.ScanAsync<JobSearchApplication>([isYearCondition]).GetRemainingAsync();
            jobApplications= JobSearchApplication.SortApplicationsByDate(jobApplications);

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
            DateTime currentDateTime = DateTime.Now;
            // A date sort key needs to be a string. Make sure we have a YYYY-MM-DD T format regardless of the hosting server.
            request.DateApplied = currentDateTime.Year.ToString() + '-' + currentDateTime.Month.ToString() + '-'
            + currentDateTime.Day.ToString() + " " + currentDateTime.TimeOfDay.ToString();

            var jobApplication = await _context.LoadAsync<JobSearchApplication>(request.User, request.DateApplied);
            if (jobApplication != null) return BadRequest($"JobApplication with Id {request.User}, {request.DateApplied} Already Exists");
            await _context.SaveAsync(request);
            return Ok(request);
        }

        [HttpDelete("{user}/{dateApplied}")]
        public async Task<IActionResult> Delete(string user, string dateApplied)
        {
            var jobApplication = await _context.LoadAsync<JobSearchApplication>(user, dateApplied);
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