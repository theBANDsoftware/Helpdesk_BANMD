import { apiRequest } from "../../shared/apiClient";

// Interfacet för svaret från backend (matchar CommentResponse.java)
export interface CommentResponse {
  id: number;
  body: string;
  author: string;
  createdAt: string; 
}

// Funktion för att hämta kommentarer
export function getComments(ticketId: number): Promise<CommentResponse[]> {
  return apiRequest<CommentResponse[]>(`/tickets/${ticketId}/comments`);
}

// Funktion för att posta en ny kommentar
export function addComment(ticketId: number, body: string): Promise<CommentResponse> {
  // Vi skickar in { body } eftersom vår CreateCommentRequest i backend förväntar sig ett fält som heter just "body"
  return apiRequest<CommentResponse>(`/tickets/${ticketId}/comments`, "POST", { body });
}