package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.dtos.*;
import com.thebanmd.helpdesk.entities.Ticket;
import com.thebanmd.helpdesk.entities.User;
import com.thebanmd.helpdesk.enums.Category;
import com.thebanmd.helpdesk.enums.Role;
import com.thebanmd.helpdesk.enums.Status;
import com.thebanmd.helpdesk.exceptions.ForbiddenActionException;
import com.thebanmd.helpdesk.exceptions.TicketNotFoundException;
import com.thebanmd.helpdesk.exceptions.UserNotFoundException;
import com.thebanmd.helpdesk.mappers.TicketMapper;
import com.thebanmd.helpdesk.repositories.TicketRepository;
import com.thebanmd.helpdesk.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;


@Service
@RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;
    private final UserRepository userRepository;

    /** Skapar ett ärende med status NEW och den valda användaren som anmälare. */
    public void create(CreateTicketRequest ticket, Long createdById) {
        Ticket newTicket = ticketMapper.toEntity(ticket);
        newTicket.setStatus(Status.NEW);
        newTicket.setCreatedBy(userRepository.findById(createdById)
            .orElseThrow(() -> new UserNotFoundException(createdById)));
        ticketRepository.save(newTicket);
    }

    /**
     * Hämtar ett ärende med alla detaljer. Bara den som anmält ärendet och IT-ansvariga får se det (TB-46).
     * Kastar TicketNotFoundException om ärendet inte finns.
     */
    @Transactional(readOnly = true)
    public TicketDetailResponse findById(Long id, Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));

        Ticket ticket = ticketRepository.findById(id)
            .orElseThrow(() -> new TicketNotFoundException(id));

        boolean isCreator = ticket.getCreatedBy().getId().equals(userId);
        if (user.getRole() != Role.IT_ADMIN && !isCreator) {
            throw new ForbiddenActionException("Du har inte behörighet att se det här ärendet");
        }

        return ticketMapper.toDetailResponse(ticket);
    }

    /**
     * Tilldelar ärendet till en IT-ansvarig, eller tar bort tilldelningen om assignedToUserId är null.
     * Bara IT-ansvariga får tilldela, och bara IT-ansvariga kan bli tilldelade (docs/databasschema.md).
     */
    @Transactional
    public TicketDetailResponse assignTicket(Long ticketId, AssignTicketRequest request, Long performedByUserId) {
        User performingUser = userRepository.findById(performedByUserId)
            .orElseThrow(() -> new UserNotFoundException(performedByUserId));

        if (performingUser.getRole() != Role.IT_ADMIN) {
            throw new ForbiddenActionException("Bara IT-ansvariga kan tilldela ärenden");
        }

        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new TicketNotFoundException(ticketId));

        if (request.assignedToUserId() == null) {
            ticket.setAssignedTo(null);
        } else {
            User assignee = userRepository.findById(request.assignedToUserId())
                .orElseThrow(() -> new UserNotFoundException(request.assignedToUserId()));

            if (assignee.getRole() != Role.IT_ADMIN) {
                throw new ForbiddenActionException("Endast IT-ansvariga kan tilldelas ärenden");
            }

            ticket.setAssignedTo(assignee);
        }

        Ticket updated = ticketRepository.save(ticket);
        return ticketMapper.toDetailResponse(updated);
    }

    /** Ändrar status på ett ärende. Bara IT-ansvariga får göra det (TB-27, AK 3). */
    @Transactional
    public TicketDetailResponse updateStatus(Long ticketId, UpdateStatusRequest request, Long performedByUserId) {
        User performingUser = userRepository.findById(performedByUserId)
            .orElseThrow(() -> new UserNotFoundException(performedByUserId));

        if (performingUser.getRole() != Role.IT_ADMIN) {
            throw new ForbiddenActionException("Bara IT-ansvariga kan ändra status");
        }

        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new TicketNotFoundException(ticketId));

        ticket.setStatus(request.status());
        Ticket updated = ticketRepository.save(ticket);
        return ticketMapper.toDetailResponse(updated);
    }

    @Transactional
    public TicketDetailResponse updatePriority(Long ticketId, UpdatePriorityRequest request, Long performedByUserId) {
        User performingUser = userRepository.findById(performedByUserId)
            .orElseThrow(() -> new UserNotFoundException(performedByUserId));

        if (performingUser.getRole() != Role.IT_ADMIN) {
            throw new ForbiddenActionException("Bara IT-ansvariga kan ändra prioritet");
        }

        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new TicketNotFoundException(ticketId));

        ticket.setPriority(request.priority());
        Ticket updated = ticketRepository.save(ticket);
        return ticketMapper.toDetailResponse(updated);
    }

    /** Ärenden som användaren har anmält, nyaste först (TB-24). Kastar UserNotFoundException om användaren inte finns. */
    @Transactional(readOnly = true)
    public List<TicketSummaryResponse> getMyTickets(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException(userId);
        }
        List<Ticket> tickets = ticketRepository.findByCreatedByIdOrderByCreatedAtDescIdDesc(userId);
        return ticketMapper.toSummaryResponseList(tickets);
    }

    /** Alla ärenden från alla anmälare, nyaste först (TB-25). Bara IT-ansvariga får se dem (TB-46). */
    @Transactional(readOnly = true)
    public List<TicketSummaryResponse> getAllTickets(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));

        if (user.getRole() != Role.IT_ADMIN) {
            throw new ForbiddenActionException("Bara IT-ansvariga kan se alla ärenden");
        }

        List<Ticket> tickets = ticketRepository.findAllByOrderByCreatedAtDescIdDesc();
        return ticketMapper.toSummaryResponseList(tickets);
    }

    /** Ärenden som är tilldelade användaren (TB-49). Bara IT-ansvariga har tilldelade ärenden. */
    @Transactional(readOnly = true)
    public List<TicketSummaryResponse> getMyAssignedTickets(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));

        if (user.getRole() != Role.IT_ADMIN) {
            throw new ForbiddenActionException("Endast IT-ansvariga har tilldelade ärenden.");
        }

        List<Ticket> tickets = ticketRepository.findByAssignedToIdOrderByCreatedAtDesc(userId);

        return ticketMapper.toSummaryResponseList(tickets);
    }

    /** Hämta alla öppna ärenden och räkna per kategori */
    @Transactional(readOnly = true)
    public List<TicketCategoryCountResponse> getNumberOfTicketsPerCategory(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));

        if (user.getRole() != Role.IT_ADMIN) {
            throw new ForbiddenActionException("Endast IT-ansvariga kan se statistik.");
        }

        List<Ticket> openTickets = ticketRepository.findByStatusIn(List.of(Status.NEW, Status.IN_PROGRESS));
        List<TicketCategoryCountResponse> result = new ArrayList<>();
        for (Category category : Category.values()) {
            long count = 0;
            for (Ticket ticket : openTickets) {
                if (ticket.getCategory() == category) {
                    count++;
                }
            }
            result.add(new TicketCategoryCountResponse(category, count));
        }
        result.sort(Comparator.comparingLong(TicketCategoryCountResponse::count).reversed());
        return result;
    }
}
