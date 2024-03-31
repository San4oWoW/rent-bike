namespace Domain.Entities
{
    public record RegisterModel
    {
        public required string Username { get; set; }
        public required string Login { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
