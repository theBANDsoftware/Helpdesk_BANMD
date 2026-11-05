package com.thebanmd.helpdesk.dtos;

import jakarta.validation.constraints.NotBlank;

public record CreateCommentRequest(
    @NotBlank(message = "Kommentaren får inte vara tom") String body
) {
}
