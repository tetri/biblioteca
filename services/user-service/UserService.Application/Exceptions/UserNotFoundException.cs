using System.Net;

namespace UserService.Application.Exceptions;

public sealed class UserNotFoundException : AppException
{
    public UserNotFoundException(Guid userId)
        : base($"Usuario '{userId}' nao encontrado.", (int)HttpStatusCode.NotFound)
    {
    }
}
