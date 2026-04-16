using Scalar.AspNetCore;
using Shared.Observability;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSharedObservability("NotificationService");
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

app.MapOpenApi();
app.MapScalarApiReference(options =>
{
    options.WithTitle("Biblioteca API - Notification Service");
    options.WithTheme(ScalarTheme.DeepSpace);
});

app.MapGet("/health", () => Results.Ok(new
{
    service = "NotificationService",
    status = "ok",
    timestampUtc = DateTime.UtcNow
}))
.WithName("NotificationHealth")
.WithSummary("Health check do NotificationService")
.WithOpenApi();

app.MapGet("/api/notifications/ping", () => Results.Ok(new
{
    message = "NotificationService online",
    mode = "stub"
}))
.WithName("NotificationPing")
.WithSummary("Endpoint de disponibilidade para integracoes futuras")
.WithOpenApi();

app.Run();
