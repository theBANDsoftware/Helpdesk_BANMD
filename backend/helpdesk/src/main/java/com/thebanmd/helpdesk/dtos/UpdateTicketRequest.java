package com.thebanmd.helpdesk.dtos;

import com.thebanmd.helpdesk.enums.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Det frontend skickar när anmälaren ändrar sitt ärende (TB-51). Samma krav som när ärendet skapas. */
public record UpdateTicketRequest(
    @NotBlank @Size(max = 120) String title,
    @NotBlank String description,
    @NotNull Category category
) {}
