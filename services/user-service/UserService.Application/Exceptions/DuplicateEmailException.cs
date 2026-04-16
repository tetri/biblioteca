using System.Net;

namespace UserService.Application.Exceptions;

public sealed class DuplicateEmailException : AppException
{
    public DuplicateEmailException(string email)
        : base($"O e-mail '{email}' ja esta cadastrado.", (int)HttpStatusCode.Conflict)
    {
    }
}
