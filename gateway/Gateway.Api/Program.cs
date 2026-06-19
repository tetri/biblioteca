using Scalar.AspNetCore;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.RateLimiting;
using Shared.Observability;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSharedObservability("Gateway.Api");

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("api-limit", opt =>
    {
        opt.PermitLimit = 100;
        opt.Window = TimeSpan.FromSeconds(1);
        opt.QueueLimit = 0;
    });
});

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddOpenApi();

var app = builder.Build();

app.MapOpenApi();

app.MapScalarApiReference("/docs/user", options => {
    options.WithTitle("Biblioteca API - User Service")
           .WithTheme(ScalarTheme.DeepSpace)
           .WithOpenApiRoutePattern("/user/openapi/v1.json");
});

app.MapScalarApiReference("/docs/catalog", options => {
    options.WithTitle("Biblioteca API - Catalog Service")
           .WithTheme(ScalarTheme.DeepSpace)
           .WithOpenApiRoutePattern("/catalog/openapi/v1.json");
});

app.MapScalarApiReference("/docs/loan", options => {
    options.WithTitle("Biblioteca API - Loan Service")
           .WithTheme(ScalarTheme.DeepSpace)
           .WithOpenApiRoutePattern("/loan/openapi/v1.json");
});

app.MapScalarApiReference("/docs/notification", options => {
    options.WithTitle("Biblioteca API - Notification Service")
           .WithTheme(ScalarTheme.DeepSpace)
           .WithOpenApiRoutePattern("/notification/openapi/v1.json");
});

app.UseStaticFiles();
app.UseRateLimiter();
app.MapReverseProxy();

app.MapHealthChecks("/health");

app.Run();
