﻿using AlRaneem.Website.DataAccess.Models.SupportSystemModels;

namespace AlRaneem.Website.DataAccess.Interfaces
{
    public interface ICommentRepo : IBaseRepo<Comment, int>
    {
        Task<List<Comment>> GetCommentsByTicketIdAsync(int ticketId);
    }


}
