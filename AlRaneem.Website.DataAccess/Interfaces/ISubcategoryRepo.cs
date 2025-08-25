using AlRaneem.Website.DataAccess.Models.SupportSystemModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AlRaneem.Website.DataAccess.Interfaces
{
    public interface ISubcategoryRepo
    {
        void AddSubcategory(Subcategory subcategory);
        void UpdateSubcategory(Subcategory subcategory);
        Task<Subcategory?> GetSubcategoryByIdAsync(int id);
        Task<List<Subcategory>> GetSubcategoryByCategoryIdAsync(int categoryId);
        void DeleteSubcategory(Subcategory subcategory);
    }
}
