package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.dtos.CreateTicketRequest;
import com.thebanmd.helpdesk.dtos.TicketDetailResponse;
import com.thebanmd.helpdesk.entities.Ticket;
import com.thebanmd.helpdesk.enums.Status;
import com.thebanmd.helpdesk.exceptions.TicketNotFoundException;
import com.thebanmd.helpdesk.exceptions.UserNotFoundException;
import com.thebanmd.helpdesk.mappers.TicketMapper;
import com.thebanmd.helpdesk.repositories.TicketRepository;
import com.thebanmd.helpdesk.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;
    private final UserRepository userRepository;

    public void create(CreateTicketRequest ticket, Long createdById) {
        Ticket newTicket = ticketMapper.toEntity(ticket);
        newTicket.setStatus(Status.NEW);
        newTicket.setCreatedBy(userRepository.findById(createdById)
                .orElseThrow(() -> new UserNotFoundException(createdById)));
        ticketRepository.save(newTicket);
    }

    @Transactional(readOnly = true)
    public TicketDetailResponse findById(Long id) {
        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new TicketNotFoundException(id));
        return ticketMapper.toDetailResponse(ticket);
    }
}
