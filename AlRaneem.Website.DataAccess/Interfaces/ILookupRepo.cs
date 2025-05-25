using AlRaneem.Website.DataAccess.Models.SupportSystemModels;

namespace AlRaneem.Website.DataAccess.Interfaces
{
    public interface ILookupRepo
    {
        Task<List<Lookup>> GetAllLookupsAsync();
        Task<List<Lookup>> GetLookupsByTypeAsync(string lookupType);
    }
}
