using EFCore;
using EFCore.Enums;

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
        public CategryEnum Categry { get; set; }
        public Comments Comments { get; set; }
        public Bike() { }
    }
}
