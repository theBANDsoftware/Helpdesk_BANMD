package com.thebanmd.helpdesk.dtos;

import java.time.Instant;

public record CommentResponse(
    Long id,
    String body,
    String author, // Mappas från author.name
    Instant createdAt
) {}
