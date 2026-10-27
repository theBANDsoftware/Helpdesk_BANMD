package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.dtos.CreateTicketRequest;
import com.thebanmd.helpdesk.entities.Ticket;
import com.thebanmd.helpdesk.mappers.TicketMapper;
import com.thebanmd.helpdesk.repositories.TicketRepository;
import com.thebanmd.helpdesk.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;
    private final UserRepository userRepository;

    public Boolean addTicket(CreateTicketRequest ticket) {
        Ticket newTicket = ticketMapper.toEntity(ticket);
        newTicket.setCreatedBy(userRepository.getReferenceById(1L));
        ticketRepository.save(newTicket);
        return true;
    }
}
