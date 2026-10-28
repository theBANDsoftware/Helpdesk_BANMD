import { apiPost } from './apiClient';
import type { categoryTicket } from '../Types';


export type CreateTicketRequest = {
  title: string;
  description: string;
  category: categoryTicket;
};

export function createTicket(ticket: CreateTicketRequest): Promise<boolean> {
  console.log("woho 2");
  return apiPost<boolean>('/ticket/create', ticket);
}
