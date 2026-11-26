package com.thebanmd.helpdesk.controllers;

import com.thebanmd.helpdesk.config.CurrentUserId;
import com.thebanmd.helpdesk.dtos.NotificationResponse;
import com.thebanmd.helpdesk.services.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Notiser för den inloggade användaren (TB-84). Vem som anropar läses ur inloggningstoken med @CurrentUserId (TB-33). */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
	private final NotificationService notificationService;

	public NotificationController(NotificationService notificationService) {
		this.notificationService = notificationService;
	}

	/** Mina notiser, nyaste först. */
	@GetMapping
	public List<NotificationResponse> getNotifications(@CurrentUserId Long userId) {
		return notificationService.getNotifications(userId);
	}

	/** Antalet olästa notiser, bara en siffra. */
	@GetMapping("/unread-count")
	public long countUnread(@CurrentUserId Long userId) {
		return notificationService.countUnread(userId);
	}

	/** Markerar notisen som läst. */
	@PutMapping("/{id}/read")
	public NotificationResponse markAsRead(
		@PathVariable Long id,
		@CurrentUserId Long userId) {
		return notificationService.markAsRead(id, userId);
	}
}
