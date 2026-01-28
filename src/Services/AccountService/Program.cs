using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "AccountService API", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// Health endpoint
app.MapGet("/health", () => 
{
    return Results.Json(new 
    {
        status = "healthy",
        service = "AccountService",
        timestamp = DateTime.UtcNow,
        version = "1.0.0",
        framework = "NET 8.0"
    });
});

// Dashboard stats endpoint
app.MapGet("/api/dashboard/stats", () =>
{
    return Results.Json(new
    {
        totalTransactions = 15842,
        fraudDetected = 19,
        riskScore = 82,
        revenue = 3125400.75,
        activeUsers = 1842,
        pendingAlerts = 6,
        totalAccounts = 921,
        avgTransactionValue = 1567.32,
        timestamp = DateTime.UtcNow,
        environment = "Kubernetes"
    });
});

// Accounts endpoint
app.MapGet("/api/accounts", () =>
{
    return Results.Json(new
    {
        data = new[]
        {
            new { id = "ACC001", userId = "USR001", balance = 12500.50, type = "checking", currency = "USD", status = "active" },
            new { id = "ACC002", userId = "USR002", balance = 8500.75, type = "savings", currency = "USD", status = "active" },
            new { id = "ACC003", userId = "USR003", balance = 25000.00, type = "investment", currency = "USD", status = "active" }
        },
        total = 3,
        page = 1,
        limit = 10,
        timestamp = DateTime.UtcNow
    });
});

// Root endpoint
app.MapGet("/", () => "AccountService API - Use /health, /api/dashboard/stats, /api/accounts");

app.Run("http://*:5198");

