import { Category } from "./category";
import { Subcategory } from "./subcategory";
import { UserRole } from "./user-role";

export class Ticket {
  id?: number;
  title: string = '';
  description: string = '';
  refNumber: string ='';

  priorityId?: number;
  priority?:Subcategory;

  statusId?: number;
  status?:Subcategory;

  supportOptionId?: number;
  supportOption?: Subcategory;

  categoryId?: number;
  category?: Category;
  subcategoryId?: number;
  subcategory?:Subcategory;

  startDate?: string;
  deliveryDate?: string;

  assignedToId?: number;
  assignedTo?:UserRole;
  createdById?: number;
  createdBy?:UserRole;

}