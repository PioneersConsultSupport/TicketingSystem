using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AlRaneem.Website.DataAccess.Models.SupportSystemModels
{
    public class Subcategory
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public ICollection<Ticket> Tickets { get; set; }
    }
}
