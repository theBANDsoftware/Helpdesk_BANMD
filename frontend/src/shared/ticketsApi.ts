import { apiPost } from './apiClient';
import type { categoryTicket,categoryLabels } from '../Types';


export type CreateTicketRequest = {
  title: string;
  description: string;
  category: categoryTicket;
};

export function createTicket(ticket: CreateTicketRequest): Promise<boolean> {
  return apiPost<boolean>('/ticket/create', ticket);
}
