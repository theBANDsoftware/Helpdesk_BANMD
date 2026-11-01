package com.thebanmd.helpdesk.dtos;

import com.thebanmd.helpdesk.enums.Status;
import jakarta.validation.constraints.NotNull;

/** Det frontend skickar när en IT-ansvarig ändrar status, t.ex. {"status": "IN_PROGRESS"}. */
public record UpdateStatusRequest(@NotNull(message = "Status krävs") Status status) {
}
