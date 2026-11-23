import { apiRequest } from '../../shared/apiClient';

// Matchar NotificationResponse.java (TB-84)
export interface NotificationResponse {
	id: number;
	ticketId: number;
	text: string;
	createdAt: string;
	read: boolean;
}

// Mina notiser, nyaste först
export function getNotifications(): Promise<NotificationResponse[]> {
	return apiRequest<NotificationResponse[]>('/notifications');
}

// Bara antalet olästa, hämtas var 30:e sekund
export function getUnreadCount(): Promise<number> {
	return apiRequest<number>('/notifications/unread-count');
}

export function markAsRead(id: number): Promise<NotificationResponse> {
	return apiRequest<NotificationResponse>(`/notifications/${id}/read`, 'PUT');
}
