# Databas

SQL-skripten som skapar databasen på Davids VPS. De körs för hand, i nummerordning (beslut 8 i `docs/beslutslogg.md`).

| Fil | Vad den gör | Körs av |
|---|---|---|
| `00-forbered-vps.sql` | Skapar databasen `helpdesk` och en användare per gruppmedlem | David, som root, en gång |
| `V1__skapa_tabeller.sql` | Skapar tabellerna `users`, `tickets` och `comments` | David, en gång |
| `V2__testdata.sql` | Lägger in testanvändare, ärenden och kommentarer | David, en gång |
| `V3__skapa_attachments.sql` | Skapar tabellen `attachments` för bifogade skärmdumpar (TB-35) | David, när TB-35 är mergad |
| `V4__status_aterkallad.sql` | Lägger till status `WITHDRAWN` (Återkallad) i `tickets` (TB-51) | David, när TB-51 är mergad |
| `V5__skapa_notifications.sql` | Skapar tabellen `notifications` för notiser i appen (TB-84) | David, när TB-84 är mergad |
| `V6__inloggning.sql` | Lägger till `email` och `password_hash` i `users` och ger testanvändarna e-post (TB-33). Lösenorden sätts för hand, se nedan. | David, när TB-33 är mergad |

```bash
mariadb -u root -p < database/00-forbered-vps.sql
mariadb -u david -p helpdesk < database/V1__skapa_tabeller.sql
mariadb -u david -p helpdesk < database/V2__testdata.sql
mariadb -u david -p helpdesk < database/V3__skapa_attachments.sql
mariadb -u david -p helpdesk < database/V4__status_aterkallad.sql
mariadb -u david -p helpdesk < database/V5__skapa_notifications.sql
mariadb -u david -p helpdesk < database/V6__inloggning.sql
```

## Innan första körningen

Lösenorden i `00-forbered-vps.sql` är platshållare (`BYT-UT-1` till `BYT-UT-5`). Byt dem **i en lokal kopia** och kör den. Committa aldrig filen med riktiga lösenord.

## Sätta lösenord (TB-33)

Inga lösenord får ligga i repot, så `V6__inloggning.sql` sätter bara e-post. Tills en användare har ett lösenord kan den inte logga in. Lösenordet sparas som en BCrypt-hash, aldrig i klartext.

1. Skapa en hash av lösenordet. På VPS:en finns `htpasswd` i paketet `apache2-utils`:

   ```bash
   htpasswd -bnBC 10 "" 'lösenordet' | tr -d ':\n'
   ```

   Det skriver ut en hash som börjar med `$2y$10$`.

2. Lägg in hashen för användaren:

   ```sql
   UPDATE users SET password_hash = '<hashen>' WHERE email = 'anna.lind@helpdesk.test';
   ```

3. Skicka lösenordet till gruppen på samma sätt som databaslösenorden: till var och en privat, aldrig i gruppchatten eller i repot.

Samma lösenord kan användas för alla testanvändare. De skyddar ingen riktig data, men lösenordet ska ändå inte stå i repot (DoD punkt 6).

## När schemat ändras

Ändra aldrig ett skript som redan har körts. Lägg till ett nytt med nästa nummer, t.ex. `V3__lagg_till_urgency.sql`, och säg till på standupen. David kör det på VPS:en när PR:en är mergad. Uppdatera samtidigt `docs/databasschema.md`.
