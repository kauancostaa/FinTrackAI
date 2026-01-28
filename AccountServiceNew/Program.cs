using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();






// CONEXÃO RABBITMQ
IConnection? connection = null;
IModel? channel = null;

try
{
    Console.WriteLine("📡 Configurando ConnectionFactory...");
    
    var factory = new ConnectionFactory()
    {
        HostName = "localhost",
        Port = 5672,
        UserName = "admin",
        Password = "FinTrackAI2024!",
        VirtualHost = "/",
        RequestedConnectionTimeout = TimeSpan.FromSeconds(10)
    };
    
    Console.WriteLine("🔌 Tentando conectar...");
    connection = factory.CreateConnection();
    channel = connection.CreateModel();
    
    Console.WriteLine("CONEXÃO ESTABELECIDA!");
    
    // Criar filas
    string[] queues = { "fintrackai.dashboard", "fintrackai.test" };
    foreach (var queue in queues)
    {
        channel.QueueDeclare(queue, durable: true, exclusive: false, autoDelete: false);
        Console.WriteLine($"   Fila: {queue}");
    }
    
    Console.WriteLine("RABBITMQ CONFIGURADO COM SUCESSO!");
}
catch (Exception ex)
{
    Console.WriteLine($"ERRO RABBITMQ: {ex.Message}");
    Console.WriteLine("Executando em modo degradado...");
}

// ENDPOINTS

app.MapGet("/", () => "FinTrack Account Service");

app.MapGet("/health", () =>
{
    var rabbitStatus = connection?.IsOpen ?? false ? "connected" : "disconnected";
    
    return Results.Json(new
    {
        status = rabbitStatus == "connected" ? "healthy" : "degraded",
        timestamp = DateTime.UtcNow,
        services = new
        {
            rabbitmq = rabbitStatus,
            api = "online"
        },
        rabbitmq_ui = "http://localhost:15672/#/",
        credentials = "admin / FinTrackAI2024!"
    });
});

// TESTE DE PUBLICAÇÃO
app.MapGet("/api/rabbitmq/test", () =>
{
    if (channel?.IsOpen ?? false)
    {
        try
        {
            var message = new
            {
                id = Guid.NewGuid().ToString()[..8],
                eventType = "test.publication",
                service = "AccountService",
                timestamp = DateTime.UtcNow,
                data = new { value = "CONEXÃO FUNCIONANDO!" }
            };
            
            var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
            
            channel.BasicPublish("", "fintrackai.test", null, body);
            
            Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] 📤 Publicado: {message.id}");
            
            return Results.Json(new
            {
                success = true,
                message = "MENSAGEM PUBLICADA NO RABBITMQ!",
                publishedAt = DateTime.UtcNow,
                queue = "fintrackai.test",
                rabbitmq_ui = "http://localhost:15672/#/",
                instructions = "Acesse RabbitMQ UI → Queues → fintrackai.test → Get messages"
            });
        }
        catch (Exception ex)
        {
            return Results.Json(new
            {
                success = false,
                error = ex.Message
            });
        }
    }
    
    return Results.Json(new
    {
        success = false,
        message = "RabbitMQ não está conectado",
        rabbitmq_ui = "http://localhost:15672/#/"
    });
});

// DASHBOARD
app.MapGet("/api/dashboard", () =>
{
    var stats = new
    {
        totalTransactions = 12543,
        revenue = 2548900.50,
        activeUsers = 1542,
        timestamp = DateTime.UtcNow
    };
    
    // Publicar no RabbitMQ se conectado
    if (channel?.IsOpen ?? false)
    {
        try
        {
            var eventData = new
            {
                type = "dashboard.updated",
                data = stats,
                publishedAt = DateTime.UtcNow
            };
            
            var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(eventData));
            channel.BasicPublish("", "fintrackai.dashboard", null, body);
            
            Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] 📊 Dashboard publicado");
        }
        catch { /* Ignore publish errors */ }
    }
    
    return Results.Json(new
    {
        success = true,
        data = stats,
        published = channel?.IsOpen ?? false
    });
});

Console.WriteLine("========================================");
Console.WriteLine("BACKEND PRONTO!");
Console.WriteLine("Endpoints:");
Console.WriteLine("   http://localhost:5000/");
Console.WriteLine("   http://localhost:5000/health");
Console.WriteLine("   http://localhost:5000/api/rabbitmq/test");
Console.WriteLine("   http://localhost:5000/api/dashboard");
Console.WriteLine("RabbitMQ: http://localhost:15672/#/");
Console.WriteLine("========================================");

app.Run();
