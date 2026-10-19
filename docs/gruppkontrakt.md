# Gruppkontrakt

<!--
  UTKAST att gå igenom tillsammans. Allt här är förslag: stryk, ändra och lägg till.
  Mallen (gruppkontrakt.md) är orörd.
-->

**Grupp:** _[the BANMD]_
**Datum:** _[13/10 - 2026]_
**Medlemmar:** _[Bleart Rama]_, _[Adli Anabtawi]_, _[Noah Fältman]_, _[Mustafa Samir]_, _[David Andersson]_
## Tillgänglighet

- Vi jobbar med projektet väldigt flexibelt. Vi träffas för standupen varje dag, vi är dock flexibla med när vi träffas varje dag. tidigast kl 08.00, senast kl 22.00.
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
- Daily standup hålls varje vardag kl. _[tid, t.ex. 09:15]_, max 15 minuter, i Discord.
- Frånvaro meddelas i `#allmänt` senast kl. 9 samma dag, eller så snart man vet om det.
- Den som missar daily standup skriver sina tre rader (gjort igår, gör idag, hinder) i `#standup` själv samma dag.
- Den som missar en måndagsceremoni läser anteckningarna och bekräftar i kanalen att den har gjort det innan dagen är slut.

## Arbetsfördelning

- På sprint planning väljer vi tillsammans vilka stories som ska med i sprinten. Sedan tar var och en själv en story från "Att göra" och sätter sig som ansvarig på boarden.
- Alla tar minst en story per sprint och granskar minst en pull request per sprint.
- Ingen har mer än en story i "Pågår" åt gången.
- Den som kört fast i mer än en timme ber om hjälp i `#hjälp`.
- Den som blir klar granskar öppna pull requests först, och tar en ny story först därefter.
- Vi roterar rollen Scrum Master. 

## Beslut

- Mindre beslut (namngivning, hur en enskild komponent byggs) tar den som äger storyn.
- Större beslut (stack, arkitektur, databasschema, ändringar i MVP:n) tas gemensamt och skrivs in i beslutsloggen med datum och motivering.
- Vi försöker först bli överens. Går det inte röstar vi, och majoriteten bestämmer.
- Vid lika röster har Product Owner sista ordet om *vad* som byggs. Den som äger storyn har sista ordet om *hur*.

## Kod och kvalitet

<!-- Fylls på efter pass 3 (Git i team). -->

- Ingen pushar direkt till `main` eller `develop`. All kod går via en branch och en pull request.
- Branches och commits börjar med Jira-nyckeln: branchen heter t.ex. `TB-8-skapa-arende-via-mejl` och commiten `TB-8 Skapa ärende via mejl`.
- Pull requests granskas inom 24 timmar (vardagar).
- Ingen mergar sin egen pull request. Minst en annan person ska ha godkänt den.
- Alla ska kunna förklara den kod de lämnar in, även kod som tagits fram med hjälp av AI.

## Om någon inte följer kontraktet

1. Vi tar upp det direkt och vänligt med personen, i första hand muntligt.
2. Om det fortsätter tar vi upp det på nästa retrospektiv och skriver ner vad vi kommer överens om.
3. Om det fortfarande inte löser sig tar vi upp det med Product Ownern.

## Underskrifter

Vi har läst kontraktet och är överens om det.

| Namn | Datum |
|---|---|
[Adli Anabtawi], [13/10 - 2026]
[Bleart Rama], [13/10 - 2026]
[David Andersson], [13/10 - 2026]
[Noah Fältman], [13/10 - 2026]
[Mustafa Samir], [16/10 - 2026]

## Ändringar

| Datum | Ändring | Varför |
|---|---|---|
| | | |
