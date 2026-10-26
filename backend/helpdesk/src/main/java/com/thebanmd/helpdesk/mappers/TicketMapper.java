package com.thebanmd.helpdesk.mappers;

import com.thebanmd.helpdesk.dtos.CreateTicketRequest;
import com.thebanmd.helpdesk.entities.Ticket;
import com.thebanmd.helpdesk.repositories.TicketRepository;
import com.thebanmd.helpdesk.services.UserService;
import org.springframework.stereotype.Component;

@Component
public class TicketMapper {
    private TicketRepository ticketRepository;
    private static UserService userService;
    public TicketMapper(TicketRepository ticketRepository, UserService userService) {
        this.ticketRepository = ticketRepository;
        this.userService = userService;
    }

    public static Ticket DTOToTicket(CreateTicketRequest ticketDTO) {
        return new Ticket(ticketDTO.title(), ticketDTO.description(),  ticketDTO.category(), UserMapper.DTOToUser(userService.findById(0L)));
    }
}
