using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.EntityFrameworkCore;


namespace AlRaneem.Website.DataAccess.Repsitories
{
    public class LookupRepo : ILookupRepo
    {
        private readonly ApplicationDbContext _context;
        public LookupRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Lookup>> GetAllLookupsAsync()
        {
            return await _context.Lookups.ToListAsync();
        }


        public async Task<List<Lookup>> GetLookupsByTypeAsync(string lookupType)
        {
            return await _context.Lookups.Where(x => x.Type == lookupType).ToListAsync();
        }
    }
}
