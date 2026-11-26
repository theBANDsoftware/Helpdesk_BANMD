package com.thebanmd.helpdesk.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import java.time.Instant;

/** En notis till anmälaren om att något har hänt i hens ärende (TB-84). */
@Entity
@DynamicInsert
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
public class Notification {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "recipient_id", nullable = false)
	private User recipient;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "ticket_id", nullable = false)
	private Ticket ticket;

	@Column(name = "text", nullable = false)
	private String text;

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	// null tills notisen är läst
	@Column(name = "read_at")
	private Instant readAt;

	public Notification(User recipient, Ticket ticket, String text) {
		this.recipient = recipient;
		this.ticket = ticket;
		this.text = text;
	}
}
