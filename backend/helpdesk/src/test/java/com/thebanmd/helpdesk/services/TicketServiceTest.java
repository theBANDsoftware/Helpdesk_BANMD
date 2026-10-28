package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.dtos.CreateTicketRequest;
import com.thebanmd.helpdesk.entities.Ticket;
import com.thebanmd.helpdesk.entities.User;
import com.thebanmd.helpdesk.enums.Category;
import com.thebanmd.helpdesk.enums.Role;
import com.thebanmd.helpdesk.enums.Status;
import com.thebanmd.helpdesk.exceptions.UserNotFoundException;
import com.thebanmd.helpdesk.mappers.TicketMapper;
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

/** Testar TicketService utan databas. Repositoryna ersätts med Mockito-mockar. */
class TicketServiceTest {

    private final TicketRepository ticketRepository = mock(TicketRepository.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final TicketService service =
            new TicketService(ticketRepository, Mappers.getMapper(TicketMapper.class), userRepository);

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
}
