package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.entities.Notification;
import com.thebanmd.helpdesk.entities.Ticket;
import com.thebanmd.helpdesk.entities.User;
import com.thebanmd.helpdesk.enums.Category;
import com.thebanmd.helpdesk.enums.Role;
import com.thebanmd.helpdesk.exceptions.NotificationNotFoundException;
import com.thebanmd.helpdesk.mappers.NotificationMapper;
import com.thebanmd.helpdesk.repositories.NotificationRepository;
import com.thebanmd.helpdesk.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.mockito.ArgumentCaptor;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/** Testar när anmälaren får en notis (TB-84), utan databas. */
class NotificationServiceTest {

	private final NotificationRepository notificationRepository = mock(NotificationRepository.class);
	private final UserRepository userRepository = mock(UserRepository.class);
	private final NotificationService service = new NotificationService(
			notificationRepository, userRepository, Mappers.getMapper(NotificationMapper.class));

	private final User omar = user(2L, "Omar Haddad", Role.EMPLOYEE);
	private final User maria = user(5L, "Maria Nordin", Role.IT_ADMIN);
	private final Ticket omarsTicket = new Ticket("Kommer inte in på mejlen", "Fel lösenord", Category.ACCOUNT, omar);

	@Test
	void anmalarenFarNotisNarNagonAnnanKommenterar() {
		service.ticketUpdated(omarsTicket, maria, "kommenterade");

		ArgumentCaptor<Notification> saved = ArgumentCaptor.forClass(Notification.class);
		verify(notificationRepository).save(saved.capture());
		assertThat(saved.getValue().getRecipient()).isSameAs(omar);
		assertThat(saved.getValue().getText())
			.isEqualTo("Maria Nordin kommenterade ditt ärende \"Kommer inte in på mejlen\"");
	}

	@Test
	void ingenNotisNarAnmalarenSjalvGorAndringen() {
		service.ticketUpdated(omarsTicket, omar, "kommenterade");

		verify(notificationRepository, never()).save(any());
	}

	@Test
	void manKanInteMarkeraNagonAnnansNotisSomLast() {
		when(notificationRepository.findByIdAndRecipientId(1L, 5L)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> service.markAsRead(1L, 5L))
			.isInstanceOf(NotificationNotFoundException.class);
	}

	/** User har inget setId, eftersom databasen sätter id:t. I testet sätts det direkt på fältet. */
	private static User user(Long id, String name, Role role) {
		User user = new User(name, role);
		ReflectionTestUtils.setField(user, "id", id);
		return user;
	}
}
