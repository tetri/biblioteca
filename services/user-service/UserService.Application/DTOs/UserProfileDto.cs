namespace UserService.Application.DTOs
{
    public class UserProfileDto
    {
        public Guid Id { get; set; } = default!;
        public string Name { get; set; } = default!;
        public string Email { get; set; } = default!;
    }
}
