import { apiRequest, ApiError } from '../../shared/apiClient';
import type { categoryTicket, TicketPriority, TicketSummary } from '../../Types';
import { readSelectedUserId } from '../../shared/selectedUserStorage';

// Återanvänder eller definierar status- och kategorityper
export type StatusTicket = 'NEW' | 'IN_PROGRESS' | 'RESOLVED';

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
  priority: "Prioritet",
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

/** Skapar ett nytt ärende med anmälarens id i X-User-Id-headern */
export async function createTicket(
  ticket: CreateTicketDTO
): Promise<TicketDetailResponse> {
  return apiRequest<TicketDetailResponse>(
    '/tickets',
    'POST',
    ticket
  );
}

/** Tilldelar ärendet till en IT-ansvarig eller tar bort tilldelningen (null) */
export async function assignTicket(
  ticketId: number,
  assignedToUserId: number | null,
  currentUserId: number
): Promise<TicketDetailResponse> {
  return apiRequest<TicketDetailResponse>(
    `/tickets/${ticketId}/assign`,
    'PUT',
    { assignedToUserId },
    { 'X-User-Id': currentUserId.toString() }
  );
}

/** Ändrar status på ärendet. Bara IT-ansvariga får göra det, backend svarar annars 403 (TB-27). */
export async function updateTicketStatus(
  ticketId: number,
  status: StatusTicket,
  currentUserId: number
): Promise<TicketDetailResponse> {
  return apiRequest<TicketDetailResponse>(
    `/tickets/${ticketId}/status`,
    'PUT',
    { status },
    { 'X-User-Id': currentUserId.toString() }
  );
}

/** Ändrar prioritet på ärendet. */
export async function updateTicketPriority(
  ticketId: number,
  priority: TicketPriority,
  currentUserId: number
): Promise<TicketSummary[]> {
  return apiRequest<TicketSummary[]>(
    `/tickets/${ticketId}/priority`,
    'PUT',
    { priority },
    { 'X-User-Id': currentUserId.toString() }
  );
}

export function getMyTickets(): Promise<TicketSummary[]> {
  return apiRequest<TicketSummary[]>('/tickets/mine');
} 

/** Alla ärenden från alla anmälare, nyaste först */
export function getAllTickets(): Promise<TicketSummary[]> {
  return apiRequest<TicketSummary[]>('/tickets');
}

/**
 * Hämtar alla ärenden som är tilldelade den inloggade IT-ansvariga.
 * Anropar GET /api/tickets/assigned-to-me där X-User-Id skickas med automatiskt av apiGet.
 */
export function getMyAssignedTickets(): Promise<TicketSummary[]> {
  return apiRequest<TicketSummary[]>('/tickets/assigned-to-me');
}
