package com.thebanmd.helpdesk.controllers;

import com.thebanmd.helpdesk.dtos.CreateTicketRequest;
import com.thebanmd.helpdesk.dtos.TicketDetailResponse;
import com.thebanmd.helpdesk.services.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/tickets")
public class TicketController {
    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void create(@Valid @RequestBody CreateTicketRequest ticket,
                       @RequestHeader("X-User-Id") Long userId) {
        ticketService.create(ticket, userId);
    }

    @GetMapping("/{id}")
    public TicketDetailResponse findById(@PathVariable Long id) {
        return ticketService.findById(id);
    }
}
