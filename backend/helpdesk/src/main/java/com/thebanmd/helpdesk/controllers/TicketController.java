package com.thebanmd.helpdesk.controllers;

import com.thebanmd.helpdesk.dtos.CreateTicketRequest;
import com.thebanmd.helpdesk.dtos.UserResponse;
import com.thebanmd.helpdesk.services.TicketService;
import com.thebanmd.helpdesk.services.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ticket")
public class TicketController {
    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping("/create")
    public Boolean addTicket(@RequestParam CreateTicketRequest ticket) {
        return ticketService.addTicket(ticket);
    }
}
