using Microsoft.AspNetCore.Mvc;
using System;

namespace TransactionService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ILogger<TransactionsController> _logger;

        public TransactionsController(ILogger<TransactionsController> logger)
        {
            _logger = logger;
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new
            {
                Status = "Healthy",
                Service = "TransactionService",
                Timestamp = DateTime.UtcNow,
                Messaging = "RabbitMQ + AWS SQS Ready"
            });
        }

        [HttpPost]
        public IActionResult CreateTransaction([FromBody] dynamic request)
        {
            var transactionId = Guid.NewGuid().ToString();
            
            _logger.LogInformation($"Transação {transactionId} recebida: {request}");
            
            // Simular publicação em fila
            _logger.LogInformation($"Publicando na fila 'transactions.queue'");
            
            return Accepted(new
            {
                TransactionId = transactionId,
                Status = "PROCESSING",
                Message = "Transação enviada para processamento assíncrono",
                Queue = "transactions.queue",
                Timestamp = DateTime.UtcNow
            });
        }
    }
}
