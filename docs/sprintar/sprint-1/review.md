# Sprint review: sprint 1

**Datum:** 2026-11-04
**Deltagare:** Mustafa Samir (PO), Adli Anabtawi (SM), David Andersson, Bleart Rama, Noah Fältman, läraren

## Del 1: Förberedelse

### Sprintmål

En anställd kan välja vem hen är, anmäla ett fel och se sina egna ärenden i en lista som hämtas från databasen.

**Uppnåddes sprintmålet?** Ja. Vi levererade dessutom IT-ansvarigas vy: se alla ärenden, tilldela och ändra status.

### Blev klart

| Issue | Story | Visas av |
|---|---|---|
| TB-22 | Välja vem man är | Adli |
| TB-23 | Anmäla ett fel | David |
| TB-24 | Se mina ärenden | Bleart |
| TB-25 | Se alla ärenden (IT-ansvarig) | Bleart |
| TB-26 | Öppna ett ärende | David |
| TB-42 | Länka listorna till detaljvyn | David |
| TB-28 | Tilldela ett ärende | Noah |
| TB-27 | Ändra status på ett ärende | Mustafa |
| TB-43 | Merge-fix efter TB-24 och TB-28 (tekniskt) | David |

Allt är granskat, mergat till develop och därefter till main (PR #46).

### Blev inte klart

| Issue | Story | Varför inte klar | Vad händer med den? |
|---|---|---|---|
| – | Alla planerade stories blev klara | – | – |

Känt fel: tilldelning till en användare som inte är IT-ansvarig ger HTTP 500 i stället för 403. Åtgärdas i sprint 2 (TB-45 Städa kod).

### Demoplan

1. Anna Lind (anställd) väljer vem hon är. (Adli, TB-22)
2. Anna anmäler ett fel. (David, TB-23)
3. Anna ser ärendet i "Mina ärenden" och öppnar detaljvyn. (Bleart TB-24, David TB-26/TB-42)
4. Maria Nordin (IT-ansvarig) ser "Alla ärenden" och tilldelar ärendet. (Bleart TB-25, Noah TB-28)
5. Maria ändrar status till Pågående. (Mustafa, TB-27)
6. Anna öppnar ärendet igen och ser den nya statusen, men kan inte ändra den. (Mustafa, TB-27)

### Frågor till läraren

- Är det rimligt att välja användare utan inloggning så här tidigt, eller bör vi prioritera inloggning (TB-33) högre?
- Vi planerar att lagra bilagor (TB-35) i S3-kompatibel molnlagring i stället för databasen. Är det en rimlig nivå för kursen?

## Del 2: Efter reviewn

### Feedback

-
-

### Ändringar i backloggen

-
