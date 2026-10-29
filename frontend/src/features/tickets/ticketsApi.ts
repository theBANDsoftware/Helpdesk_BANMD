import { apiGet, apiPost } from '../../shared/apiClient';
import type { categoryTicket, TicketStatus, TicketDetail } from '../../Types';

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

//  Status enum och status i läsbar text
export const statusLabels: Record<TicketStatus, string> = {
  NEW: 'Ny',
  IN_PROGRESS: 'Pågår',
  RESOLVED: 'Löst',
};

export const ticketColumns: Record<string, string> = {
  title:        "Titel",
  description:  "Beskrivning",
  category:     "Ärendetyp",
  status:       "Status",
  assignedTo:   "Tekniker",
  createdBy:    "Anmälare",
  createdAt:    "Skapat",
  updatedAt:    "Uppdaterat"
};

export function createTicket(ticket: CreateTicketRequest): Promise<void> {
  return apiPost<void>('/tickets', ticket);
}

export function getTicket(id: number): Promise<TicketDetail> {
  return apiGet<TicketDetail>(`/tickets/${id}`);
}