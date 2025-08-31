using AlRaneem.Website.DataAccess.Models;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
namespace AlRaneem.Website.DataAccess.Contexts
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<Employee> Employees { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<UserRole> userRoles { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Subcategory> subcategories { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<TicketHistory> TicketHistory { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) :
            base(options)
        { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // RefNumber 
            modelBuilder.Entity<Ticket>()
                .HasIndex(t => t.RefNumber)
                .IsUnique();

            // UserRole ↔ Ticket
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.AssignedTo)
                .WithMany(u => u.AssignedToTickets)
                .HasForeignKey(t => t.AssignedToId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.CreatedBy)
                .WithMany(u => u.CreatedByTickets)
                .HasForeignKey(t => t.CreatedById)
                .OnDelete(DeleteBehavior.Restrict);

            // Ticket ↔ Subcategory (Status & Priority & Subcategory)
            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Status)
                .WithMany()
                .HasForeignKey(t => t.StatusId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.supportOption)
                .WithMany()
                .HasForeignKey(t => t.SupportOptionId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Priority)
                .WithMany()
                .HasForeignKey(t => t.PriorityId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Category)
                .WithMany()
                .HasForeignKey(t => t.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Ticket>()
                .HasOne(t => t.Subcategory)
                .WithMany()
                .HasForeignKey(t => t.SubcategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            // Category ↔ Subcategory
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Subcategory)
                .WithOne()
                .HasForeignKey(sc => sc.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // UserEmail
            modelBuilder.Entity<UserRole>()
                .HasIndex(u => u.UserEmail)
                .IsUnique();

            // Comment
            modelBuilder.Entity<Comment>()
                .HasOne(c => c.CreatedBy)
                .WithMany()
                .HasForeignKey(c => c.CreatedById)
                .OnDelete(DeleteBehavior.Cascade);

            // TicketHistory
            modelBuilder.Entity<TicketHistory>()
                .HasOne(c => c.CreatedBy)
                .WithMany()
                .HasForeignKey(c => c.CreatedById)
                .OnDelete(DeleteBehavior.Cascade);

            // TicketHistory ↔ HistoryDetails (store as JSON)
            modelBuilder.Entity<TicketHistory>()
                .Property(th => th.HistoryDetails)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null), 
                    v => JsonSerializer.Deserialize<string[]>(v, (JsonSerializerOptions)null)! 
                );
        }
    }
}