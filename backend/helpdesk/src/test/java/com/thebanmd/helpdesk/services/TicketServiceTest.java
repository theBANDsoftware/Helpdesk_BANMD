package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.dtos.CreateTicketRequest;
import com.thebanmd.helpdesk.dtos.TicketDetailResponse;
import com.thebanmd.helpdesk.dtos.UpdateCategoryRequest;
import com.thebanmd.helpdesk.dtos.UpdateStatusRequest;
import com.thebanmd.helpdesk.dtos.UpdateTicketRequest;
import com.thebanmd.helpdesk.entities.Comment;
import com.thebanmd.helpdesk.entities.Ticket;
import com.thebanmd.helpdesk.entities.User;
import com.thebanmd.helpdesk.enums.Category;
import com.thebanmd.helpdesk.enums.Role;
import com.thebanmd.helpdesk.enums.Status;
import com.thebanmd.helpdesk.exceptions.ForbiddenActionException;
import com.thebanmd.helpdesk.exceptions.ResolutionRequiredException;
import com.thebanmd.helpdesk.exceptions.TicketNotEditableException;
import com.thebanmd.helpdesk.exceptions.TicketNotFoundException;
import com.thebanmd.helpdesk.exceptions.UserNotFoundException;
import com.thebanmd.helpdesk.mappers.TicketMapper;
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
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.mockito.ArgumentCaptor;
import org.springframework.test.util.ReflectionTestUtils;

/** Testar TicketService utan databas. Repositoryna ersätts med Mockito-mockar. */
class TicketServiceTest {

