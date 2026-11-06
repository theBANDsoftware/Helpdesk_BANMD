package com.thebanmd.helpdesk.dtos;

import com.thebanmd.helpdesk.enums.Status;
import com.thebanmd.helpdesk.enums.TicketPriority;
import jakarta.validation.constraints.NotNull;

public record UpdatePriorityRequest(@NotNull(message = "Prioritet krävs") TicketPriority priority) {
}
