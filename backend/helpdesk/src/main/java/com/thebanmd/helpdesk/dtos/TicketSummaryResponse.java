package com.thebanmd.helpdesk.dtos;

import com.thebanmd.helpdesk.enums.Category;
import com.thebanmd.helpdesk.enums.Status;

import java.time.Instant;

public record TicketSummaryResponse(Long id, String title, Category category, Status status, Instant createdAt) {
}
