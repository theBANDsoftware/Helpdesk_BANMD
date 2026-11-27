-- TB-33 Logga in med lösenord. Se docs/inloggning.md.
-- Körs för hand i develop-databasen, efter V5 (beslut 8). Se database/README.md.
--
-- Man loggar in med e-post och lösenord. Lösenordet sparas aldrig i klartext,
-- bara som en BCrypt-hash. En användare utan e-post eller lösenord kan inte logga in.

ALTER TABLE users
    ADD COLUMN email VARCHAR(255) NULL,
    ADD COLUMN password_hash VARCHAR(100) NULL,
    ADD CONSTRAINT uq_users_email UNIQUE (email);

-- Testanvändarna från V2 får e-post på domänen .test, som aldrig kan vara en riktig adress.
-- Lösenorden sätts INTE här, eftersom inga lösenord får ligga i repot. David sätter dem
-- för hand på VPS:en och skickar dem privat. Se "Sätta lösenord" i database/README.md.
UPDATE users SET email = 'anna.lind@helpdesk.test' WHERE name = 'Anna Lind';
UPDATE users SET email = 'omar.haddad@helpdesk.test' WHERE name = 'Omar Haddad';
UPDATE users SET email = 'sara.berg@helpdesk.test' WHERE name = 'Sara Berg';
UPDATE users SET email = 'johan.ek@helpdesk.test' WHERE name = 'Johan Ek';
UPDATE users SET email = 'maria.nordin@helpdesk.test' WHERE name = 'Maria Nordin';
UPDATE users SET email = 'erik.holm@helpdesk.test' WHERE name = 'Erik Holm';
