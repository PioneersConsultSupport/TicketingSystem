using AlRaneem.Website.DataAccess.Models.SupportSystemModels;

namespace AlRaneem.Website.DataAccess.Interfaces
{
    public interface ITicketRepo : IBaseRepo<Ticket, int>
    {
        Task<Ticket> GetByIdAsync(int id);
        Task<IEnumerable<string>> GetCategoriesAsync();
        Task<IEnumerable<string>> GetSubcategoriesAsync();
        Task<IEnumerable<string>> GetPrioritiesAsync();
        Task<IEnumerable<string>> GetStatusesAsync();
        Task UpdateAsync(Ticket ticket);
    }

}
