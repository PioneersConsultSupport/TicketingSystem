using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace AlRaneem.Website.DataAccess.Models.SupportSystemModels
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public ICollection<Subcategory> Subcategory { get; set; } = new List<Subcategory>();
    }
}
