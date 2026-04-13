namespace LoanService.Application.Abstractions;

public interface ICommandHandler<TCommand, TResult>
{
    Task<TResult> Handle(TCommand command);
}
