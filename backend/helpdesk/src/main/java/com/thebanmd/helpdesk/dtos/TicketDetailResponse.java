package com.thebanmd.helpdesk.dtos;

import com.thebanmd.helpdesk.enums.Category;
import com.thebanmd.helpdesk.enums.Status;
import com.thebanmd.helpdesk.enums.TicketPriority;

import java.time.Instant;

public record TicketDetailResponse(Long id, String title, String description, Category category, Status status, String createdBy, String assignedTo, Instant createdAt, Instant updatedAt, TicketPriority priority) {
}
