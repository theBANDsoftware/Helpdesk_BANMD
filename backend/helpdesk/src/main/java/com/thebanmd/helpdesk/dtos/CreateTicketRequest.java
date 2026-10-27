package com.thebanmd.helpdesk.dtos;

import com.thebanmd.helpdesk.enums.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateTicketRequest(
    @NotBlank @Size(max = 120) String title,
    @NotBlank String description,
    @NotNull Category category
) {}
