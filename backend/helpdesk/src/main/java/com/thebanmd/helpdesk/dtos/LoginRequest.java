package com.thebanmd.helpdesk.dtos;

import jakarta.validation.constraints.NotBlank;

/** Det frontend skickar för att logga in, t.ex. {"email": "anna.lind@helpdesk.test", "password": "..."} (TB-33). */
public record LoginRequest(
    @NotBlank(message = "E-post krävs") String email,
    @NotBlank(message = "Lösenord krävs") String password) {
}