    private final TicketRepository ticketRepository = mock(TicketRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final CommentRepository commentRepository = mock(CommentRepository.class);
    private final TicketService service = new TicketService(
            ticketRepository, Mappers.getMapper(TicketMapper.class), userRepository, commentRepository,
			mock(NotificationService.class));

    private final CreateTicketRequest request =
            new CreateTicketRequest("Skrivaren skriver inte ut", "Det blinkar rött", Category.PRINTER);

    @Test
    void createSpararArendetMedValdAnvandareSomAnmalare() {
        User anna = new User("Anna Lind", Role.EMPLOYEE);
        when(userRepository.findById(1L)).thenReturn(Optional.of(anna));

        service.create(request, 1L);

        ArgumentCaptor<Ticket> saved = ArgumentCaptor.forClass(Ticket.class);
        verify(ticketRepository).save(saved.capture());
        assertThat(saved.getValue().getCreatedBy()).isSameAs(anna);
        assertThat(saved.getValue().getStatus()).isEqualTo(Status.NEW);
    }

    @Test
    void createKastarUserNotFoundOmAnvandarenInteFinns() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.create(request, 99L))
                .isInstanceOf(UserNotFoundException.class)
                .hasMessage("Användaren med id 99 finns inte");
        verify(ticketRepository, never()).save(any());
    }

    @Test
    void updateStatusAndrarStatusNarItAnsvarigAndrar() {
        User maria = new User("Maria Nordin", Role.IT_ADMIN);
        Ticket ticket = new Ticket("Wifi försvinner", "I rum Ekan", Category.NETWORK, new User("Anna Lind", Role.EMPLOYEE));
        ticket.setStatus(Status.NEW);
        when(userRepository.findById(5L)).thenReturn(Optional.of(maria));
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(ticket)).thenReturn(ticket);

        TicketDetailResponse response = service.updateStatus(1L, new UpdateStatusRequest(Status.IN_PROGRESS), 5L);

        assertThat(ticket.getStatus()).isEqualTo(Status.IN_PROGRESS);
        assertThat(response.status()).isEqualTo(Status.IN_PROGRESS);
    }

    @Test
    void updateStatusKanOppnaEttLostArendeIgen() {
        User maria = new User("Maria Nordin", Role.IT_ADMIN);
        Ticket ticket = new Ticket("Wifi försvinner", "I rum Ekan", Category.NETWORK, new User("Anna Lind", Role.EMPLOYEE));
        ticket.setStatus(Status.RESOLVED);
        when(userRepository.findById(5L)).thenReturn(Optional.of(maria));
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(ticket)).thenReturn(ticket);

        service.updateStatus(1L, new UpdateStatusRequest(Status.IN_PROGRESS), 5L);

        assertThat(ticket.getStatus()).isEqualTo(Status.IN_PROGRESS);
    }

    @Test
    void updateStatusKastarForbiddenOmAnstalldForsokerAndra() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(new User("Anna Lind", Role.EMPLOYEE)));

        assertThatThrownBy(() -> service.updateStatus(1L, new UpdateStatusRequest(Status.RESOLVED), 1L))
                .isInstanceOf(ForbiddenActionException.class)
                .hasMessage("Bara IT-ansvariga kan ändra status på ärenden");
        verify(ticketRepository, never()).save(any());
    }

    @Test
    void updateStatusKastarTicketNotFoundOmArendetInteFinns() {
        when(userRepository.findById(5L)).thenReturn(Optional.of(new User("Maria Nordin", Role.IT_ADMIN)));
        when(ticketRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.updateStatus(99L, new UpdateStatusRequest(Status.RESOLVED), 5L))
                .isInstanceOf(TicketNotFoundException.class);
        verify(ticketRepository, never()).save(any());
    }

    // ---- TB-51: anmälaren ändrar eller tar tillbaka sitt ärende ----

    private final UpdateTicketRequest changes =
            new UpdateTicketRequest("  Skrivaren på plan 2  ", "Den blinkar rött och piper", Category.PRINTER);

    /** Annas ärende (id 10) med status NEW. Anna har id 1, Omar id 2. */
    private Ticket annasNyaArende() {
        User anna = userWithId(1L, "Anna Lind", Role.EMPLOYEE);
        Ticket ticket = new Ticket("Skrivaren", "Den blinkar", Category.OTHER, anna);
        ticket.setStatus(Status.NEW);
        when(userRepository.existsById(1L)).thenReturn(true);
        when(userRepository.existsById(2L)).thenReturn(true);
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(ticket)).thenReturn(ticket);
        return ticket;
    }

    private static User userWithId(Long id, String name, Role role) {
        User user = new User(name, role);
        ReflectionTestUtils.setField(user, "id", id);
        return user;
    }

    @Test
    void updateTicketAndrarRubrikBeskrivningOchKategoriForAnmalaren() {
        Ticket ticket = annasNyaArende();

        TicketDetailResponse response = service.updateTicket(10L, changes, 1L);

        assertThat(ticket.getTitle()).isEqualTo("Skrivaren på plan 2");
        assertThat(ticket.getDescription()).isEqualTo("Den blinkar rött och piper");
        assertThat(ticket.getCategory()).isEqualTo(Category.PRINTER);
        assertThat(response.title()).isEqualTo("Skrivaren på plan 2");
    }

    @Test
    void updateTicketNekasForAnnanAnvandare() {
        Ticket ticket = annasNyaArende();

        assertThatThrownBy(() -> service.updateTicket(10L, changes, 2L))
                .isInstanceOf(ForbiddenActionException.class);
        assertThat(ticket.getTitle()).isEqualTo("Skrivaren");
        verify(ticketRepository, never()).save(any());
    }

    @Test
    void updateTicketNekasOmItHarHunnitAndraStatus() {
        Ticket ticket = annasNyaArende();
        ticket.setStatus(Status.IN_PROGRESS);

        assertThatThrownBy(() -> service.updateTicket(10L, changes, 1L))
                .isInstanceOf(TicketNotEditableException.class);
        assertThat(ticket.getTitle()).isEqualTo("Skrivaren");
        verify(ticketRepository, never()).save(any());
    }

    @Test
    void withdrawTicketSatterStatusAterkallad() {
        Ticket ticket = annasNyaArende();

        TicketDetailResponse response = service.withdrawTicket(10L, 1L);

        assertThat(ticket.getStatus()).isEqualTo(Status.WITHDRAWN);
        assertThat(response.status()).isEqualTo(Status.WITHDRAWN);
    }

    @Test
    void withdrawTicketNekasNarArendetArLost() {
        Ticket ticket = annasNyaArende();
        ticket.setStatus(Status.RESOLVED);

        assertThatThrownBy(() -> service.withdrawTicket(10L, 1L))
                .isInstanceOf(TicketNotEditableException.class);
        assertThat(ticket.getStatus()).isEqualTo(Status.RESOLVED);
    }

    @Test
    void withdrawTicketNekasForAnnanAnvandare() {
        Ticket ticket = annasNyaArende();

        assertThatThrownBy(() -> service.withdrawTicket(10L, 2L))
                .isInstanceOf(ForbiddenActionException.class);
        assertThat(ticket.getStatus()).isEqualTo(Status.NEW);
    }

    @Test
    void updateStatusKanInteSattaAterkallad() {
        when(userRepository.findById(5L)).thenReturn(Optional.of(new User("Maria Nordin", Role.IT_ADMIN)));

        assertThatThrownBy(() -> service.updateStatus(1L, new UpdateStatusRequest(Status.WITHDRAWN), 5L))
                .isInstanceOf(ForbiddenActionException.class);
        verify(ticketRepository, never()).save(any());
    }

    @Test
    void updateCategoryAndrarKategoriNarItAnsvarigAndrar() {
        User maria = new User("Maria Nordin", Role.IT_ADMIN);
        Ticket ticket = new Ticket("Kommer inte in", "Lösenordet fungerar inte", Category.OTHER, new User("Anna Lind", Role.EMPLOYEE));
        ticket.setStatus(Status.RESOLVED);
        when(userRepository.findById(5L)).thenReturn(Optional.of(maria));
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(ticket)).thenReturn(ticket);

        TicketDetailResponse response = service.updateCategory(1L, new UpdateCategoryRequest(Category.ACCOUNT), 5L);

        assertThat(ticket.getCategory()).isEqualTo(Category.ACCOUNT);
        assertThat(response.category()).isEqualTo(Category.ACCOUNT);
    }

    @Test
    void updateCategoryKastarForbiddenOmAnstalldForsokerAndra() {
        User anna = new User("Anna Lind", Role.EMPLOYEE);
        when(userRepository.findById(1L)).thenReturn(Optional.of(anna));

        assertThatThrownBy(() -> service.updateCategory(1L, new UpdateCategoryRequest(Category.ACCOUNT), 1L))
                .isInstanceOf(ForbiddenActionException.class)
                .hasMessage("Bara IT-ansvariga kan ändra kategori");
        verify(ticketRepository, never()).save(any());
    }

    // ---- TB-80: lösning när ärendet markeras som löst ----

    @Test
    void updateStatusTillLostSpararLosningenSomKommentar() {
        User maria = new User("Maria Nordin", Role.IT_ADMIN);
        Ticket ticket = new Ticket("Skrivaren skriver inte ut", "Blinkar rött", Category.PRINTER, new User("Anna Lind", Role.EMPLOYEE));
        ticket.setStatus(Status.IN_PROGRESS);
        when(userRepository.findById(5L)).thenReturn(Optional.of(maria));
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(ticket)).thenReturn(ticket);

        service.updateStatus(1L, new UpdateStatusRequest(Status.RESOLVED, "  Bytte tonerkassett  "), 5L);

        assertThat(ticket.getStatus()).isEqualTo(Status.RESOLVED);
        ArgumentCaptor<Comment> saved = ArgumentCaptor.forClass(Comment.class);
        verify(commentRepository).save(saved.capture());
        assertThat(saved.getValue().getBody()).isEqualTo("Lösning: Bytte tonerkassett");
        assertThat(saved.getValue().getAuthor()).isSameAs(maria);
    }

    @Test
    void updateStatusTillLostUtanLosningKastarResolutionRequired() {
        User maria = new User("Maria Nordin", Role.IT_ADMIN);
        Ticket ticket = new Ticket("Skrivaren skriver inte ut", "Blinkar rött", Category.PRINTER, new User("Anna Lind", Role.EMPLOYEE));
        ticket.setStatus(Status.IN_PROGRESS);
        when(userRepository.findById(5L)).thenReturn(Optional.of(maria));
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));

        assertThatThrownBy(() -> service.updateStatus(1L, new UpdateStatusRequest(Status.RESOLVED, "   "), 5L))
                .isInstanceOf(ResolutionRequiredException.class)
                .hasMessage("Skriv vad som gjordes för att lösa ärendet.");
        assertThat(ticket.getStatus()).isEqualTo(Status.IN_PROGRESS);
        verify(ticketRepository, never()).save(any());
        verify(commentRepository, never()).save(any());
    }

    @Test
    void updateStatusTillPagaendeBehoverIngenLosning() {
        User maria = new User("Maria Nordin", Role.IT_ADMIN);
        Ticket ticket = new Ticket("Wifi försvinner", "I rum Ekan", Category.NETWORK, new User("Anna Lind", Role.EMPLOYEE));
        ticket.setStatus(Status.NEW);
        when(userRepository.findById(5L)).thenReturn(Optional.of(maria));
        when(ticketRepository.findById(1L)).thenReturn(Optional.of(ticket));
        when(ticketRepository.save(ticket)).thenReturn(ticket);

        service.updateStatus(1L, new UpdateStatusRequest(Status.IN_PROGRESS), 5L);

        assertThat(ticket.getStatus()).isEqualTo(Status.IN_PROGRESS);
        verify(commentRepository, never()).save(any());
    }

    // ---- TB-73: anmälaren öppnar ett löst eller återkallat ärende igen ----

    @Test
    void reopenTicketGorLostArendePagaende() {
        Ticket ticket = annasNyaArende();
        ticket.setStatus(Status.RESOLVED);

        TicketDetailResponse response = service.reopenTicket(10L, 1L);

        assertThat(ticket.getStatus()).isEqualTo(Status.IN_PROGRESS);
        assertThat(response.status()).isEqualTo(Status.IN_PROGRESS);
    }

    @Test
    void reopenTicketGorAterkalltArendeNytt() {
        Ticket ticket = annasNyaArende();
        ticket.setStatus(Status.WITHDRAWN);

        TicketDetailResponse response = service.reopenTicket(10L, 1L);

        assertThat(ticket.getStatus()).isEqualTo(Status.NEW);
        assertThat(response.status()).isEqualTo(Status.NEW);
    }

    @Test
    void reopenTicketBehallerTilldelningOchHistorik() {
        Ticket ticket = annasNyaArende();
        User erik = userWithId(6L, "Erik Holm", Role.IT_ADMIN);
        ticket.setAssignedTo(erik);
        ticket.setStatus(Status.RESOLVED);

        service.reopenTicket(10L, 1L);

        assertThat(ticket.getAssignedTo()).isSameAs(erik);
        verify(commentRepository, never()).save(any());
    }

    @Test
    void reopenTicketNekasForAnnanAnvandare() {
        Ticket ticket = annasNyaArende();
        ticket.setStatus(Status.RESOLVED);

        assertThatThrownBy(() -> service.reopenTicket(10L, 2L))
                .isInstanceOf(ForbiddenActionException.class);
        assertThat(ticket.getStatus()).isEqualTo(Status.RESOLVED);
        verify(ticketRepository, never()).save(any());
    }

    @Test
    void reopenTicketNekasNarArendetArNytt() {
        Ticket ticket = annasNyaArende();

        assertThatThrownBy(() -> service.reopenTicket(10L, 1L))
                .isInstanceOf(TicketNotEditableException.class)
                .hasMessage("Bara ett löst eller återkallat ärende kan öppnas igen.");
        assertThat(ticket.getStatus()).isEqualTo(Status.NEW);
    }

    @Test
    void reopenTicketNekasNarArendetArPagaende() {
        Ticket ticket = annasNyaArende();
        ticket.setStatus(Status.IN_PROGRESS);

        assertThatThrownBy(() -> service.reopenTicket(10L, 1L))
                .isInstanceOf(TicketNotEditableException.class);
        assertThat(ticket.getStatus()).isEqualTo(Status.IN_PROGRESS);
    }
}
