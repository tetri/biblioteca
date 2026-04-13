using FluentAssertions;

namespace Shared.Tests;

public class SharedTests
{
    [Fact]
    public void TestInfrastructureAvailability()
    {
        // Exemplo simples de teste em Shared para garantir que o projeto está operante
        true.Should().BeTrue();
    }
}
