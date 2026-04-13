using LoanService.Application.Abstractions;
using LoanService.Application.Commands;
using LoanService.Application.DTOs;
using LoanService.Application.Handlers;
using LoanService.Domain.Repositories;
using LoanService.Infrastructure;
using LoanService.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var mongoSettings = builder.Configuration.GetSection("MongoSettings");
builder.Services.AddSingleton(new MongoContext(
    mongoSettings["ConnectionString"] ?? "mongodb://localhost:27017",
    mongoSettings["DatabaseName"] ?? "loan_db"));

builder.Services.AddScoped<ILoanRepository, LoanRepository>();
builder.Services.AddScoped<ICommandHandler<CreateLoanCommand, LoanResponseDto>, CreateLoanHandler>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();
app.MapControllers();

app.Run();
