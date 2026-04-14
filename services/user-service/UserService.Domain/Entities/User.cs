namespace UserService.Domain.Entities;

public sealed class User
{
    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public bool IsApproved { get; private set; } = false;
    public string Role { get; private set; } = "Member";
    public bool IsSetupRequired { get; private set; } = false;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    private User() { }

    public User(string name, string email, string passwordHash, string role = "Member", bool isApproved = false, bool isSetupRequired = false)
    {
        Id = Guid.NewGuid();
        Name = name;
        Email = email;
        PasswordHash = passwordHash;
        Role = role;
        IsApproved = isApproved;
        IsSetupRequired = isSetupRequired;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Approve()
    {
        IsApproved = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Name cannot be empty", nameof(name));

        Name = name;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdatePassword(string passwordHash)
    {
        if (string.IsNullOrWhiteSpace(passwordHash))
            throw new ArgumentException("Password hash cannot be empty", nameof(passwordHash));

        PasswordHash = passwordHash;
        UpdatedAt = DateTime.UtcNow;
    }
}
