-- TB-35 Bifoga skärmdump
-- Själva bilderna sparas i Backblaze B2 (beslut 11), inte i databasen.
-- Tabellen sparar bara information om varje bild och var den ligger (storage_key).
-- Körs för hand av David på VPS:en när PR:en är mergad. Se database/README.md.

CREATE TABLE attachments (
    id BIGINT NOT NULL AUTO_INCREMENT,
    ticket_id BIGINT NOT NULL,
    uploaded_by BIGINT NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    storage_key VARCHAR(100) NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    size_bytes BIGINT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_attachments PRIMARY KEY (id),
    CONSTRAINT uq_attachments_storage_key UNIQUE (storage_key),
    CONSTRAINT chk_attachments_content_type CHECK (
        content_type IN ('image/png', 'image/jpeg')
    ),
    CONSTRAINT fk_attachments_ticket
        FOREIGN KEY (ticket_id) REFERENCES tickets(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_attachments_uploaded_by
        FOREIGN KEY (uploaded_by) REFERENCES users(id),
    INDEX idx_attachments_ticket_id (ticket_id)
) ENGINE=InnoDB;
