package com.thebanmd.helpdesk.controllers;

import com.thebanmd.helpdesk.dtos.*;
import com.thebanmd.helpdesk.services.CommentService;
import com.thebanmd.helpdesk.services.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final CommentService commentService;

    public TicketController(TicketService ticketService, CommentService commentService) {
        this.ticketService = ticketService;
        this.commentService = commentService;
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

    // Hämtar alla kommentarer för ett specifikt ärende
    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(commentService.getComments(id));
    }

    // Skapar en ny kommentar på ett ärende
    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> addComment(
        @PathVariable Long id,
        @RequestHeader("X-User-Id") Long userId,
        @Valid @RequestBody CreateCommentRequest request
    ) {
        CommentResponse response = commentService.createComment(id, userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

}

