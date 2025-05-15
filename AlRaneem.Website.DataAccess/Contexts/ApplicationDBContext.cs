using Microsoft.EntityFrameworkCore;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using AlRaneem.Website.DataAccess.Models;

namespace AlRaneem.Website.DataAccess.Contexts
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<UserRole> userRoles { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Subcategory> Subcategories { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) :
            base(options)
        { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Category>()
                .HasOne(c => c.ParentCategory)
                .WithMany(c => c.ChildCategories)
                .HasForeignKey(c => c.ParentCategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<UserRole>()
                .HasIndex(u => u.UserEmail)
                .IsUnique();

            modelBuilder.Entity<Subcategory>()
                .HasOne(sc => sc.Category)
                .WithMany(c => c.Subcategories)
                .HasForeignKey(sc => sc.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}