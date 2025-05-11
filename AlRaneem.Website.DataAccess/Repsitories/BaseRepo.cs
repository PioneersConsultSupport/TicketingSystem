using AlRaneem.Website.DataAccess.Contexts;
using AlRaneem.Website.DataAccess.Interfaces;
using Microsoft.EntityFrameworkCore;
using Shared.Consts;
using System.Linq.Expressions;

namespace AlRaneem.Website.DataAccess.Repsitories
{
    public class BaseRepo<TEntity, TKey> : IBaseRepo<TEntity, TKey> where TEntity : class
    {
        protected ApplicationDbContext _context;
        private DbSet<TEntity> _entity;


        public BaseRepo(ApplicationDbContext context)
        {
            _context = context;
            _entity = context.Set<TEntity>();
        }

        public IEnumerable<TEntity> GetAll()
        {
            return _entity.ToList();
        }
        public IEnumerable<TEntity> GetAllAsNoTracking()
        {
            return _entity.AsNoTracking().ToList();
        }

        public async Task<IEnumerable<TEntity>> GetAllAsync()
        {
            return await _entity.ToListAsync();
        }
        public async Task<IEnumerable<TEntity>> GetAllAsync(string[] includes = null)
        {
            IQueryable<TEntity> query = _entity;

            if (includes != null)
                foreach (var incluse in includes)
                    query = query.Include(incluse);

            return await query.ToListAsync();
        }
        public async Task<IEnumerable<TEntity>> GetAllAsNoTrackingAsync(string[] includes = null)
        {
            IQueryable<TEntity> query = _entity.AsNoTracking();

            if (includes != null)
                foreach (var incluse in includes)
                    query = query.Include(incluse);

            return await query.ToListAsync();
        }

        public TEntity GetById(TKey id)
        {
            return _entity.Find(id);
        }

        public async Task<TEntity> GetByIdAsync(TKey id)
        {
            return await _entity.FindAsync(id);
        }

        public TEntity Find(Expression<Func<TEntity, bool>> criteria, string[] includes = null)
        {
            IQueryable<TEntity> query = _entity;

            if (includes != null)
                foreach (var incluse in includes)
                    query = query.Include(incluse);

            return query.SingleOrDefault(criteria);
        }
        public TEntity SingleAsNoTracking(Expression<Func<TEntity, bool>> criteria, string[] includes = null)
        {
            IQueryable<TEntity> query = _entity.AsNoTracking();

            if (includes != null)
                foreach (var incluse in includes)
                    query = query.Include(incluse);

            return query.Single(criteria);
        }
        public async Task<TEntity> SingleAsync(Expression<Func<TEntity, bool>> criteria, string[] includes = null)
        {
            IQueryable<TEntity> query = _entity;

            if (includes != null)
                foreach (var incluse in includes)
                    query = query.Include(incluse);

            return await query.SingleAsync(criteria);
        }
        public async Task<TEntity> SingleAsNoTrackingAsync(Expression<Func<TEntity, bool>> criteria, string[] includes = null)
        {
            IQueryable<TEntity> query = _entity.AsNoTracking();

            if (includes != null)
                foreach (var incluse in includes)
                    query = query.Include(incluse);

            return await query.SingleAsync(criteria);
        }
        public TEntity SingleOrDefaultAsNoTracking(Expression<Func<TEntity, bool>> criteria, string[] includes = null)
        {
            IQueryable<TEntity> query = _entity.AsNoTracking();

            if (includes != null)
                foreach (var incluse in includes)
                    query = query.Include(incluse);

            return query.SingleOrDefault(criteria);
        }
        public bool Any(Expression<Func<TEntity, bool>> criteria)
        {
            IQueryable<TEntity> query = _entity;

            return query.Any(criteria);
        }
        public async Task<bool> AnyAsync(Expression<Func<TEntity, bool>> criteria)
        {
            IQueryable<TEntity> query = _entity;

            return await query.AnyAsync(criteria);
        }

        public async Task<TEntity> FindAsync(Expression<Func<TEntity, bool>> criteria, string[] includes = null)
        {
            IQueryable<TEntity> query = _entity;

            if (includes != null)
                foreach (var incluse in includes)
                    query = query.Include(incluse);

            return await query.SingleOrDefaultAsync(criteria);
        }

        public IEnumerable<TEntity> FindAll(Expression<Func<TEntity, bool>> criteria, string[] includes = null)
        {
            IQueryable<TEntity> query = _entity;

            if (includes != null)
                foreach (var include in includes)
                    query = query.Include(include);

            return query.Where(criteria).ToList();
        }

        public IEnumerable<TEntity> FindAll(Expression<Func<TEntity, bool>> criteria, int skip, int take)
        {
            return _entity.Where(criteria).Skip(skip).Take(take).ToList();
        }

        public IEnumerable<TEntity> FindAll(Expression<Func<TEntity, bool>> criteria, int? skip, int? take,
            Expression<Func<TEntity, object>> orderBy = null, string orderByDirection = OrderBy.Ascending)
        {
            IQueryable<TEntity> query = _entity.Where(criteria);

            if (skip.HasValue)
                query = query.Skip(skip.Value);

            if (take.HasValue)
                query = query.Take(take.Value);

            if (orderBy != null)
            {
                if (orderByDirection == OrderBy.Ascending)
                    query = query.OrderBy(orderBy);
                else
                    query = query.OrderByDescending(orderBy);
            }

            return query.ToList();
        }

        public async Task<IEnumerable<TEntity>> FindAllAsync(Expression<Func<TEntity, bool>> criteria, string[] includes = null)
        {
            IQueryable<TEntity> query = _entity;

            if (includes != null)
                foreach (var include in includes)
                    query = query.Include(include);

            return await query.Where(criteria).ToListAsync();
        }

