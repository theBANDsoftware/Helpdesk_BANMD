package com.thebanmd.helpdesk.dtos;

import com.thebanmd.helpdesk.enums.Category;
import com.thebanmd.helpdesk.enums.Status;

import java.time.Instant;

/**
 * Ett ärende i en lista, i "Mina ärenden" (TB-24) och "Alla ärenden" (TB-25).
 * createdBy och assignedTo är namn, inte id. assignedTo är null om ingen är tilldelad.
 */

public record TicketSummaryResponse(
    Long id,
    String title,
    Category category,
    Status status,
    String createdBy,
    String assignedTo,
    Instant createdAt) {
}
