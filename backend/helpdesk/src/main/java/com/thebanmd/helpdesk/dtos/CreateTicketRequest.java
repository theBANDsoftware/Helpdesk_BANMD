package com.thebanmd.helpdesk.dtos;

import com.thebanmd.helpdesk.entities.User;
import com.thebanmd.helpdesk.enums.Category;
import com.thebanmd.helpdesk.enums.Status;
import jakarta.validation.constraints.NotBlank;

public record CreateTicketRequest(
    @NotBlank String title,
    @NotBlank String description,
    @NotBlank Category category,
    @NotBlank User createdBy
) {}
