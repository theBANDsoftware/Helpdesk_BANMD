-- TB-84 Notiser i appen
-- En rad per notis. Anmälaren får en notis när någon annan kommenterar,
-- ändrar status på eller tilldelar hens ärende. read_at är NULL tills notisen är läst.
-- Körs för hand av David på VPS:en när PR:en är mergad. Se database/README.md.

CREATE TABLE notifications (
	id BIGINT NOT NULL AUTO_INCREMENT,
	recipient_id BIGINT NOT NULL,
	ticket_id BIGINT NOT NULL,
	text VARCHAR(255) NOT NULL,
	created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	read_at DATETIME NULL,
	CONSTRAINT pk_notifications PRIMARY KEY (id),
	CONSTRAINT fk_notifications_recipient
		FOREIGN KEY (recipient_id) REFERENCES users(id),
	CONSTRAINT fk_notifications_ticket
		FOREIGN KEY (ticket_id) REFERENCES tickets(id)
		ON DELETE CASCADE,
	-- Frontend frågar efter antalet olästa var 30:e sekund
	INDEX idx_notifications_recipient_read (recipient_id, read_at)
) ENGINE=InnoDB;
