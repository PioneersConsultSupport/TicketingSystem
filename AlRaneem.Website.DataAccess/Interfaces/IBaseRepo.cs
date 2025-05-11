using Shared.Consts;
using System.Linq.Expressions;

namespace AlRaneem.Website.DataAccess.Interfaces
{
    public interface IBaseRepo<TEntity, TKey> where TEntity : class
    {
        TEntity GetById(TKey id);
        Task<TEntity> GetByIdAsync(TKey id);
        IEnumerable<TEntity> GetAll();
        Task<IEnumerable<TEntity>> GetAllAsync();
        TEntity Find(Expression<Func<TEntity, bool>> criteria, string[] includes = null);
        Task<TEntity> FindAsync(Expression<Func<TEntity, bool>> criteria, string[] includes = null);
        bool Any(Expression<Func<TEntity, bool>> criteria);
        Task<bool> AnyAsync(Expression<Func<TEntity, bool>> criteria);
        IEnumerable<TEntity> FindAll(Expression<Func<TEntity, bool>> criteria, string[] includes = null);
        IEnumerable<TEntity> FindAll(Expression<Func<TEntity, bool>> criteria, int take, int skip);
        IEnumerable<TEntity> FindAll(Expression<Func<TEntity, bool>> criteria, int? take, int? skip,
            Expression<Func<TEntity, object>> orderBy = null, string orderByDirection = OrderBy.Ascending);

        Task<IEnumerable<TEntity>> FindAllAsync(Expression<Func<TEntity, bool>> criteria, string[] includes = null);
        Task<IEnumerable<TEntity>> FindAllAsNoTrackingAsync(Expression<Func<TEntity, bool>> criteria, string[] includes = null);
        Task<IEnumerable<TEntity>> FindAllAsync(Expression<Func<TEntity, bool>> criteria, int skip, int take);
        Task<IEnumerable<TEntity>> FindAllAsync(Expression<Func<TEntity, bool>> criteria, int? skip, int? take,
            Expression<Func<TEntity, object>> orderBy = null, string orderByDirection = OrderBy.Ascending);
        TEntity Add(TEntity entity);
        Task<TEntity> AddAsync(TEntity entity);
        IEnumerable<TEntity> AddRange(IEnumerable<TEntity> entities);
        Task<IEnumerable<TEntity>> AddRangeAsync(IEnumerable<TEntity> entities);
        TEntity Update(TEntity entity);
        void Delete(TEntity entity);
        void DeleteRange(IEnumerable<TEntity> entities);
        void Attach(TEntity entity);
        void AttachRange(IEnumerable<TEntity> entities);
        int Count();
        int Count(Expression<Func<TEntity, bool>> criteria);
        Task<int> CountAsync();
        Task<int> CountAsync(Expression<Func<TEntity, bool>> criteria);
        Task<IEnumerable<TEntity>> GetAllAsync(string[] includes = null);
        Task<IEnumerable<TEntity>> FindAllAsync(Expression<Func<TEntity, bool>> criteria, int? take, int? skip, string[] includes = null, Expression<Func<TEntity, object>> orderBy = null, string orderByDirection = "ASC");
        TEntity SingleAsNoTracking(Expression<Func<TEntity, bool>> criteria, string[] includes = null);
        TEntity SingleOrDefaultAsNoTracking(Expression<Func<TEntity, bool>> criteria, string[] includes = null);
        Task<IEnumerable<TEntity>> GetAllAsNoTrackingAsync(string[] includes = null);
        IEnumerable<TEntity> GetAllAsNoTracking();
        Task<TEntity> SingleAsNoTrackingAsync(Expression<Func<TEntity, bool>> criteria, string[] includes = null);
        Task<int> CountAsNoTrackingAsync();
        Task<IEnumerable<TEntity>> FindAllAsNoTrackingAsync(Expression<Func<TEntity, bool>> criteria, int? take, int? skip, Expression<Func<TEntity, object>> orderBy = null, string orderByDirection = "ASC");
        Task<TEntity> SingleAsync(Expression<Func<TEntity, bool>> criteria, string[] includes = null);
        Task<IEnumerable<TEntity>> FindAllAsNoTrackingAsync(Expression<Func<TEntity, bool>> criteria, int? take, int? skip, string[] includes = null, Expression<Func<TEntity, object>> orderBy = null, string orderByDirection = "ASC");
        //Task<IEnumerable<TEntity>> AddRangeWithAutoIdAsync(IEnumerable<TEntity> entities);
        //IEnumerable<TEntity> AddRangeWithAutoId(IEnumerable<TEntity> entities);
    }
}