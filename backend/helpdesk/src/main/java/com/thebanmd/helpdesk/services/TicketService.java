package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.dtos.AssignTicketRequest;
import com.thebanmd.helpdesk.dtos.CreateTicketRequest;
import com.thebanmd.helpdesk.dtos.TicketDetailResponse;
import com.thebanmd.helpdesk.entities.Ticket;
import com.thebanmd.helpdesk.entities.User;
import com.thebanmd.helpdesk.enums.Role;
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

    @Transactional
    public TicketDetailResponse assignTicket(Long ticketId, AssignTicketRequest request, Long performedByUserId) {
        User performingUser = userRepository.findById(performedByUserId)
            .orElseThrow(() -> new UserNotFoundException(performedByUserId));

        if (performingUser.getRole() != Role.IT_ADMIN) {
            throw new IllegalArgumentException("Bara IT-ansvariga kan tilldela ärenden");
        }

        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new TicketNotFoundException(ticketId));

        if (request.assignedToUserId() == null) {
            ticket.setAssignedTo(null);
        } else {
            User assignee = userRepository.findById(request.assignedToUserId())
                .orElseThrow(() -> new UserNotFoundException(request.assignedToUserId()));

            if (assignee.getRole() != Role.IT_ADMIN) {
                throw new IllegalArgumentException("Endast IT-ansvariga kan tilldelas ärenden");
            }

            ticket.setAssignedTo(assignee);
        }

        Ticket updated = ticketRepository.save(ticket);
        return ticketMapper.toDetailResponse(updated);
    }

}
