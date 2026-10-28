import { apiPost } from '../../shared/apiClient';
import type { categoryTicket } from '../../Types';

export type CreateTicketRequest = {
  title: string;
  description: string;
  category: categoryTicket;
};

export const categoryLabels: Record<categoryTicket, string> = {
  COMPUTER: 'Dator',
  PRINTER: 'Skrivare',
  NETWORK: 'Nätverk',
  ACCOUNT: 'Konto och behörighet',
  OTHER: 'Annat',
};

export function createTicket(ticket: CreateTicketRequest): Promise<void> {
  return apiPost<void>('/tickets', ticket);
}
