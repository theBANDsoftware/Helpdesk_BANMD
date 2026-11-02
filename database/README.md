# Databas

SQL-skripten som skapar databasen på Davids VPS. De körs för hand, i nummerordning (beslut 8 i `docs/beslutslogg.md`).

| Fil | Vad den gör | Körs av |
|---|---|---|
| `00-forbered-vps.sql` | Skapar databasen `helpdesk` och en användare per gruppmedlem | David, som root, en gång |
| `V1__skapa_tabeller.sql` | Skapar tabellerna `users`, `tickets` och `comments` | David, en gång |
| `V2__testdata.sql` | Lägger in testanvändare, ärenden och kommentarer | David, en gång |

```bash
mariadb -u root -p < database/00-forbered-vps.sql
mariadb -u david -p helpdesk < database/V1__skapa_tabeller.sql
mariadb -u david -p helpdesk < database/V2__testdata.sql
```

## Innan första körningen

Lösenorden i `00-forbered-vps.sql` är platshållare (`BYT-UT-1` till `BYT-UT-5`). Byt dem **i en lokal kopia** och kör den. Committa aldrig filen med riktiga lösenord.

## När schemat ändras

Ändra aldrig ett skript som redan har körts. Lägg till ett nytt med nästa nummer, t.ex. `V3__lagg_till_urgency.sql`, och säg till på standupen. David kör det på VPS:en när PR:en är mergad. Uppdatera samtidigt `docs/databasschema.md`.
