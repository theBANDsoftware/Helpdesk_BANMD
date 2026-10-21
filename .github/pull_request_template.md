## Vad gör den här pull requesten?

<!-- Beskriv kort vad som ändrats och varför. -->

**Jira:** TB-N

<!-- PR-titeln ska börja med Jira-nyckeln, t.ex. "TB-8 Skapa ärende via mejl". Då kopplas PR:en till kortet i Jira. -->

## Hur testar man den?

<!-- Beskriv konkreta teststeg utifrån storyns acceptanskriterier. -->

1. 
2. 

## Definition of Done

<!-- Speglar docs/definition-of-done.md. Ändras DoD ska den här listan ändras i samma PR. -->

**Innan du ber om granskning (den som skrivit koden)**

- [ ] Alla acceptanskriterier i storyn är uppfyllda och testade för hand
- [ ] Branchnamnet, alla commits och PR-titeln börjar med Jira-nyckeln
- [ ] Ingen kvarglömd felsökningskod: inga `console.log` eller `System.out.println`, ingen utkommenterad kod och inga TODO
- [ ] Inga lösenord eller andra hemligheter i koden
- [ ] Backendkoden följer controller → service → repository
- [ ] Vyer som ändrats fungerar i mobilbredd (360 px) utan att man behöver scrolla i sidled
- [ ] README eller `docs/` är uppdaterad om ändringen påverkar hur man startar eller använder projektet

**Granskaren, före och efter merge**

- [ ] Jag har läst hela ändringen under "Files changed"
- [ ] Jag har hämtat branchen och testat acceptanskriterierna själv
- [ ] Jag har skrivit i godkännandet vad jag har testat
- [ ] Jag godkänner PR:en och mergar den själv (ingen mergar sin egen PR)
- [ ] Efter mergen har jag hämtat `develop` och startat databas, backend och frontend utan fel

Hela DoD: [docs/definition-of-done.md](https://github.com/theBANDsoftware/Helpdesk_BANMD/blob/develop/docs/definition-of-done.md)

## Till granskaren

<!-- Ange särskilda områden att granska eller osäkerheter. -->