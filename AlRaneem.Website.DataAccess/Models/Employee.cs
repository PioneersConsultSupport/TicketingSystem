using System.ComponentModel.DataAnnotations;

namespace AlRaneem.Website.DataAccess.Models
{
    public class Employee
    {
        [Key]
        public Guid Id { get; set; }

        [MaxLength(3)]
        public string Title { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [Required]
        [MaxLength(100)]
        public string Role { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        public byte[]? ProfileImage { get; set; }

        [MaxLength(255)]
        public string? TwitterUrl { get; set; }

        [MaxLength(255)]
        public string? FacebookUrl { get; set; }

        [MaxLength(255)]
        public string? InstagramUrl { get; set; }

        [MaxLength(255)]
        public string? LinkedInUrl { get; set; }
    }

}