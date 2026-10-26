# Sprint planning: sprint 1

<!--
  INSTRUKTION
  Fylls i på måndagen, efter retron. Ungefär 30 minuter.
  1. Titta på retrons åtgärder: påverkar de planeringen?
  2. Bestäm sprintmålet: en mening om vad sprinten ska ge, inte en lista med stories.
  3. Se över kapaciteten: är någon borta?
  4. Välj stories uppifrån i backloggen tills ni tror att ni har tillräckligt. Bara stories med acceptanskriterier.
  5. Sätt en ansvarig per story, och flytta dem till "Att göra" på boarden.
  Det är bättre att ta in för lite och plocka in mer än att ta in för mycket.
-->

**Datum:** 2026-10-26
**Deltagare:** Adli Anabtawi, Bleart Rama, David Andersson, Noah Fältman, Mustafa Samir
**Product Owner denna sprint:** Mustafa Samir
**Scrum Master denna sprint:** Adli Anabtawi

## Sprintmål

<!-- En mening. Vad ska vara möjligt efter sprinten som inte var det innan? -->

En anställd kan välja vem hen är, anmäla ett fel och se sina egna ärenden i en lista som hämtas från databasen.

## Kapacitet

<!-- Är någon borta eller har mindre tid den här veckan? -->

Alla fem har full tid den här veckan.

## Från förra retron

<!-- Vilka åtgärder från förra retron tar vi med oss in i sprinten? -->

- Ingen retro än, det här är första sprinten.

## Valda stories

<!-- Länka issues med #nummer. Storlek: S, M eller L. -->

| Issue | Story | Storlek | Ansvarig |
|---|---|---|---|
| TB-23 | Anmäla ett fel | M | Alla, byggs tillsammans först |
| TB-22 | Välja vem man är | M | _[namn]_ |
| TB-24 | Se mina ärenden | S | _[namn]_ |
| TB-25 | Se alla ärenden | S | _[namn]_ |
| TB-26 | Öppna ett ärende (reserv) | S | Tas in om resten blir klart i tid |

**Totalt:** 2 S, 2 M, 0 L, och 1 S i reserv

**Första storyn tillsammans:** TB-23 "Anmäla ett fel". Den går genom alla lager (formulär, endpoint, validering och databas), så alla ser hur en story byggs från början till slut innan vi delar upp oss. Den är också referensstoryn för estimeringen.
<!-- Jämför med förra sprinten: hur mycket blev klart då? -->

## Risker och osäkerheter

<!-- Något ni inte vet hur man gör? Beroenden mellan stories? -->

- **`TicketController`, `TicketService` och `TicketRepository` i backend och `ticketsApi.ts` i frontend** rörs av TB-23, TB-24 och TB-25. TB-23 byggs därför först, och TB-24 och TB-25 tas gärna av samma person.
- **Hur backend vet vem som är vald** måste bestämmas innan TB-23 sparar en anmälare. Förslaget är att frontend skickar headern `X-User-Id`. Beslutet skrivs in i beslutsloggen.
- **`spring-boot-starter-validation`** saknas i `pom.xml` och läggs till i TB-23.
- **Inga schemaändringar** behövs i den här sprinten. Tabellerna `users` och `tickets` finns redan.
