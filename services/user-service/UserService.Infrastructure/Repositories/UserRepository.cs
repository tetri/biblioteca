using MongoDB.Driver;

using UserService.Domain.Entities;
using UserService.Domain.Repositories;

namespace UserService.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly MongoContext _context;

    public UserRepository(MongoContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(Guid id)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Id, id);
        return await _context.Users.Find(filter).FirstOrDefaultAsync();
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Email, email);
        return await _context.Users.Find(filter).FirstOrDefaultAsync();
    }

    public async Task AddAsync(User user)
    {
        await _context.Users.InsertOneAsync(user);
    }

    public async Task UpdateAsync(User user)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Id, user.Id);
        await _context.Users.ReplaceOneAsync(filter, user);
    }
}
