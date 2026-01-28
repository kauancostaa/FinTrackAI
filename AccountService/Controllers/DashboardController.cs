using System;
using Microsoft.AspNetCore.Mvc;

namespace AccountService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new 
            { 
                message = "FinTrackAI Dashboard", 
                timestamp = DateTime.UtcNow 
            });
        }
        
        [HttpGet("test")]
        public IActionResult GetTest()
        {
            return Ok(new 
            { 
                status = "working",
                rabbitmq = "ready",
                timestamp = DateTime.UtcNow 
            });
        }
    }
}
