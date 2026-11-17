-- TB-51 Ändra eller ta tillbaka ett ärende
-- Ny status WITHDRAWN (Återkallad) för ärenden som anmälaren har tagit tillbaka (beslut 14).
-- Körs för hand i develop-databasen (beslut 8). Se database/README.md.

ALTER TABLE tickets DROP CONSTRAINT chk_tickets_status;

ALTER TABLE tickets ADD CONSTRAINT chk_tickets_status CHECK (
    status IN ('NEW', 'IN_PROGRESS', 'RESOLVED', 'WITHDRAWN')
);
