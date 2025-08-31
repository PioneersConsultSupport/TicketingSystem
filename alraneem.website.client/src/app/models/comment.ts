import { UserRole } from "./user-role";

export class Comment {
  id?: number;
  message: string = '';
  createdAt?: string;
  ticketId?: number;
  createdBy?: UserRole;
}
