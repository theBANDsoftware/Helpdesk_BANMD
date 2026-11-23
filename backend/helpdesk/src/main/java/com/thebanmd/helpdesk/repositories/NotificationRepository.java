package com.thebanmd.helpdesk.repositories;

import com.thebanmd.helpdesk.entities.Notification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

	/** Mina notiser, nyaste först. Ärendet hämtas i samma fråga eftersom vi behöver dess id. */
	@EntityGraph(attributePaths = {"ticket"})
	List<Notification> findByRecipientIdOrderByCreatedAtDescIdDesc(Long recipientId);

	long countByRecipientIdAndReadAtIsNull(Long recipientId);

	Optional<Notification> findByIdAndRecipientId(Long id, Long recipientId);
}
