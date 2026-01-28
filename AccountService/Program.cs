using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Configurar para ver logs detalhados
Console.WriteLine("==========================================");
Console.WriteLine("🚀 FINTRACKAI - CONEXÃO RABBITMQ DIRETA");
Console.WriteLine("==========================================");

// ========================
// CONEXÃO DIRETA E SIMPLES
// ========================
try
{
    Console.WriteLine("🔌 Criando ConnectionFactory...");
    
    var factory = new ConnectionFactory()
    {
        // Configuração MÍNIMA que SEMPRE funciona
        HostName = "localhost",
        Port = 5672,
        UserName = "admin",
        Password = "FinTrackAI2024!",
        VirtualHost = "/",
        
        // Configurações importantes
        RequestedConnectionTimeout = TimeSpan.FromSeconds(10),
        RequestedHeartbeat = TimeSpan.FromSeconds(60),
        AutomaticRecoveryEnabled = true
    };
    
    Console.WriteLine("📡 Tentando conectar...");
    Console.WriteLine($"   Host: {factory.HostName}:{factory.Port}");
    Console.WriteLine($"   User: {factory.UserName}");
    
    // 1. CONEXÃO
    using var connection = factory.CreateConnection();
    Console.WriteLine("✅ CONEXÃO ESTABELECIDA!");
    
    // 2. CANAL
    using var channel = connection.CreateModel();
    Console.WriteLine("✅ CANAL CRIADO!");
    
    // 3. CRIAR FILAS
    var queues = new[] { "fintrackai.dashboard", "fintrackai.test" };
    foreach (var queue in queues)
    {
        channel.QueueDeclare(
            queue: queue,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null
        );
        Console.WriteLine($"   ✅ Fila criada: {queue}");
    }
    
    // ========================
    // ENDPOINTS
    // ========================
    app.MapGet("/", () => "🎯 FinTrackAI - CONECTADO AO RABBITMQ!");
    
    app.MapGet("/health", () =>
    {
        return Results.Json(new
        {
            status = "healthy",
            timestamp = DateTime.UtcNow,
            rabbitmq = "connected",
            connection = $"{factory.HostName}:{factory.Port}",
            user = factory.UserName,
            queues = queues
        });
    });
    
    // ENDPOINT DE TESTE - Publica mensagem REAL
    app.MapGet("/api/test", () =>
    {
        var messageId = Guid.NewGuid().ToString()[..8];
        var timestamp = DateTime.UtcNow;
        
        var message = new
        {
            id = messageId,
            event_type = "backend.test",
            service = "AccountService",
            timestamp = timestamp,
            data = new { test = "OK", version = "1.0" },
            note = "🎉 Conexão REAL estabelecida!"
        };
        
        var json = JsonSerializer.Serialize(message);
        var body = Encoding.UTF8.GetBytes(json);
        
        // PUBLICAR
        channel.BasicPublish(
            exchange: "",
            routingKey: "fintrackai.test",
            basicProperties: null,
            body: body
        );
        
        Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] 📤 Publicado: {messageId}");
        
        return Results.Json(new
        {
            success = true,
            message = "✅ MENSAGEM PUBLICADA NO RABBITMQ!",
            published_at = timestamp,
            data = message,
            rabbitmq_ui = "http://localhost:15672/#/",
            instructions = new[]
            {
                "1. Acesse: http://localhost:15672/#/",
                "2. Login: admin / FinTrackAI2024!",
                "3. Vá em 'Queues'",
                "4. Clique em 'fintrackai.test'",
                "5. Clique 'Get messages'",
                "6. VEJA SUA MENSAGEM!"
            }
        });
    });
    
    // Dashboard
    app.MapGet("/api/dashboard", () =>
    {
        var stats = new
        {
            totalTransactions = 12543,
            revenue = 2548900.50,
            activeUsers = 1542,
            timestamp = DateTime.UtcNow
        };
        
        var eventMessage = new
        {
            type = "dashboard.updated",
            data = stats,
            published_at = DateTime.UtcNow
        };
        
        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(eventMessage));
        
        channel.BasicPublish("", "fintrackai.dashboard", null, body);
        
        Console.WriteLine($"[{DateTime.Now:HH:mm:ss}] 📊 Dashboard publicado");
        
        return Results.Json(new
        {
            success = true,
            published = true,
            queue = "fintrackai.dashboard",
            data = stats
        });
    });
    
    Console.WriteLine("==========================================");
    Console.WriteLine("✅ BACKEND CONFIGURADO COM SUCESSO!");
    Console.WriteLine("🌐 Endpoints disponíveis:");
    Console.WriteLine("   • http://localhost:5000/");
    Console.WriteLine("   • http://localhost:5000/health");
    Console.WriteLine("   • http://localhost:5000/api/test");
    Console.WriteLine("   • http://localhost:5000/api/dashboard");
    Console.WriteLine("🐇 RabbitMQ UI: http://localhost:15672/#/");
    Console.WriteLine("==========================================");
}
catch (Exception ex)
{
    Console.WriteLine($"❌❌❌ ERRO CRÍTICO: {ex.Message}");
    Console.WriteLine($"📋 Detalhes: {ex.GetType().Name}");
    
    // Fallback: API funciona mesmo sem RabbitMQ
    app.MapGet("/", () => "⚠️ FinTrackAI (RabbitMQ OFFLINE)");
    
    app.MapGet("/health", () => Results.Json(new
    {
        status = "degraded",
        timestamp = DateTime.UtcNow,
        rabbitmq = "disconnected",
        error = ex.Message,
        solution = "Verifique RabbitMQ em: http://localhost:15672/#/"
    }));
    
    app.MapGet("/api/test", () => Results.Json(new
    {
        success = false,
        message = "RabbitMQ offline",
        error = ex.Message,
        rabbitmq_ui = "http://localhost:15672/#/"
    }));
    
    Console.WriteLine("⚠️  Executando em modo degradado (sem RabbitMQ)");
}

app.Run();