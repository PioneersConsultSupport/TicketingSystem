export class Ticket {
    id!: number;
    title!: string;
    description!: string;
    createdById!: number;
    status!: string;
    statusId!: number;
    category!: string;
    categoryId!: number;
    subcategory?: string;
    subcategoryId?: number;
    supportType!: string;
    supportTypeId!: number;
    priority!: string;
    priorityId!: number;
    assignedTo!: string;
    assignedToId!: number;
}