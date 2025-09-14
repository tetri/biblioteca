using UserService.Domain.Entities;

namespace UserService.Domain.Services;

public interface IJwtProvider
{
    string GenerateToken(User user);
}
