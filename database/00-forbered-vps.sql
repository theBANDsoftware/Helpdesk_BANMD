-- Körs EN gång av David på hans VPS, som MariaDB-administratör (root).
-- Skapar databasen och en MariaDB-användare per gruppmedlem.
--
-- Före körning: byt ut BYT-UT-* mot riktiga lösenord. Committa ALDRIG den här
-- filen med riktiga lösenord i. Skicka lösenorden till var och en på ett
-- säkert sätt, inte i gruppchatten.
--
-- '%' betyder att användaren får ansluta från alla IP-adresser. Byt gärna ut
-- '%' mot personens IP-adress, eller låt alla ansluta via SSH-tunnel och
-- använd 'localhost'. Se beslut 6 i docs/beslutslogg.md.

CREATE DATABASE IF NOT EXISTS helpdesk
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'adli'@'%'   IDENTIFIED BY 'BYT-UT-1';
CREATE USER IF NOT EXISTS 'bleart'@'%' IDENTIFIED BY 'BYT-UT-2';
CREATE USER IF NOT EXISTS 'david'@'%'  IDENTIFIED BY 'BYT-UT-3';
CREATE USER IF NOT EXISTS 'noah'@'%'   IDENTIFIED BY 'BYT-UT-4';
CREATE USER IF NOT EXISTS 'mustafa'@'%' IDENTIFIED BY 'BYT-UT-5';

-- Rättigheter i databasen helpdesk, inget annat på servern.
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES
  ON helpdesk.* TO 'adli'@'%', 'bleart'@'%', 'david'@'%', 'noah'@'%', 'mustafa'@'%';

FLUSH PRIVILEGES;
