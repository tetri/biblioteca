using System.Net;

namespace UserService.Application.Exceptions;

public sealed class InvalidCredentialsException : AppException
{
    public InvalidCredentialsException()
        : base("E-mail ou senha invalidos.", (int)HttpStatusCode.Unauthorized)
    {
    }
}
