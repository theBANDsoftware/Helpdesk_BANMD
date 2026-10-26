package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.dtos.CreateTicketRequest;
import com.thebanmd.helpdesk.mappers.TicketMapper;
import com.thebanmd.helpdesk.repositories.TicketRepository;
import org.springframework.stereotype.Service;

import static com.thebanmd.helpdesk.mappers.TicketMapper.DTOToTicket;

@Service
public class TicketService {
    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public Boolean addTicket(CreateTicketRequest ticket) {
        ticketRepository.save(TicketMapper.DTOToTicket(ticket));
        return true;
    }
}
