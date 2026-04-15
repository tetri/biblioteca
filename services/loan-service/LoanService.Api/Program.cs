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

var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? throw new InvalidOperationException("Jwt:Issuer is missing");
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? throw new InvalidOperationException("Jwt:Audience is missing");
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is missing");

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
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.Zero
        };
    });

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var mongoContext = scope.ServiceProvider.GetRequiredService<MongoContext>();
    await mongoContext.ConfigureIndexesAsync();
}

app.MapOpenApi();
app.MapScalarApiReference(options => {
    options.WithTitle("Biblioteca API - LoanService");
    options.WithTheme(ScalarTheme.DeepSpace);
});

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
