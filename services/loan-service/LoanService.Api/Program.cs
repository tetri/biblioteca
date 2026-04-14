using LoanService.Application.Abstractions;
using LoanService.Application.Commands;
using LoanService.Application.DTOs;
using LoanService.Application.Handlers;
using LoanService.Domain.Repositories;
using LoanService.Infrastructure;
using LoanService.Infrastructure.Repositories;
using Shared.Contracts;
using Shared.Observability;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSharedObservability("LoanService");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

var mongoSettings = builder.Configuration.GetSection("MongoSettings");
builder.Services.AddSingleton(new MongoContext(
    mongoSettings["ConnectionString"] ?? "mongodb://localhost:27017",
    mongoSettings["DatabaseName"] ?? "loan_db"));

builder.Services.AddScoped<ILoanRepository, LoanRepository>();
builder.Services.AddScoped<ICommandHandler<CreateLoanCommand, Result<LoanResponseDto>>, CreateLoanHandler>();
builder.Services.AddScoped<ICommandHandler<ReserveLoanCommand, Result<LoanResponseDto>>, ReserveLoanHandler>();

var app = builder.Build();

app.MapOpenApi();
app.MapScalarApiReference(options => {
    options.WithTitle("Biblioteca API - LoanService");
    options.WithTheme(ScalarTheme.DeepSpace);
});

app.UseAuthorization();
app.MapControllers();

app.Run();
