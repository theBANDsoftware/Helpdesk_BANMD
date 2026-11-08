package com.thebanmd.helpdesk.dtos;

/** Det frontend skickar för att tilldela ett ärende, t.ex. {"assignedToUserId": 5}. Null tar bort tilldelningen. */
public record AssignTicketRequest(Long assignedToUserId) {
}
