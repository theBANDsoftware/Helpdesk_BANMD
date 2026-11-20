# Sprint planning: sprint 3

<!--
  INSTRUKTION
  Fylls i under sprintplaneringen, i början av sprinten.
  Sprintmålet är en mening om vad som ska vara möjligt när sprinten är slut.
-->

**Datum:** 2026-11-09
**Deltagare:** Adli Anabtawi, Bleart Rama, David Andersson, Noah Fältman, Mustafa Samir
**Product Owner denna sprint:** Bleart Rama
**Scrum Master denna sprint:** Mustafa Samir

## Sprintmål

Varje roll kan bara göra det den får och får tydliga svar när något inte är tillåtet, och IT-ansvariga får bättre överblick över ärendena.

## Kapacitet

Sprinten är en vecka, 9–16 november. Standup varje kvardag på Discord.

## Från förra retron

| Åtgärd | Ansvarig |
|---|---|
| Standupen loggas i `standup.md` direkt efter standupen, samma kväll. | Scrum Master (Mustafa) |
| `develop` mergas till `main` fredag kväll (ny regel i DoD). | Scrum Master gör PR:en till `main` |
| Vi mergar löpande under veckan i stället för allt på fredag, så att krockar som i sprint 2 (TB-58) upptäcks tidigt. | Alla |

## Valda stories

| Issue | Story | Storlek | Ansvarig |
|---|---|---|---|
| TB-46 | Anställd ser bara sina egna ärenden | S | Bleart |
| TB-57 | Dölj formulär för anställd som inte är anmälare | S | Bleart |
| TB-47 | Samma felkod för otillåtna åtgärder | S | Adli |
| TB-52 | Antal ej tilldelade ärenden | S | Adli |
| TB-48 | Validering av tilldelning | S | Noah |
| TB-50 | Sök ärenden på rubrik eller anmälare | M | Noah |
| TB-51 | Ändra eller ta tillbaka ett ärende med status Ny | M | Mustafa |
| TB-36 | Statistik över öppna ärenden per kategori | M | David |

## Risker och osäkerheter

- Flera stories ändrar samma filer (`TicketService.java`, `AllTickets.tsx`, `TicketDetail.tsx`). Den som mergar sist hämtar `develop` och testar innan merge.
- TB-51 behöver en ny status i databasen. Beslutet tas innan storyn påbörjas, och ett SQL-skript körs i develop-databasen (beslut 8).
