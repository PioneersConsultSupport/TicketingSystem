using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AlRaneem.Website.DataAccess.Interfaces
{
    public interface ICategoryRepo
    {
        void AddCategory(Category category);
        Task<List<Category>> GetAllCategoryAsync();
        void UpdateCategory(Category category);
        Task<Category?> GetCategoryByIdAsync(int id);
        void DeleteCategory(Category category);

    }
}
