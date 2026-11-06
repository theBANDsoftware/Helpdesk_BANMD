package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.dtos.CommentResponse;
import com.thebanmd.helpdesk.dtos.CreateCommentRequest;
import com.thebanmd.helpdesk.entities.Comment;
import com.thebanmd.helpdesk.enums.Role;
import com.thebanmd.helpdesk.entities.Ticket;
import com.thebanmd.helpdesk.entities.User;
import com.thebanmd.helpdesk.exceptions.ForbiddenActionException;
import com.thebanmd.helpdesk.exceptions.TicketNotFoundException;
import com.thebanmd.helpdesk.exceptions.UserNotFoundException;
import com.thebanmd.helpdesk.mappers.CommentMapper;
import com.thebanmd.helpdesk.repositories.CommentRepository;
import com.thebanmd.helpdesk.repositories.TicketRepository;
import com.thebanmd.helpdesk.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    // Hämtar alla kommentarer för ett visst ärende
    public List<CommentResponse> getComments(Long ticketId) {
        if (!ticketRepository.existsById(ticketId)) {
            throw new TicketNotFoundException(ticketId);
        }

        return commentRepository.findByTicketIdOrderByCreatedAtAscIdAsc(ticketId)
            .stream()
            .map(commentMapper::toResponse)
            .toList();
    }

    // Skapar en ny kommentar
    @Transactional
    public CommentResponse createComment(Long ticketId, Long authorId, CreateCommentRequest request) {
        // 1. Hämta den inloggade användaren
        User author = userRepository.findById(authorId)
            .orElseThrow(() -> new UserNotFoundException(authorId));

        // 2. Hämta ärendet som ska kommenteras
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new TicketNotFoundException(ticketId));

        // 3. Kontrollera behörighet: IT_ADMIN får kommentera alla ärenden,
        //    den som anmält ärendet får svara i sitt eget (TB-30)
        boolean isItAdmin = author.getRole() == Role.IT_ADMIN;
        boolean isReporter = ticket.getCreatedBy().getId().equals(authorId);
        if (!isItAdmin && !isReporter) {
            throw new ForbiddenActionException("Du kan bara kommentera dina egna ärenden.");
        }

        // 4. Skapa och spara kommentaren
        Comment comment = new Comment(ticket, author, request.body());
        Comment savedComment = commentRepository.save(comment);

        // 5. Mappa tillbaka till en DTO för att skicka till frontend
        return commentMapper.toResponse(savedComment);
    }
}
