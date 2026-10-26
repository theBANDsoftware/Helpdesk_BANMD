# Gruppkontrakt

**Grupp:** the BANMD
**Datum:** 2026-10-13
**Medlemmar:** Bleart Rama, Adli Anabtawi, Noah Fältman, Mustafa Samir, David Andersson

## Tillgänglighet

- Vi jobbar flexibelt med projektet, mellan kl. 08.00 och 22.00. Daily standup har en fast tid, se "Närvaro och frånvaro".
- Helger träffas vi vid behov (10-19). Ingen förväntas svara då, och ingen förväntas ha läst meddelanden som skickats då förrän nästa vardag kl. 9.
- Under arbetstid svarar vi på meddelanden i gruppkanalen inom 2 timmar. Den som blir nämnd (@namn) svarar inom 1 timme.
- Alla lägger in sina fasta hinder (jobb, andra kurser, återkommande tider) i ett delat schema första veckan, så att vi vet när var och en inte kan.

## Kommunikation

- **Discord** för daglig kontakt och snabba frågor. Vi har separata kanaler för `#allmänt`, `#standup` och `#hjälp`.
- **GitHub** för allt som rör kod: frågor om en ändring tas i kommentarer på pull requesten, inte i chatten.
- **Jira** är där vi organiserar arbetet: backlog, sprintar och vem som gör vad. Står det inte på ett kort i Jira är det inte bestämt. Kod och dokumentation ligger i GitHub.
- Beslut som tas i chatten eller på möte skrivs in i beslutsloggen samma dag av den som tog upp frågan.
- Vi ger feedback på koden och arbetet, inte på personen. Vi säger vad som är bra, inte bara vad som är fel.

## Närvaro och frånvaro

- Alla är med på lektionspassen (måndag och onsdag) och på sprint review, retro och sprint planning varje måndag.
- Daily standup hålls varje vardag kl. 20.00–20.15 i Discord. Tiden är preliminär och ses över på retron efter sprint 1.
- Scrum Master leder standupen och loggar den i `docs/sprintar/sprint-N/standup.md` samma kväll.
- Frånvaro meddelas i `#allmänt` senast kl. 9 samma dag, eller så snart man vet om det.
- Den som missar daily standup skriver sina tre rader (gjort igår, gör idag, hinder) i `#standup` själv samma dag.
- Den som missar en måndagsceremoni läser anteckningarna och bekräftar i kanalen att den har gjort det innan dagen är slut.

## Arbetsfördelning

- På sprint planning väljer vi tillsammans vilka stories som ska med i sprinten. Sedan tar var och en själv en story från "Att göra" och sätter sig som ansvarig på boarden.
- Alla tar minst en story per sprint och granskar minst en pull request per sprint.
- Ingen har mer än en story i "Pågår" åt gången.
- Den som kört fast i mer än en timme ber om hjälp i `#hjälp`.
- Den som blir klar granskar öppna pull requests först, och tar en ny story först därefter.
- Vi roterar rollerna Product Owner och Scrum Master varje sprint, enligt tabellen nedan. Alla har varje roll en gång, och ingen har båda samma sprint. Ordningen lottades 2026-10-26.
- Den som inte kan ha sin roll en vecka byter med någon annan. Bytet skrivs in i sprintens `planning.md`.

| Sprint | Vecka | Product Owner | Scrum Master |
|---|---|---|---|
| 1 | 3 | Mustafa Samir | Adli Anabtawi |
| 2 | 4 | Noah Fältman | David Andersson |
| 3 | 5 | Bleart Rama | Mustafa Samir |
| 4 | 6 | Adli Anabtawi | Noah Fältman |
| 5 | 7 | David Andersson | Bleart Rama |

## Beslut

- Mindre beslut (namngivning, hur en enskild komponent byggs) tar den som äger storyn.
- Större beslut (stack, arkitektur, databasschema, ändringar i MVP:n) tas gemensamt och skrivs in i beslutsloggen med datum och motivering.
- Vi försöker först bli överens. Går det inte röstar vi, och majoriteten bestämmer.
- Vid lika röster har Product Owner sista ordet om *vad* som byggs. Den som äger storyn har sista ordet om *hur*.

## Kod och kvalitet

- Ingen pushar direkt till `main` eller `develop`. All kod går via en branch och en pull request.
- Branches och commits börjar med Jira-nyckeln: branchen heter t.ex. `TB-8-skapa-arende-via-mejl` och commiten `TB-8 Skapa ärende via mejl`.
- En pull request innehåller en story eller uppgift.
- Pull requests granskas inom 24 timmar (vardagar).
- Alla ska kunna förklara den kod de lämnar in, även kod som tagits fram med hjälp av AI.

**Granskning**

- Ett godkännande betyder att granskaren har läst hela ändringen under "Files changed", hämtat branchen och testat acceptanskriterierna själv, och gått igenom DoD-checklistan i PR:en.
- Granskaren skriver i godkännandet vad den har testat, t.ex. "Testade att skicka ett ärende utan rubrik, felmeddelandet visas."
- Är en pull request för stor för att granska ordentligt ber granskaren om att den delas upp.
- Ingen mergar sin egen pull request. Den som godkänner är den som mergar, och startar sedan appen från `develop` (DoD punkt 3 och 4).

## Om någon inte följer kontraktet

1. Vi tar upp det direkt och vänligt med personen, i första hand muntligt.
2. Om det fortsätter tar vi upp det på nästa retrospektiv och skriver ner vad vi kommer överens om.
3. Om det fortfarande inte löser sig tar vi upp det med Product Ownern.

## Underskrifter

Vi har läst kontraktet och är överens om det.

| Namn | Datum |
|---|---|
| Adli Anabtawi | 2026-10-13 |
| Bleart Rama | 2026-10-13 |
| David Andersson | 2026-10-13 |
| Noah Fältman | 2026-10-13 |
| Mustafa Samir | 2026-10-16 |

## Ändringar

| Datum | Ändring | Varför |
|---|---|---|
| 2026-10-21 | "Kod och kvalitet": regler för granskning, PR-storlek och vem som mergar | Läxan i pass 3. Ett godkännande ska betyda att PR:en faktiskt är granskad och testad. |
| 2026-10-26 | "Närvaro och frånvaro": daily standup kl. 20.00–20.15, och Scrum Master loggar den | Läxan i pass 4. |
| 2026-10-26 | "Arbetsfördelning": PO och SM roterar varje sprint, med lottad ordning för sprint 1–5 | Läxan i pass 4. Alla får prova båda rollerna, och det är bestämt i förväg vem som har vilken. |
