using MongoDB.Driver;
using UserService.Domain.Entities;
using UserService.Domain.Services;

namespace UserService.Infrastructure;

public static class UserSeeder
{
    public static async Task SeedAsync(IMongoCollection<User> users, IPasswordHasher hasher)
    {
        // Seed Admin se não existir
        var adminExists = await users.Find(u => u.Role == "Admin").AnyAsync();
        if (!adminExists)
        {
            var admin = new User("Administrador", "admin@biblioteca.com", hasher.HashPassword("temp123"), "Admin", true, true);
            await users.InsertOneAsync(admin);
        }

        // Seed Demo se não existir
        var demoExists = await users.Find(u => u.Email == "demo@biblioteca.com").AnyAsync();
        if (!demoExists)
        {
            var demo = new User("Usuário Demo", "demo@biblioteca.com", hasher.HashPassword("demo123"), "Member", true);
            await users.InsertOneAsync(demo);
        }
    }
}
