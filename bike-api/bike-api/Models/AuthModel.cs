namespace bike_api.Models
{
    public record AuthModel
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
    }
}
