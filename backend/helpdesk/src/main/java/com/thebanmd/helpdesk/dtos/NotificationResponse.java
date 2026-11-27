package com.thebanmd.helpdesk.dtos;

import java.time.Instant;

public record NotificationResponse(
	Long id,
	Long ticketId, // Mappas från ticket.id, så frontend kan länka till ärendet
	String text,
	Instant createdAt,
	boolean read
) {}
