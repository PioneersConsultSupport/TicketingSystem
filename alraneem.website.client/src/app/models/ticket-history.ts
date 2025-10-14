import { UserRole } from './user-role';

export class TicketHistory {
  id?: number;
  historyDetails: string[] = [];
  createdAt?: string;
  ticketId?: number;
  createdBy?: UserRole;
}
