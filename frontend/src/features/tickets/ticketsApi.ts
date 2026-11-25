import { apiRequest } from '../../shared/apiClient';
import type { categoryTicket, TicketPriority, TicketSummary } from '../../Types';

// Återanvänder eller definierar status- och kategorityper
export type StatusTicket = 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'WITHDRAWN';

// Svenska visningstexter för kategorier (synkade med Category.java i backend)
export const categoryLabels: Record<categoryTicket, string> = {
  COMPUTER: 'Dator',
  PRINTER: 'Skrivare',
  NETWORK: 'Nätverk',
  ACCOUNT: 'Konto och behörighet',
  OTHER: 'Annat',
};

// Svenska visningstexter för ärendestatus
export const statusLabels: Record<StatusTicket, string> = {
  NEW: 'Ny',
  IN_PROGRESS: 'Pågående',
  RESOLVED: 'Löst',
  WITHDRAWN: 'Återkallad', // Anmälaren har tagit tillbaka ärendet (TB-51)
};
// Svenska visningstexter för ärendeprioritering
export const priorityLabels: Record<TicketPriority, string> = {
  LOW: 'Låg',
  MEDIUM: 'Mellan',
  HIGH: 'Hög',
};

// Kolumnrubriker som används av DataTable i TicketDetail
export const ticketColumns: Record<string, string> = {
  id: 'Ärendenummer',
  category: 'Kategori',
  status: 'Status',
  priority: 'Prioritet',
  createdBy: 'Anmälare',
  assignedTo: 'Tilldelad',
  createdAt: 'Skapad',
  updatedAt: 'Uppdaterad',
};

// DTO för att skapa ett ärende
export interface CreateTicketDTO {
  title: string;
  description: string;
  category: categoryTicket;
}

// Svarsstrukturen som matchar backendens TicketDetailResponse.java
export interface TicketDetailResponse {
  id: number;
  title: string;
  description: string;
  category: categoryTicket;
  status: StatusTicket;
  priority: TicketPriority;
  createdById: number;
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}

// DTO för tilldelning av ärende
export interface AssignTicketRequest {
  assignedToUserId: number | null;
}

/** Hämtar ett enskilt ärende via ID */
export async function getTicket(id: number): Promise<TicketDetailResponse> {
  return apiRequest<TicketDetailResponse>(`/tickets/${id}`);
}

/** Skapar ett nytt ärende. Den som är inloggad blir anmälare (TB-33). */
export async function createTicket(ticket: CreateTicketDTO): Promise<TicketDetailResponse> {
  return apiRequest<TicketDetailResponse>('/tickets', 'POST', ticket);
}

/** Anmälaren ändrar rubrik, beskrivning och kategori medan ärendet har status Ny (TB-51). */
export async function updateTicket(
  ticketId: number,
  ticket: CreateTicketDTO,
): Promise<TicketDetailResponse> {
  return apiRequest<TicketDetailResponse>(`/tickets/${ticketId}`, 'PUT', ticket);
}

/** Anmälaren tar tillbaka ärendet medan det har status Ny. Det får status Återkallad (TB-51). */
export async function withdrawTicket(ticketId: number): Promise<TicketDetailResponse> {
  return apiRequest<TicketDetailResponse>(`/tickets/${ticketId}/withdraw`, 'POST');
}

/**
 * Anmälaren öppnar sitt lösta eller återkallade ärende igen (TB-73).
 * Löst blir Pågående, återkallat blir Ny.
 */
export async function reopenTicket(ticketId: number): Promise<TicketDetailResponse> {
  return apiRequest<TicketDetailResponse>(`/tickets/${ticketId}/reopen`, 'POST');
}

/** Tilldelar ärendet till en IT-ansvarig eller tar bort tilldelningen (null) */
export async function assignTicket(
  ticketId: number,
  assignedToUserId: number | null,
): Promise<TicketDetailResponse> {
  return apiRequest<TicketDetailResponse>(`/tickets/${ticketId}/assign`, 'PUT', {
    assignedToUserId,
  });
}

/** Ändrar status på ärendet. Bara IT-ansvariga får göra det, backend svarar annars 403 (TB-27). */
export async function updateTicketStatus(
  ticketId: number,
  status: StatusTicket,
  resolution?: string,
): Promise<TicketDetailResponse> {
  return apiRequest<TicketDetailResponse>(`/tickets/${ticketId}/status`, 'PUT', {
    status,
    resolution,
  });
}

/** Ändrar kategori på ett ärende. Bara IT-ansvariga får göra det (TB-81). */
export async function updateTicketCategory(
  ticketId: number,
  category: categoryTicket,
): Promise<TicketDetailResponse> {
  return apiRequest<TicketDetailResponse>(`/tickets/${ticketId}/category`, 'PUT', { category });
}

/** Ändrar prioritet på ärendet. */
export async function updateTicketPriority(
  ticketId: number,
  priority: TicketPriority,
): Promise<TicketSummary[]> {
  return apiRequest<TicketSummary[]>(`/tickets/${ticketId}/priority`, 'PUT', { priority });
}

/** Ärenden nyaste först. IT-ansvariga får alla, anställda bara sina egna. */
export function getMyTickets(): Promise<TicketSummary[]> {
  return apiRequest<TicketSummary[]>('/tickets/mine');
}

/** Alla ärenden från alla anmälare, nyaste först */
export function getAllTickets(): Promise<TicketSummary[]> {
  return apiRequest<TicketSummary[]>('/tickets');
}

// Hämta räknare för alla ärenden utifrån kategori
export type TicketCategoryCount = {
  category: categoryTicket;
  count: number;
};
export function getTicketcountByCategory(): Promise<TicketCategoryCount[]> {
  return apiRequest<TicketCategoryCount[]>('/tickets/ticketspercategory');
}