        public async Task<IEnumerable<TEntity>> FindAllAsNoTrackingAsync(Expression<Func<TEntity, bool>> criteria, string[] includes = null)
        {
            IQueryable<TEntity> query = _entity.AsNoTracking();

            if (includes != null)
                foreach (var include in includes)
                    query = query.Include(include);

            return await query.Where(criteria).ToListAsync();
        }

        public async Task<IEnumerable<TEntity>> FindAllAsync(Expression<Func<TEntity, bool>> criteria, int take, int skip)
        {
            return await _entity.Where(criteria).Skip(skip).Take(take).ToListAsync();
        }

        public async Task<IEnumerable<TEntity>> FindAllAsync(Expression<Func<TEntity, bool>> criteria, int? take, int? skip,
            Expression<Func<TEntity, object>> orderBy = null, string orderByDirection = OrderBy.Ascending)
        {
            IQueryable<TEntity> query = _entity.Where(criteria);

            if (take.HasValue)
                query = query.Take(take.Value);

            if (skip.HasValue)
                query = query.Skip(skip.Value);

            if (orderBy != null)
            {
                if (orderByDirection == OrderBy.Ascending)
                    query = query.OrderBy(orderBy);
                else
                    query = query.OrderByDescending(orderBy);
            }

            return await query.ToListAsync();
        }
        public async Task<IEnumerable<TEntity>> FindAllAsNoTrackingAsync(Expression<Func<TEntity, bool>> criteria, int? take, int? skip,
            Expression<Func<TEntity, object>> orderBy = null, string orderByDirection = OrderBy.Ascending)
        {
            IQueryable<TEntity> query = _entity.AsNoTracking().Where(criteria);

            if (take.HasValue)
                query = query.Take(take.Value);

            if (skip.HasValue)
                query = query.Skip(skip.Value);

            if (orderBy != null)
            {
                if (orderByDirection == OrderBy.Ascending)
                    query = query.OrderBy(orderBy);
                else
                    query = query.OrderByDescending(orderBy);
            }

            return await query.ToListAsync();
        }
        public async Task<IEnumerable<TEntity>> FindAllAsync(Expression<Func<TEntity, bool>> criteria, int? take, int? skip,
            string[] includes = null, Expression<Func<TEntity, object>> orderBy = null, string orderByDirection = OrderBy.Ascending)
        {

            // Start with the entity set
            IQueryable<TEntity> query = _entity;

            // Apply includes for navigation properties first
            if (includes != null)
            {
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
            }

            // Apply the where criteria
            query = query.Where(criteria);

            // Apply ordering
            if (orderBy != null)
            {
                query = orderByDirection == OrderBy.Ascending
                    ? query.OrderBy(orderBy)
                    : query.OrderByDescending(orderBy);
            }

            // Apply skip if specified
            if (skip.HasValue)
            {
                query = query.Skip(skip.Value);
            }

            // Apply take if specified
            if (take.HasValue)
            {
                query = query.Take(take.Value);
            }

            // Execute the query and return the result
            return await query.ToListAsync();
        }
        public async Task<IEnumerable<TEntity>> FindAllAsNoTrackingAsync(Expression<Func<TEntity, bool>> criteria, int? take, int? skip,
           string[] includes = null, Expression<Func<TEntity, object>> orderBy = null, string orderByDirection = OrderBy.Ascending)
        {

            // Start with the entity set
            IQueryable<TEntity> query = _entity.AsNoTracking();

            // Apply includes for navigation properties first
            if (includes != null)
            {
                foreach (var include in includes)
                {
                    query = query.Include(include);
                }
            }

            // Apply the where criteria
            query = query.Where(criteria);

            // Apply ordering
            if (orderBy != null)
            {
                query = orderByDirection == OrderBy.Ascending
                    ? query.OrderBy(orderBy)
                    : query.OrderByDescending(orderBy);
            }

            // Apply skip if specified
            if (skip.HasValue)
            {
                query = query.Skip(skip.Value);
            }

            // Apply take if specified
            if (take.HasValue)
            {
                query = query.Take(take.Value);
            }

            // Execute the query and return the result
            return await query.ToListAsync();
        }

        public TEntity Add(TEntity entity)
        {
            _entity.Add(entity);
            return entity;
        }

        public async Task<TEntity> AddAsync(TEntity entity)
        {
            await _entity.AddAsync(entity);
            return entity;
        }

        public IEnumerable<TEntity> AddRange(IEnumerable<TEntity> entities)
        {
            _entity.AddRange(entities);
            return entities;
        }

        public async Task<IEnumerable<TEntity>> AddRangeAsync(IEnumerable<TEntity> entities)
        {
            await _entity.AddRangeAsync(entities);
            return entities;
        }

        public TEntity Update(TEntity entity)
        {
            _context.Update(entity);
            return entity;
        }

        public void Delete(TEntity entity)
        {
            _entity.Remove(entity);
        }

        public void DeleteRange(IEnumerable<TEntity> entities)
        {
            _entity.RemoveRange(entities);
        }

        public void Attach(TEntity entity)
        {
            _entity.Attach(entity);
        }

        public void AttachRange(IEnumerable<TEntity> entities)
        {
            _entity.AttachRange(entities);
        }

        public int Count()
        {
            return _entity.Count();
        }

        public int Count(Expression<Func<TEntity, bool>> criteria)
        {
            return _entity.Count(criteria);
        }

        public async Task<int> CountAsNoTrackingAsync()
        {
            return await _entity.AsNoTracking().CountAsync();
        }
        public async Task<int> CountAsync()
        {
            return await _entity.CountAsync();
        }

        public async Task<int> CountAsync(Expression<Func<TEntity, bool>> criteria)
        {
            return await _entity.CountAsync(criteria);
        }
    }
}