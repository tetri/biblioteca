﻿namespace UserService.Api.DTOs
{
    public class RegisterUserRequest
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }

        public RegisterUserRequest() { }
    }
}
