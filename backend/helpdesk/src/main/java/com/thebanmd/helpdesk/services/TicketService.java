package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.dtos.*;
import com.thebanmd.helpdesk.entities.Ticket;
import com.thebanmd.helpdesk.entities.User;
import com.thebanmd.helpdesk.enums.Category;
import com.thebanmd.helpdesk.enums.Role;
import com.thebanmd.helpdesk.enums.Status;
import com.thebanmd.helpdesk.exceptions.ForbiddenActionException;
import com.thebanmd.helpdesk.exceptions.TicketNotEditableException;
import com.thebanmd.helpdesk.exceptions.TicketNotFoundException;
import com.thebanmd.helpdesk.exceptions.UserNotFoundException;
import com.thebanmd.helpdesk.mappers.TicketMapper;
import com.thebanmd.helpdesk.repositories.TicketRepository;
import com.thebanmd.helpdesk.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;


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
        requireItAdmin(performedByUserId, "tilldela ärenden");

        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new TicketNotFoundException(ticketId));

        if (request.assignedToUserId() == null) {
            ticket.setAssignedTo(null);
        } else {
            User assignee = requireItAdmin(request.assignedToUserId(), "tilldelas ärenden");
            ticket.setAssignedTo(assignee);
        }

        Ticket updated = ticketRepository.save(ticket);
        return ticketMapper.toDetailResponse(updated);
    }

    /** Ändrar status på ett ärende. Bara IT-ansvariga får göra det (TB-27, AK 3). */
    @Transactional
    public TicketDetailResponse updateStatus(Long ticketId, UpdateStatusRequest request, Long performedByUserId) {
        requireItAdmin(performedByUserId, "ändra status på ärenden");

        // Återkallad sätts bara när anmälaren tar tillbaka sitt ärende (TB-51)
        if (request.status() == Status.WITHDRAWN) {
            throw new ForbiddenActionException("Bara anmälaren kan ta tillbaka ett ärende");
        }

        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new TicketNotFoundException(ticketId));

        ticket.setStatus(request.status());
        Ticket updated = ticketRepository.save(ticket);
        return ticketMapper.toDetailResponse(updated);
    }

    @Transactional
    public TicketDetailResponse updatePriority(Long ticketId, UpdatePriorityRequest request, Long performedByUserId) {
       requireItAdmin(performedByUserId, "ändra prioritet på ärenden");

        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new TicketNotFoundException(ticketId));

        ticket.setPriority(request.priority());
        Ticket updated = ticketRepository.save(ticket);
        return ticketMapper.toDetailResponse(updated);
    }

    /**
     * Ärenden nyaste först. IT-ansvariga får alla ärenden, anställda bara sina egna (TB-24, TB-25, TB-46, TB-78).
     */
    @Transactional(readOnly = true)
    public List<TicketSummaryResponse> getAllTickets(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));

        if (user.getRole() != Role.IT_ADMIN) {
            List<Ticket> tickets = ticketRepository.findByCreatedByIdOrderByCreatedAtDescIdDesc(userId);
            return ticketMapper.toSummaryResponseList(tickets);
        }

        List<Ticket> tickets = ticketRepository.findAllByOrderByCreatedAtDescIdDesc();
        return ticketMapper.toSummaryResponseList(tickets);
    }

    /** Hämta alla öppna ärenden och räkna per kategori */
    @Transactional(readOnly = true)
    public List<TicketCategoryCountResponse> getNumberOfTicketsPerCategory(Long userId) {
        requireItAdmin(userId, "se statistik");

        Map<Category, Long> countByCategory = ticketRepository.findByStatusIn(List.of(Status.NEW, Status.IN_PROGRESS))
            .stream()
            .collect(Collectors.groupingBy(Ticket::getCategory, Collectors.counting()));

        // Alla kategorier tas med, så att de utan öppna ärenden visas med 0
        return Arrays.stream(Category.values())
            .map(category -> new TicketCategoryCountResponse(category, countByCategory.getOrDefault(category, 0L)))
            .sorted(Comparator.comparingLong(TicketCategoryCountResponse::count).reversed())
            .toList();
    }

    /**
     * Anmälaren ändrar rubrik, beskrivning och kategori (TB-51).
     * Bara anmälaren får göra det, och bara medan ärendet har status NEW.
     */
    @Transactional
    public TicketDetailResponse updateTicket(Long ticketId, UpdateTicketRequest request, Long performedByUserId) {
        Ticket ticket = findEditableByCreator(ticketId, performedByUserId, "ändra");
        ticket.setTitle(request.title().strip());
        ticket.setDescription(request.description().strip());
        ticket.setCategory(request.category());
        return ticketMapper.toDetailResponse(ticketRepository.save(ticket));
    }

    /**
     * Anmälaren tar tillbaka sitt ärende, som då får status WITHDRAWN (TB-51, beslut 14).
     * Bara anmälaren får göra det, och bara medan ärendet har status NEW.
     */
    @Transactional
    public TicketDetailResponse withdrawTicket(Long ticketId, Long performedByUserId) {
        Ticket ticket = findEditableByCreator(ticketId, performedByUserId, "ta tillbaka");
        ticket.setStatus(Status.WITHDRAWN);
        return ticketMapper.toDetailResponse(ticketRepository.save(ticket));
    }

    /** Gemensamma kontroller för updateTicket och withdrawTicket (TB-51). */
    private Ticket findEditableByCreator(Long ticketId, Long performedByUserId, String action) {
        if (!userRepository.existsById(performedByUserId)) {
            throw new UserNotFoundException(performedByUserId);
        }
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new TicketNotFoundException(ticketId));

        if (!Objects.equals(ticket.getCreatedBy().getId(), performedByUserId)) {
            throw new ForbiddenActionException("Bara den som anmält ärendet kan " + action + " det");
        }
        // Har IT hunnit ändra status medan anmälaren redigerade får hen ett fel (409) och inget ändras
        if (ticket.getStatus() != Status.NEW) {
            throw new TicketNotEditableException();
        }
        return ticket;
    }
    /** Hämtar användaren och kastar 403 om den inte är IT-ansvarig. */
    private User requireItAdmin(Long userId, String action) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(userId));
        if (user.getRole() != Role.IT_ADMIN) {
            throw new ForbiddenActionException("Bara IT-ansvariga kan " + action);
        }
        return user;
    }
}
