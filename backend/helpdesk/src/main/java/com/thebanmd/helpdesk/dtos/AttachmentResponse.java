package com.thebanmd.helpdesk.dtos;

import java.time.Instant;

/** Information om en bifogad bild. Själva bilden hämtas med GET /api/tickets/{id}/attachments/{attachmentId}. */
public record AttachmentResponse(
    Long id,
    String filename,
    String contentType,
    Long sizeBytes,
    String uploadedBy, // Mappas från uploadedBy.name
    Instant createdAt
) {}
