using CatalogService.Application.Abstractions;
using CatalogService.Application.Commands;
using CatalogService.Application.DTOs;
using CatalogService.Application.Handlers;
using CatalogService.Application.Queries;
using CatalogService.Domain.Entities;
using CatalogService.Domain.Repositories;
using CatalogService.Infrastructure;
using CatalogService.Infrastructure.Repositories;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using Scalar.AspNetCore;
using Shared.Contracts;
using Shared.Observability;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSharedObservability("CatalogService");

builder.Services.Configure<MongoSettings>(
    builder.Configuration.GetSection("MongoSettings"));
builder.Services.AddSingleton<MongoContext>();

BsonClassMap.RegisterClassMap<Book>(cm =>
{
    cm.AutoMap();
    cm.MapIdMember(u => u.Id)
      .SetSerializer(new GuidSerializer(MongoDB.Bson.GuidRepresentation.Standard));
});

builder.Services.AddScoped<IBookRepository, BookRepository>();

// CQRS Handlers
builder.Services.AddScoped<ICommandHandler<CreateBookCommand, BookResponseDto>, CreateBookHandler>();
builder.Services.AddScoped<ICommandHandler<UpdateBookCommand, Result<BookResponseDto>>, UpdateBookHandler>();
builder.Services.AddScoped<ICommandHandler<DeleteBookCommand, Result<bool>>, DeleteBookHandler>();
builder.Services.AddScoped<IQueryHandler<GetAllBooksQuery, IEnumerable<BookResponseDto>>, BookQueryHandler>();
builder.Services.AddScoped<IQueryHandler<GetBookByIdQuery, BookResponseDto?>, BookQueryHandler>();
builder.Services.AddScoped<IQueryHandler<SearchBooksQuery, IEnumerable<BookResponseDto>>, BookQueryHandler>();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var mongoConnectionString = builder.Configuration["MongoSettings:ConnectionString"] ?? "mongodb://localhost:27017";
builder.Services.AddHealthChecks()
    .AddMongoDb(sp => new MongoDB.Driver.MongoClient(mongoConnectionString), name: "mongodb", tags: ["ready"]);

var app = builder.Build();

// Inicializar banco de dados
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<MongoContext>();
    await MongoInitializer.InitializeAsync(context);
}

app.MapOpenApi();
app.MapScalarApiReference();

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHealthChecks("/health");
app.MapHealthChecks("/ready", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready")
});

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var exception = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>()?.Error;
        var traceId = context.TraceIdentifier;
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        logger.LogError(exception, "Unhandled exception. TraceId: {TraceId}", traceId);
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await context.Response.WriteAsJsonAsync(new
        {
            message = "Erro interno do servidor.",
            traceId
        });
    });
});

app.Run();
