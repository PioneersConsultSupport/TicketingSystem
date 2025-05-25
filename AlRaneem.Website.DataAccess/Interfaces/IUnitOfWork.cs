namespace AlRaneem.Website.DataAccess.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        //IBaseRepository<SalesUser, uint> salesUserNoCustomization { get; }
        IEmployeeRepo employeeRepo { get; }
        IUserRoleRepo userRoleRepo { get; }
        ICommentRepo commentRepo { get; }
        ITicketRepo ticketRepo { get; }
        ILookupRepo lookupRepo { get; }
        int Complete();
    }
}