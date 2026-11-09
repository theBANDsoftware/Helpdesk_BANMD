package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.dtos.CommentResponse;
import com.thebanmd.helpdesk.dtos.CreateCommentRequest;
import com.thebanmd.helpdesk.entities.Comment;
import com.thebanmd.helpdesk.entities.Ticket;
import com.thebanmd.helpdesk.entities.User;
import com.thebanmd.helpdesk.enums.Category;
import com.thebanmd.helpdesk.enums.Role;
import com.thebanmd.helpdesk.exceptions.ForbiddenActionException;
import com.thebanmd.helpdesk.mappers.CommentMapper;
import com.thebanmd.helpdesk.repositories.CommentRepository;
import com.thebanmd.helpdesk.repositories.TicketRepository;
import com.thebanmd.helpdesk.repositories.UserRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.test.util.ReflectionTestUtils;

/** Testar vem som får kommentera ett ärende (TB-29 och TB-30), utan databas. */
class CommentServiceTest {

    private final CommentRepository commentRepository = mock(CommentRepository.class);
    private final TicketRepository ticketRepository = mock(TicketRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final CommentService service = new CommentService(
            commentRepository, ticketRepository, userRepository, Mappers.getMapper(CommentMapper.class));

    private final User omar = user(2L, "Omar Haddad", Role.EMPLOYEE);
    private final User anna = user(1L, "Anna Lind", Role.EMPLOYEE);
    private final User maria = user(5L, "Maria Nordin", Role.IT_ADMIN);
    private final Ticket omarsTicket = new Ticket("Kommer inte in på mejlen", "Fel lösenord", Category.ACCOUNT, omar);

    @BeforeEach
    void setUp() {
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(omarsTicket));
        when(userRepository.findById(1L)).thenReturn(Optional.of(anna));
        when(userRepository.findById(2L)).thenReturn(Optional.of(omar));
        when(userRepository.findById(5L)).thenReturn(Optional.of(maria));
        when(commentRepository.save(any(Comment.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void itAnsvarigFarKommenteraArendet() {
        CommentResponse response = service.createComment(10L, 5L, new CreateCommentRequest("Har du testat webben?"));

        assertThat(response.author()).isEqualTo("Maria Nordin");
        assertThat(response.body()).isEqualTo("Har du testat webben?");
    }

    @Test
    void anmalarenFarSvaraISittEgetArende() {
        CommentResponse response = service.createComment(10L, 2L, new CreateCommentRequest("Bara i Outlook."));

        assertThat(response.author()).isEqualTo("Omar Haddad");
    }

    @Test
    void annanAnstalldFarInteKommentera() {
        assertThatThrownBy(() -> service.createComment(10L, 1L, new CreateCommentRequest("Hej")))
                .isInstanceOf(ForbiddenActionException.class)
                .hasMessage("Du kan bara kommentera dina egna ärenden.");
        verify(commentRepository, never()).save(any());
    }

    /** User har inget setId, eftersom databasen sätter id:t. I testet sätts det direkt på fältet. */
    private static User user(Long id, String name, Role role) {
        User user = new User(name, role);
        ReflectionTestUtils.setField(user, "id", id);
        return user;
    }
}
