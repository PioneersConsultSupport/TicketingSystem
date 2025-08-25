using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AlRaneem.Website.DataAccess.Repsitories
{
    public class SubcategoryRepo : ISubcategoryRepo
    {
        private readonly ApplicationDbContext _context;
        public SubcategoryRepo(ApplicationDbContext context)
        {
            _context = context;
        }
        public void AddSubcategory(Subcategory subcategory)
        {
            _context.Add(subcategory);
        }
        public void UpdateSubcategory(Subcategory subcategory)
        {
            _context.Update(subcategory);
        }
        public async Task<Subcategory?> GetSubcategoryByIdAsync(int id)
        {
            return await _context.subcategories
                .FirstOrDefaultAsync(s => s.Id == id);
        }
        public void DeleteSubcategory(Subcategory subcategory)
        {
            _context.Remove(subcategory);
        }
        public async Task<List<Subcategory>> GetSubcategoryByCategoryIdAsync(int categoryId)
        {
            return await _context.subcategories
                .Where(sc => sc.CategoryId == categoryId)
                .ToListAsync();
        }
    }
}
