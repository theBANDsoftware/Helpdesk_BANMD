# Sprint planning: sprint 4

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

**Datum:** 2026-11-16
**Deltagare:** Adli Anabtawi, Bleart Rama, David Andersson, Noah Fältman, Mustafa Samir
**Product Owner denna sprint:** Adli Anabtawi
**Scrum Master denna sprint:** Noah Fältman

## Sprintmål

<!-- En mening. Vad ska vara möjligt efter sprinten som inte var det innan? -->

Ett ärende kan följas hela vägen från anmälan till dokumenterad lösning, och öppnas igen om felet kommer tillbaka, i en app som är enhetlig på alla sidor.

## Kapacitet

<!-- Är någon borta eller har mindre tid den här veckan? -->

_[fyll i: är någon borta eller har mindre tid den här veckan?]_

## Från förra retron

<!-- Vilka åtgärder från förra retron tar vi med oss in i sprinten? -->

- _[fyll i åtgärderna från retron för sprint 3]_
- Från retron för sprint 2, gäller fortfarande: standupen loggas i `standup.md` direkt efter standupen, samma kväll. Ansvarig: Scrum Master (Noah).

## Valda stories

<!-- Länka issues med #nummer. Storlek: S, M eller L. -->

| Issue | Story | Storlek | Ansvarig |
|---|---|---|---|
| TB-66 | Gemensam formatering i frontend | _[?]_ | Noah |
| TB-70 | Bestäm färger och stil för frontend | _[?]_ | Noah |
| TB-67 | Flytta inline-stilar till CSS | _[?]_ | Noah |
| TB-71 | Enhetlig styling av frontend | _[?]_ | Noah |
| TB-80 | Skriva en lösning när ett ärende markeras som löst | M | Adli |
| TB-81 | Ändra kategori på ett ärende | S | Adli |
| TB-83 | Klicka på en anmälare och se alla dennes ärenden | S | Adli |
| TB-73 | Öppna ett löst eller återkallat ärende igen | S | Mustafa |
| TB-77 | Läsa svar på vanliga problem (FAQ) | S | Mustafa |
| TB-79 | Se vilka ärenden som har ett nytt svar från anmälaren | M | Bleart |
| TB-62 | Ta ett ärende direkt från Alla ärenden | M | Bleart |
| TB-82 | Se mina liknande öppna ärenden när jag skriver en rubrik | S | Bleart |
| TB-61 | Filtrera mina tilldelade ärenden på status | S | David |
| TB-74 | Filtrera Mina ärenden på status | S | David |
| TB-75 | Se hur länge ett ärende har varit öppet | S | David |
| TB-76 | Filtrera Alla ärenden på kategori | S | David |
| TB-68 | Gemensam komponent för ärendelistor | _[?]_ | David |
| TB-78 | Städa och gruppera listmetoderna i backend | M | David |

**Totalt:** 9 S, 4 M, 0 L, och 5 kort utan storlek
<!-- Jämför med förra sprinten: hur mycket blev klart då? -->

## Risker och osäkerheter

<!-- Något ni inte vet hur man gör? Beroenden mellan stories? -->

- **18 kort är mycket.** I sprint 3 blev 8 kort klara. Det som bär sprintmålet är lösningen, nytt svar, öppna igen, ändra kategori och de fyra korten för formatering och styling. Övriga kort släpps först om tiden inte räcker.
- **Formateringen rör alla filer i frontend.** Den görs först och mergas innan någon annan öppnar en PR, annars blir det merge-konflikter som i sprint 2.
- **`AllTickets.tsx`** rörs av sju kort hos fyra personer: kategorifilter, anmälarfilter, hur länge öppet, nytt svar, ta ett ärende, listkomponenten och stylingen. Säg på standupen när du ska ändra i filen, och dra in `develop` innan du öppnar PR:en.
- **`TicketDetail.tsx`** rörs av lösningen, ändra kategori, öppna igen, inline-stilarna och stylingen.
- **FAQ-sidan** kräver ett beslut i beslutsloggen innan den påbörjas, eftersom "Kunskapsbank" står under *Ingår inte* i `docs/mvp.md`.
- **Inte med i sprinten:** README och demoguide (Must) och ett SQL-skript för kolumnen `priority`. Båda behövs före slutredovisningen i vecka 8.
