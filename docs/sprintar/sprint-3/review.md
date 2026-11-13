# Sprint review: sprint N

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

**Datum: 2026-11-16**
**Deltagare: Adli Anabtawi, Bleart Rama (PO), David Andersson, Noah Fältman, Mustafa Samir (SM), läraren**

## Del 1: Förberedelse

### Sprintmål
Varje roll kan bara göra det den får och får tydliga svar när något inte är tillåtet, och IT-ansvariga får bättre överblick över ärendena.



**Uppnåddes sprintmålet?** Ja

### Blev klart

| Issue | Story | Storlek | Ansvarig |
|---|---|---|---|
|TB-47 |Samma felkod för otillåtna åtgärd |S |Adli |
|TB-48 |Validering av tilldelning |S |Noah |
|TB-46 |Anställd ser bara sina egna ärenden |M |Bleart |
|TB-57|Dölj formulär för anställd som inte är anmälare|S|Bleart|
|TB-36|Statistik över öppna ärenden per kategori|M|David|
|TB-50|Söka på rubrik eller anmälare|S|Noah|
|TB-51|Ändra eller ta tillbaka ett ärende med status Ny|M|Mustafa|
|TB-52|Antal ej tilldelade ärenden|S|Adli|

### Blev inte klart

Alla stories i sprinten blev klara.

### Demoplan

1. Anna Lind (anställd) öppnar Mina ärenden och ser bara sina egna ärenden. (TB-46)

2. Anna Lind öppnar ett av sina ärenden. Formuläret för status, tilldelning och prioritet syns inte. (TB-57)

3. Anna Lind klistrar in länken till någon annans ärende och får "Du har inte behörighet att se det här ärendet" i stället för ett serverfel. (TB-46)

4. Anna Lind rättar ett fel i ett ärende som har status Ny, och tar sedan tillbaka ett annat eftersom problemet har löst sig. (TB-51)

5. Maria Nordin (IT-ansvarig) öppnar Alla ärenden och söker på rubrik och på anmälare. (TB-50)

6. Maria Nordin ser hur många ärenden som inte är tilldelade (TB-52) och statistiken över öppna ärenden per kategori. (TB-36)

7. Maria Nordin försöker tilldela ett ärende till en anställd och får ett begripligt felmeddelande. (TB-48)

8. Byt till Anna Lind och försök göra en åtgärd som bara IT-ansvariga får, till exempel via Swagger. Svaret är samma felkod och ett begripligt meddelande, inte 500. (TB-47)

### Frågor till läraren

<!-- Något ni vill ha feedback på eller är osäkra på? -->

-

## Del 2: Efter reviewn

### Feedback

> **Exempel:** Läraren frågade hur man vet vem som ska göra nästa disk. I deras kollektiv turas man om varje vecka i stället för att tilldela.

-
-

### Ändringar i backloggen

<!-- Nya stories, ändrad prioritet, stories som tagits bort. Länka issues. -->

> **Exempel:** Ny story #15 "Turordning per vecka" som Must. "Tilldela en syssla" (#5) sänks till Should.

-
