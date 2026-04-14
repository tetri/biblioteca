using UserService.Application.Abstractions;
using UserService.Application.Commands;
using UserService.Domain.Repositories;
using UserService.Domain.Services;
using Shared.Contracts;

namespace UserService.Application.Handlers;

public class SetupPasswordHandler : ICommandHandler<SetupPasswordCommand, Result<bool>>
{
    private readonly IUserRepository _repo;
    private readonly IPasswordHasher _hasher;

    public SetupPasswordHandler(IUserRepository repo, IPasswordHasher hasher)
    {
        _repo = repo;
        _hasher = hasher;
    }

    public async Task<Result<bool>> Handle(SetupPasswordCommand command)
    {
        var user = await _repo.GetByEmailAsync(command.Email);
        
        if (user == null || !_hasher.VerifyPassword(command.CurrentPassword, user.PasswordHash))
            return Result<bool>.Failure("Credenciais inválidas.");

        user.UpdatePassword(_hasher.HashPassword(command.NewPassword));
        await _repo.UpdateAsync(user);

        return Result<bool>.Success(true);
    }
}
