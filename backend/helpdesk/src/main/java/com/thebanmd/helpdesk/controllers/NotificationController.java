package com.thebanmd.helpdesk.controllers;

import com.thebanmd.helpdesk.dtos.NotificationResponse;
import com.thebanmd.helpdesk.services.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** Notiser för den valda användaren (TB-84). Vem som anropar läses från X-User-Id (beslut 10). */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
	private final NotificationService notificationService;

	public NotificationController(NotificationService notificationService) {
		this.notificationService = notificationService;
	}

	/** Mina notiser, nyaste först. */
	@GetMapping
	public List<NotificationResponse> getNotifications(@RequestHeader("X-User-Id") Long userId) {
		return notificationService.getNotifications(userId);
	}

	/** Antalet olästa notiser, bara en siffra. */
	@GetMapping("/unread-count")
	public long countUnread(@RequestHeader("X-User-Id") Long userId) {
		return notificationService.countUnread(userId);
	}

	/** Markerar notisen som läst. */
	@PutMapping("/{id}/read")
	public NotificationResponse markAsRead(
		@PathVariable Long id,
		@RequestHeader("X-User-Id") Long userId) {
		return notificationService.markAsRead(id, userId);
	}
}
