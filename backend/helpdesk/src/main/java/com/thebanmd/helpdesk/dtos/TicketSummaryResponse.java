package com.thebanmd.helpdesk.dtos;

import com.thebanmd.helpdesk.enums.Category;
import com.thebanmd.helpdesk.enums.Status;
import com.thebanmd.helpdesk.enums.TicketPriority;

import java.time.Instant;

/**
 * Ett ärende i en lista, i "Mina ärenden" (TB-24) och "Alla ärenden" (TB-25).
 * createdBy och assignedTo är namn, inte id. assignedTo är null om ingen är tilldelad.
 * createdById används för att filtrera listan på en anmälare (TB-83).
 */

public record TicketSummaryResponse(
    Long id,
    String title,
    Category category,
    Status status,
    String createdBy,
    Long createdById,
    String assignedTo,
    Long assignedToId,
    Instant createdAt,
    TicketPriority priority) {
}
