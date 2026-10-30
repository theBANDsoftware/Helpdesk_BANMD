import { apiGet, ApiError } from '../../shared/apiClient';
import type { categoryTicket, TicketSummary } from '../../Types';
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

// Kolumnrubriker som används av DataTable i TicketDetail
export const ticketColumns: Record<string, string> = {
  id: 'Ärendenummer',
  category: 'Kategori',
  status: 'Status',
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
  return apiGet<TicketDetailResponse>(`/tickets/${id}`);
}

/** Skapar ett nytt ärende med anmälarens id i X-User-Id-headern */
export async function createTicket(
  ticket: CreateTicketDTO
): Promise<TicketDetailResponse> {
  const response = await fetch('/api/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
       'X-User-Id': String(readSelectedUserId() === null ? 0 : readSelectedUserId()),
    },
    body: JSON.stringify(ticket),
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, body);
  }

  return body as TicketDetailResponse;
}

/** Tilldelar ärendet till en IT-ansvarig eller tar bort tilldelningen (null) */
export async function assignTicket(
  ticketId: number,
  assignedToUserId: number | null,
  currentUserId: number
): Promise<TicketDetailResponse> {
  const response = await fetch(`/api/tickets/${ticketId}/assign`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-User-Id': currentUserId.toString(),
    },
    body: JSON.stringify({ assignedToUserId }),
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, body);
  }

  return body as TicketDetailResponse;
}
// export function getTicket(id: number): Promise<TicketDetail> {
//   return apiGet<TicketDetail>(`/tickets/${id}`);
// }

export function getMyTickets(): Promise<TicketSummary[]> {
  return apiGet<TicketSummary[]>('/tickets/mine');
} 
