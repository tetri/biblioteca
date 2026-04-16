using System.Net;

namespace UserService.Application.Exceptions;

public sealed class UserNotApprovedException : AppException
{
    public UserNotApprovedException()
        : base("Sua conta ainda esta pendente de aprovacao administrativa.", (int)HttpStatusCode.Forbidden)
    {
    }
}
