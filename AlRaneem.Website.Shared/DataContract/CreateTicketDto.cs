using System.Xml.Linq;

namespace AlRaneem.Website.Shared.DataContract
{
    public class CreateTicketDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int CategoryId { get; set; }
    }
}
