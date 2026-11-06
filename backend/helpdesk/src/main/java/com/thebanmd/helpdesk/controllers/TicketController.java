package com.thebanmd.helpdesk.controllers;

import com.thebanmd.helpdesk.dtos.*;
import com.thebanmd.helpdesk.services.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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

    @GetMapping
    public List<TicketSummaryResponse> getAllTickets() {
        return ticketService.getAllTickets();
    }

    @GetMapping("/mine")
    public List<TicketSummaryResponse> getMyTickets(@RequestHeader("X-User-Id") Long userId) {
        return ticketService.getMyTickets(userId);
    }

    @GetMapping("/{id}")
    public TicketDetailResponse findById(@PathVariable Long id) {
        return ticketService.findById(id);
    }

    @PutMapping("/{id}/assign")
    public TicketDetailResponse assignTicket(
        @PathVariable Long id,
        @RequestBody AssignTicketRequest request,
        @RequestHeader("X-User-Id") Long userId) {
        return ticketService.assignTicket(id, request, userId);
    }

    @PutMapping("/{id}/status")
    public TicketDetailResponse updateStatus(
        @PathVariable Long id,
        @Valid @RequestBody UpdateStatusRequest request,
        @RequestHeader("X-User-Id") Long userId) {
        return ticketService.updateStatus(id, request, userId);
    }
    @PutMapping("/{id}/priority")
    public TicketDetailResponse updatePriority(
        @PathVariable Long id,
        @Valid @RequestBody UpdatePriorityRequest request,
        @RequestHeader("X-User-Id") Long userId) {
        return ticketService.updatePriority(id, request, userId);
    }

}

