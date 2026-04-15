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
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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
builder.Services.AddScoped<IQueryHandler<LoanService.Application.Queries.GetLoansByUserIdQuery, IEnumerable<LoanResponseDto>>, GetLoansByUserIdHandler>();

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is missing"))),
            ClockSkew = TimeSpan.Zero
        };
    });

var app = builder.Build();

app.MapOpenApi();
app.MapScalarApiReference(options => {
    options.WithTitle("Biblioteca API - LoanService");
    options.WithTheme(ScalarTheme.DeepSpace);
});

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
