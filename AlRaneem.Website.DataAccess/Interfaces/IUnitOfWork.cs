namespace AlRaneem.Website.DataAccess.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IEmployeeRepo employeeRepo { get; }
        IUserRoleRepo userRoleRepo { get; }
        ICommentRepo commentRepo { get; }
        ITicketRepo ticketRepo { get; }
        ICategoryRepo categoryRepo { get; }
        ISubcategoryRepo subcategoryRepo { get; }
        ITicketHistoryRepo ticketHistoryRepo { get; }


        int Complete();
    }
}