package com.thebanmd.helpdesk.controllers;

import com.thebanmd.helpdesk.dtos.*;
import com.thebanmd.helpdesk.services.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Endpoints för ärenden. Tar bara emot anropet och lämnar över till TicketService (DoD punkt 7).
 * Vem som anropar läses från headern X-User-Id (beslut 10).
 */
@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    /** Skapar ett ärende med den valda användaren som anmälare. Svarar 201. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void create(@Valid @RequestBody CreateTicketRequest ticket,
                       @RequestHeader("X-User-Id") Long userId) {
        ticketService.create(ticket, userId);
    }

    /** Alla ärenden från alla anmälare, nyaste först (TB-25). */
    /** Alla ärenden från alla anmälare, nyaste först. Bara för IT-ansvariga (TB-25, TB-46). */
    @GetMapping
    public List<TicketSummaryResponse> getAllTickets(@RequestHeader("X-User-Id") Long userId) {
        return ticketService.getAllTickets(userId);
    }

    /** Ärenden som den valda användaren har anmält, nyaste först (TB-24). */
    @GetMapping("/mine")
    public List<TicketSummaryResponse> getMyTickets(@RequestHeader("X-User-Id") Long userId) {
        return ticketService.getMyTickets(userId);
    }

    /** Ett ärende med alla detaljer. 403 om man varken är anmälare eller IT-ansvarig, 404 om det inte finns. */
    @GetMapping("/{id}")
    public TicketDetailResponse findById(@PathVariable Long id,
                                         @RequestHeader("X-User-Id") Long userId) {
        return ticketService.findById(id, userId);
    }

    /** Tilldelar ärendet till en IT-ansvarig, eller tar bort tilldelningen om assignedToUserId är null. */
    @PutMapping("/{id}/assign")
    public TicketDetailResponse assignTicket(
        @PathVariable Long id,
        @RequestBody AssignTicketRequest request,
        @RequestHeader("X-User-Id") Long userId) {
        return ticketService.assignTicket(id, request, userId);
    }

    /** Ändrar status på ärendet. Bara IT-ansvariga får göra det (TB-27). */
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

    /** Ärenden som är tilldelade den valda IT-ansvariga (TB-49). */
    @GetMapping("/assigned-to-me")
    public List<TicketSummaryResponse> getMyAssignedTickets(@RequestHeader("X-User-Id") Long userId) {
        return ticketService.getMyAssignedTickets(userId);
    }

    /** Statistik över öppna ärenden (TB-36). */
    @GetMapping("/ticketspercategory")
    public List<TicketCategoryCountResponse> getNumberOfTicketsPerCategory(@RequestHeader("X-User-Id") Long userId) {
        return ticketService.getNumberOfTicketsPerCategory(userId);
    }
}

