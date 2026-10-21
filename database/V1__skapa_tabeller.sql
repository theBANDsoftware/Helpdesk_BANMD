-- Databasschema för Helpdesk_BANMD
-- Databas: MariaDB
-- Baserat på docs/databasschema.md
-- Körs för hand av David på VPS:en, efter 00-forbered-vps.sql. Se database/README.md.

CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT chk_users_role CHECK (role IN ('EMPLOYEE', 'IT_ADMIN'))
) ENGINE=InnoDB;

CREATE TABLE tickets (
    id BIGINT NOT NULL AUTO_INCREMENT,
    title VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'NEW',
    created_by BIGINT NOT NULL,
    assigned_to BIGINT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT pk_tickets PRIMARY KEY (id),
    CONSTRAINT chk_tickets_category CHECK (
        category IN ('COMPUTER', 'PRINTER', 'NETWORK', 'ACCOUNT', 'OTHER')
    ),
    CONSTRAINT chk_tickets_status CHECK (
        status IN ('NEW', 'IN_PROGRESS', 'RESOLVED')
    ),
    CONSTRAINT fk_tickets_created_by
        FOREIGN KEY (created_by) REFERENCES users(id),
    CONSTRAINT fk_tickets_assigned_to
        FOREIGN KEY (assigned_to) REFERENCES users(id),
    INDEX idx_tickets_created_by (created_by),
    INDEX idx_tickets_assigned_to (assigned_to),
    INDEX idx_tickets_status (status)
) ENGINE=InnoDB;

CREATE TABLE comments (
    id BIGINT NOT NULL AUTO_INCREMENT,
    ticket_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    body TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_comments PRIMARY KEY (id),
    CONSTRAINT fk_comments_ticket
        FOREIGN KEY (ticket_id) REFERENCES tickets(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_comments_author
        FOREIGN KEY (author_id) REFERENCES users(id),
    INDEX idx_comments_ticket_id (ticket_id),
    INDEX idx_comments_author_id (author_id)
) ENGINE=InnoDB;

-- Observera:
-- Schemat anger att endast IT_ADMIN får tilldelas ärenden.
-- Den regeln ska enligt dokumentationen kontrolleras i service-lagret.
-- Testdata finns i V2__testdata.sql.
