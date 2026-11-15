# Sprint review: sprint 3

<!--
  INSTRUKTION
  Del 1 fylls i INNAN reviewn, senast fredag kväll. Det är ert manus.
  Del 2 fylls i UNDER eller DIREKT EFTER reviewn.

  Reviewn med läraren är ungefär 20 minuter:
  - Sprintmål och vad som blev klart (2 min)
  - Demo av fungerande mjukvara (10 min)
  - Feedback och frågor (8 min)

  Visa bara stories som uppfyller Definition of Done. Halvfärdigt redovisas under "Blev inte klart".
  Demot ska köras på riktigt, inte med skärmdumpar. Testa det innan.
-->

**Datum:** 2026-11-16
**Deltagare:** Adli Anabtawi, Bleart Rama, David Andersson, Noah Fältman, Mustafa Samir, läraren

## Del 1: Förberedelse

### Sprintmål

Varje roll kan bara göra det den får och får tydliga svar när något inte är tillåtet, och IT-ansvariga får bättre överblick över ärendena.

**Uppnåddes sprintmålet?** Ja

### Blev klart

| Issue | Story | Visas av |
|---|---|---|
| TB-46 | Anställd ser bara sina egna ärenden | Bleart |
| TB-57 | Dölj formulär för anställd som inte är anmälare | Bleart |
| TB-51 | Ändra eller ta tillbaka ett ärende med status Ny | Mustafa |
| TB-47 | Samma felkod för otillåtna åtgärder | Noah |
| TB-48 | Validering av tilldelning | Noah |
| TB-50 | Sök ärenden på rubrik eller anmälare | Noah |
| TB-52 | Antal ej tilldelade ärenden | Adli |
| TB-36 | Statistik över öppna ärenden per kategori | David |

Allt är granskat, mergat till `develop` och vidare till `main` (PR #67, fredag kväll).

### Blev inte klart

| Issue | Story | Varför inte klar | Vad händer med den? |
|---|---|---|---|
| – | Alla planerade stories blev klara | – | – |

### Demoplan

1. Anna Lind (anställd) anmäler ett fel och ser det i "Mina ärenden". Hon ser bara sina egna ärenden, inte de andra anställdas. (Bleart, TB-46)
2. Anna öppnar sitt ärende med status Ny, ändrar rubriken och sparar. Hon tar sedan tillbaka ett annat ärende, som får status Återkallad. (Mustafa, TB-51)
3. Omar Haddad öppnar Annas ärende och får "Du har inte behörighet att se det här ärendet". Backend svarar 403, och formulären för kommentarer och bilagor döljs för den som varken är anmälare eller IT. (Bleart, TB-46 och TB-57)
4. Maria Nordin (IT-ansvarig) öppnar "Alla ärenden" och ser högst upp hur många ärenden som inte är tilldelade. (Adli, TB-52)
5. Maria går till fliken "Statistik" och visar antalet öppna ärenden per kategori. (David, TB-36)
6. Maria söker i "Alla ärenden" på en rubrik och sedan på en anmälare. En sökning utan träff ger "Inga ärenden matchar sökningen". (Noah, TB-50)
7. Maria tilldelar ett ärende. Bara IT-ansvariga går att välja i listan, och försöker man ändå tilldela till en anställd svarar backend 403 i stället för 500, som tidigare. (Noah, TB-48 och TB-47)

### Frågor till läraren

- Vi har nu rollkontroller på flera ställen i backend, men fortfarande ingen inloggning (TB-33). Bör vi prioritera upp den nästa sprint?
- Bilagor (TB-35) lagras i S3-kompatibel molnlagring i stället för i databasen. Är det en rimlig nivå för kursen?

## Del 2: Efter reviewn

### Feedback

-
-

### Ändringar i backloggen

-
