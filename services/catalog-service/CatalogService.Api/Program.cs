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

var app = builder.Build();

app.MapOpenApi();
app.MapScalarApiReference();

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
