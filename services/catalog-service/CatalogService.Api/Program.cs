using CatalogService.Application.Interfaces;
using CatalogService.Application.Services;
using CatalogService.Domain.Entities;
using CatalogService.Domain.Repositories;
using CatalogService.Infrastructure;
using CatalogService.Infrastructure.Repositories;

using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;

using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

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
builder.Services.AddScoped<IBookService, BookService>();


builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
