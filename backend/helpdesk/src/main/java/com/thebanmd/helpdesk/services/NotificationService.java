package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.dtos.NotificationResponse;
import com.thebanmd.helpdesk.entities.Notification;
import com.thebanmd.helpdesk.entities.Ticket;
import com.thebanmd.helpdesk.entities.User;
import com.thebanmd.helpdesk.exceptions.NotificationNotFoundException;
import com.thebanmd.helpdesk.exceptions.UserNotFoundException;
import com.thebanmd.helpdesk.mappers.NotificationMapper;
import com.thebanmd.helpdesk.repositories.NotificationRepository;
import com.thebanmd.helpdesk.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

/**
 * Allt som har med notiser att göra (TB-84). Resten av koden anropar bara ticketUpdated
 * när något händer i ett ärende, och den här klassen bestämmer om det blir en notis.
 */
@Service
@RequiredArgsConstructor
public class NotificationService {

	private final NotificationRepository notificationRepository;
	private final UserRepository userRepository;
	private final NotificationMapper notificationMapper;

	/**
	 * Skapar en notis till anmälaren, t.ex. "Maria Nordin kommenterade ditt ärende ...".
	 * action är det som hänt, t.ex. "kommenterade". Gör man ändringen själv blir det ingen notis.
	 * Körs i samma transaktion som ändringen, så går ändringen fel sparas ingen notis heller.
	 */
	@Transactional
	public void ticketUpdated(Ticket ticket, User performedBy, String action) {
		User reporter = ticket.getCreatedBy();
		if (reporter.getId().equals(performedBy.getId())) {
			return;
		}

		String text = performedBy.getName() + " " + action + " ditt ärende \"" + ticket.getTitle() + "\"";
		notificationRepository.save(new Notification(reporter, ticket, text));
	}

	/** Mina notiser, nyaste först. */
	@Transactional(readOnly = true)
	public List<NotificationResponse> getNotifications(Long userId) {
		requireUser(userId);
		return notificationRepository.findByRecipientIdOrderByCreatedAtDescIdDesc(userId)
			.stream()
			.map(notificationMapper::toResponse)
			.toList();
	}

	/** Antalet olästa. Frontend frågar efter det var 30:e sekund. */
	@Transactional(readOnly = true)
	public long countUnread(Long userId) {
		requireUser(userId);
		return notificationRepository.countByRecipientIdAndReadAtIsNull(userId);
	}

	/** Markerar en notis som läst. Man kan bara markera sina egna, andras ger 404. */
	@Transactional
	public NotificationResponse markAsRead(Long notificationId, Long userId) {
		Notification notification = notificationRepository.findByIdAndRecipientId(notificationId, userId)
			.orElseThrow(() -> new NotificationNotFoundException(notificationId));

		if (notification.getReadAt() == null) {
			notification.setReadAt(Instant.now());
		}
		return notificationMapper.toResponse(notificationRepository.save(notification));
	}

	private void requireUser(Long userId) {
		if (!userRepository.existsById(userId)) {
			throw new UserNotFoundException(userId);
		}
	}
}
