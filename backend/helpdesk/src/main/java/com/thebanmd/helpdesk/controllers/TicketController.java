package com.thebanmd.helpdesk.controllers;

import com.thebanmd.helpdesk.dtos.CreateTicketRequest;
import com.thebanmd.helpdesk.services.TicketService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/ticket")
public class TicketController {
    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping("/create")
    public Boolean addTicket(@Valid @RequestBody CreateTicketRequest ticket) {
        return ticketService.addTicket(ticket);
    }
}
