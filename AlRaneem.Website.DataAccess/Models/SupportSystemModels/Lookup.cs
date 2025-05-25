
using System.ComponentModel.DataAnnotations.Schema;

namespace AlRaneem.Website.DataAccess.Models.SupportSystemModels
{
    public class Lookup
    {
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }
        public string Type { get; set; } = default!; 
        public string Name { get; set; } = default!;
        public int? ParentId { get; set; }
        public Lookup? Parent { get; set; }
        public int SortOrder { get; set; } = 0;
        public bool IsActive { get; set; } = true;
        public ICollection<Lookup>? Children { get; set; }
    }
}
