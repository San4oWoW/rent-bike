using EFCore.Enums;
using System.Collections.Generic; // Необходимо для использования List<>

namespace Domain.Entities
{
    public class Bike
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public byte[]? Image { get; set; }
        public bool IsReserved { get; set; }
        public bool IsDeleted { get; set; }
        public string? UserId { get; set; }
        public CategryEnum CategryEnum { get; set; }

        public ICollection<Comments> Comments { get; set; } = new List<Comments>();

        public Bike() { }
    }
}
