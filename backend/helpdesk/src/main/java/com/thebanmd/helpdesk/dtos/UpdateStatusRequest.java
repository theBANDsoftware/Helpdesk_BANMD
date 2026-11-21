package com.thebanmd.helpdesk.dtos;

import com.thebanmd.helpdesk.enums.Status;
import jakarta.validation.constraints.NotNull;

/**
 * Det frontend skickar när en IT-ansvarig ändrar status, t.ex. {"status": "IN_PROGRESS"}.
 * Vid status RESOLVED måste resolution skickas med, t.ex. {"status": "RESOLVED", "resolution": "Bytte toner"} (TB-80).
 */
public record UpdateStatusRequest(@NotNull(message = "Status krävs") Status status, String resolution) {

    /** För statusbyten som inte behöver någon lösning, t.ex. till IN_PROGRESS. */
    public UpdateStatusRequest(Status status) {
        this(status, null);
    }
}
