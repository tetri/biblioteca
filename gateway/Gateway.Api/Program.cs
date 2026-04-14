using Scalar.AspNetCore;
using Microsoft.AspNetCore.OpenApi;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddOpenApi();

var app = builder.Build();

app.MapOpenApi();
app.MapScalarApiReference("/docs", options => {
    options.WithTitle("Biblioteca API - Gateway Central");
    options.WithTheme(ScalarTheme.DeepSpace);
});

app.UseStaticFiles();
app.MapReverseProxy();

app.Run();
