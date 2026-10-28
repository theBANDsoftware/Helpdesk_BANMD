package com.thebanmd.helpdesk.controllers;

import com.thebanmd.helpdesk.dtos.CreateTicketRequest;
import com.thebanmd.helpdesk.services.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    /** Anmälaren tills vald användare skickas från frontend (bygger på "Välja vem man är"). */
    private static final Long SELECTED_USER_ID = 1L;

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void create(@Valid @RequestBody CreateTicketRequest ticket) {
        ticketService.create(ticket, SELECTED_USER_ID);
    }
}
