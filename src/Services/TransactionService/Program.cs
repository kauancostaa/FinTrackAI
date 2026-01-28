var builder = WebApplication.CreateBuilder(args);

// Serviços mínimos - sem OpenAPI se causar problemas
builder.Services.AddControllers();

var app = builder.Build();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
