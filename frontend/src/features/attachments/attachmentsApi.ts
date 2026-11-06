import { apiGet, apiPostForm } from '../../shared/apiClient';

// Samma gränser som i AttachmentService.java (TB-35)
export const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;
export const MAX_ATTACHMENTS_PER_TICKET = 3;
export const ALLOWED_ATTACHMENT_TYPES = ['image/png', 'image/jpeg'];

// Matchar AttachmentResponse.java
export interface AttachmentResponse {
  id: number;
  filename: string;
  contentType: string;
  sizeBytes: number;
  uploadedBy: string;
  createdAt: string;
}

/** Hämtar information om ärendets bifogade bilder. */
export function getAttachments(ticketId: number): Promise<AttachmentResponse[]> {
  return apiGet<AttachmentResponse[]>(`/tickets/${ticketId}/attachments`);
}

/** Laddar upp en bild till ärendet. */
export function uploadAttachment(ticketId: number, file: File): Promise<AttachmentResponse> {
  const formData = new FormData();
  formData.append('file', file);
  return apiPostForm<AttachmentResponse>(`/tickets/${ticketId}/attachments`, formData);
}

/** Adressen till själva bilden, för <img src>. */
export function attachmentUrl(ticketId: number, attachmentId: number): string {
  return `/api/tickets/${ticketId}/attachments/${attachmentId}`;
}
