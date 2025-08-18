using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Interfaces;
using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using Azure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace AlRaneem.Website.DataAccess.Repsitories
{
    public class CategoryRepo : ICategoryRepo
    {
        private readonly ApplicationDbContext _context;
        public CategoryRepo(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Category>> GetAllCategoryAsync()
        {
            return await _context.Categories.ToListAsync();
        }
        public void AddCategory(Category category)
        {
            _context.Add(category);
        }
        public void UpdateCategory(Category category)
        {
            _context.Update(category);
        }
        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _context.Categories
                .Include(c => c.Subcategory)
                .FirstOrDefaultAsync(c => c.Id == id);
        }
        public void DeleteCategory(Category category)
        {
            _context.Remove(category);
        }
    }
}
