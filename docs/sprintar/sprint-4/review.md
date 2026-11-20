# Sprint review: sprint 4

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

**Datum:** 2026-11-23
**Deltagare:** Adli Anabtawi, Bleart Rama, David Andersson, Noah Fältman, Mustafa Samir, läraren

## Del 1: Förberedelse

### Sprintmål

Ett ärende kan följas hela vägen från anmälan till dokumenterad lösning, och öppnas igen om felet kommer tillbaka, i en app som är enhetlig på alla sidor.

**Uppnåddes sprintmålet?** Ja

Ett ärende kan nu följas från anmälan till en dokumenterad lösning och öppnas igen av anmälaren, och hela appen har samma formatering och styling. Storyn "Se vilka ärenden som har ett nytt svar från anmälaren" hann inte bli klar, men sprintmålet kräver den inte.

### Blev klart

| Issue                      | Story                                                                              | Visas av |
| -------------------------- | ---------------------------------------------------------------------------------- | -------- |
| TB-77                      | Läsa svar på vanliga problem innan jag anmäler ett fel                             | Mustafa  |
| TB-74                      | Filtrera Mina ärenden på status                                                    | David    |
| TB-66, TB-67, TB-70, TB-71 | Gemensam formatering, CSS i stället för inline-stilar, färger och enhetlig styling | Noah     |
| TB-68, TB-78               | Gemensam komponent för ärendelistor och städade listmetoder i backend              | David    |
| TB-76                      | Filtrera Alla ärenden på kategori                                                  | David    |
| TB-75                      | Se hur länge ett ärende har varit öppet                                            | David    |
| TB-61                      | Filtrera mina tilldelade ärenden på status                                         | David    |
| TB-62                      | Ta ett ärende direkt från Alla ärenden                                             | Bleart   |
| TB-83                      | Klicka på en anmälare och se alla dennes ärenden                                   | Adli     |
| TB-81                      | Ändra kategori på ett ärende                                                       | Adli     |
| TB-80                      | Skriva en lösning när ett ärende markeras som löst                                 | Adli     |
| TB-73                      | Öppna ett löst eller återkallat ärende igen                                        | Mustafa  |

Utöver dessa blev planeringen av sprint 4 (TB-85) och en mergefix (TB-86) klara. Totalt 18 av 20 kort, mot 8 i sprint 3.

### Blev inte klart

| Issue | Story                                                    | Varför inte klar    | Vad händer med den?                                  |
| ----- | -------------------------------------------------------- | ------------------- | ---------------------------------------------------- |
| TB-79 | Se vilka ärenden som har ett nytt svar från anmälaren    | _[fyll i: varför?]_ | _[fyll i: sprint 5 eller tillbaka till backloggen?]_ |
| TB-82 | Se mina liknande öppna ärenden när jag skriver en rubrik | _[fyll i: varför?]_ | _[fyll i: sprint 5 eller tillbaka till backloggen?]_ |

### Demoplan

Demot följer ett ärende hela vägen, från anmälan till lösning och tillbaka.

1. Anna Lind (anställd) läser Vanliga frågor och hittar inget svar. Från formuläret för att anmäla ett fel finns en länk till sidan. Hon anmäler felet. (Mustafa, TB-77)
2. Anna filtrerar Mina ärenden på status. (David, TB-74)
3. Maria Nordin (IT-ansvarig) öppnar Ärenden. Visa den nya enhetliga designen, även i mobilbredd. (Noah, TB-66, TB-67, TB-70, TB-71, och David, TB-68)
4. Maria filtrerar på kategori och ser hur länge ärendena har varit öppna. (David, TB-76 och TB-75)
5. Maria klickar på Anna Lind och ser alla hennes ärenden, så att hon ser om problemen återkommer. (Adli, TB-83)
6. Maria tar Annas ärende direkt från listan och filtrerar sedan sina tilldelade ärenden på status. (Bleart, TB-62, och David, TB-61)
7. Maria öppnar ärendet och ändrar kategori, eftersom Anna valt fel. (Adli, TB-81)
8. Maria markerar ärendet som löst. Hon måste skriva vad som gjordes, och lösningen hamnar bland kommentarerna. (Adli, TB-80)
9. Anna ser lösningen. Felet kommer tillbaka, och hon öppnar ärendet igen. (Mustafa, TB-73)

### Frågor till läraren

- I sprint 4 tog vi in 18 kort och 16 av storyerna och uppgifterna blev klara, mot 8 i sprint 3. Är korten för små, eller är det rätt nivå?
- Flera kort rörde samma filer, och vi fick lösa många mergekonflikter. Hur brukar team planera kring det?
- Inför slutredovisningen saknas README och demoguide, och ett SQL-skript för kolumnen `priority`. Ska de prioriteras först i sprint 5?

## Del 2: Efter reviewn

### Feedback

-
-

### Ändringar i backloggen

<!-- Nya stories, ändrad prioritet, stories som tagits bort. Länka issues. -->

-
