package com.thebanmd.helpdesk.dtos;

import com.thebanmd.helpdesk.enums.Category;
import com.thebanmd.helpdesk.enums.Status;

import java.time.Instant;

/**
 * Ett ärende med alla detaljer, till detaljvyn.
 * createdBy och assignedTo är namn. assignedTo är null om ingen är tilldelad.
 * createdById används av frontend för att avgöra om anmälaren får kommentera (TB-30).
 */
public record TicketDetailResponse(
    Long id,
    String title,
    String description,
    Category category,
    Status status,
    Long createdById,
    String createdBy,
    String assignedTo,
    Instant createdAt,
    Instant updatedAt
) {
}
