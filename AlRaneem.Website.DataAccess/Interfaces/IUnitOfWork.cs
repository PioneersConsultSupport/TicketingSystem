namespace AlRaneem.Website.DataAccess.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        //IBaseRepository<SalesUser, uint> salesUserNoCustomization { get; }
        IEmployeeRepo employeeRepo { get; }
        IUserRoleRepo userRoleRepo { get; }
        ICategoryRepo categoryRepo{ get; }
        ICommentRepo commentRepo { get; }
        ITicketRepo ticketRepo { get; }
        int Complete();
    }
}