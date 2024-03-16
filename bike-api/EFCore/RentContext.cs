using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace EFCore
{
    public class RentContext : DbContext
    {
        public RentContext(DbContextOptions<RentContext> options) : base(options)
        {
        }
        public DbSet<Test> Test { get; set; }
        public DbSet<Test2> Test2 { get; set; }

    }
}
