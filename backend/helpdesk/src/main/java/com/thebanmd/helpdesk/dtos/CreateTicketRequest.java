package com.thebanmd.helpdesk.dtos;

import com.thebanmd.helpdesk.enums.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Det frontend skickar när ett ärende skapas. Anmälaren skickas inte här, utan i headern X-User-Id (beslut 10). */
public record CreateTicketRequest(
    @NotBlank @Size(max = 120) String title,
    @NotBlank String description,
    @NotNull Category category
) {}
