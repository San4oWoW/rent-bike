using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EFCore
{
    public class RentContext : DbContext
    {
        public RentContext(DbContextOptions<RentContext> options) : base(options) {}
        
        public DbSet<Bike> Bikes { get; set; }
    }
}
