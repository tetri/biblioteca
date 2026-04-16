using System.Net;

namespace UserService.Application.Exceptions;

public sealed class InvalidUserRoleException : AppException
{
    public InvalidUserRoleException(string role)
        : base($"Perfil '{role}' e invalido. Perfis aceitos: Admin, Member.", (int)HttpStatusCode.BadRequest)
    {
    }
}
