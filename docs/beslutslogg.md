# Beslutslogg

<!--
  INSTRUKTION
  Här skriver ni ner större beslut och varför ni tog dem. Det är inte en lista över allt ni gör,
  utan över de val som påverkar projektet och som någon senare kan undra över.

  Exempel på beslut som ska hit:
  - Val av stack, ramverk eller större bibliotek
  - Hur ni strukturerar koden (mappar, lager, API-design)
  - Större ändringar i MVP:n eller databasschemat
  - Saker ni medvetet valt bort

  Skriv beslutet när det tas, inte i efterhand. Lägg nyaste beslutet överst.
  Ett beslut kan ersättas av ett senare. Skriv då "Ersatt av #N" på det gamla i stället för att ta bort det.
-->

## Mall

Kopiera den här för varje nytt beslut:

```markdown
## #N Rubrik

**Datum:**
**Status:** Gäller / Ersatt av #N

**Bakgrund:** Vad behövde vi bestämma, och varför?

**Alternativ:**
- Alternativ A
- Alternativ B

**Beslut:** Vad valde vi?

**Varför:** Varför valde vi det, och vad valde vi bort?

**Konsekvenser:** Vad betyder beslutet för projektet framåt?
```

<!-- Era beslut nedan, nyaste överst. -->

## 9. Backend sorteras efter typ av klass

**Datum: 2026-10-26**
**Status: Gäller** 

**Bakgrund:** Skelettet sorterade backend efter funktion, med en mapp per funktion (`users/`). Inför den första storyn med ärenden behövde vi bestämma hur koden ska sorteras när den växer.

**Alternativ:**
- Efter funktion: `users/`, `tickets/`, där varje mapp har sin controller, service, repository och entitet
- Efter typ: `controllers/`, `services/`, `repositories/`, `entities/`, `dtos/` och `exceptions/`

**Beslut:** Efter typ.

**Varför:** Det är lättare att hitta rätt fil när alla controllers, services osv. ligger på samma ställe, och det är den struktur som de flesta Spring Boot-guider använder. Det passar också DoD punkt 7, där lagren controller → service → repository syns direkt i mapparna.

**Konsekvenser:**
- En ny funktion lägger till en fil i flera mappar i stället för en egen mapp.
- Klasser och metoder som används från en annan mapp måste vara `public`, eftersom mapparna är olika paket i Java.
- Frontend sorteras fortfarande efter funktion (`frontend/src/features/`).

## 8. Tabellerna skapas med SQL-skript som körs för hand

**Datum: 2026-10-21**
**Status: Gäller** 

**Bakgrund:** Backend behöver tabellerna `users`, `tickets` och `comments` på Davids VPS. Vi behövde bestämma hur de skapas och ändras.

**Alternativ:**
- Hibernate skapar dem automatiskt (`ddl-auto=update`)
- Flyway kör migreringsfiler automatiskt när backend startar
- SQL-skript i repot som David kör för hand

**Beslut:** SQL-skript i `database/`, som David kör för hand på VPS:en. Hibernate rör inte tabellerna (`ddl-auto=none`).

**Varför:** Inget nytt beroende, och David har full kontroll över databasen på sin VPS. Med `ddl-auto=update` hade vem som helst kunnat ändra den gemensamma databasen genom att starta backend från en ofärdig branch.

**Konsekvenser:**
- Skripten numreras (`V1__…`, `V2__…`). Ett skript som redan har körts ändras aldrig, utan ändringar blir ett nytt skript.
- Den som ändrar schemat säger till på standupen, och David kör skriptet när PR:en är mergad.
- Om databasen och koden inte stämmer märks det först när en endpoint anropas, inte när backend startar.
- Namnen följer Flyways format, så det går att byta till Flyway senare utan att döpa om något.

## 7. MariaDB i stället för MySQL

**Datum: 2026-10-21**
**Status: Gäller** 

**Bakgrund:** Davids VPS (beslut 6) kör MariaDB. Skelettet var byggt för MySQL.

**Alternativ:**
- Installera MySQL på VPS:en
- Använda MariaDB, som redan finns där

**Beslut:** MariaDB.

**Varför:** Den finns redan på VPS:en och fungerar nästan likadant som MySQL för det vi behöver.

**Konsekvenser:**
- Backend använder drivrutinen `mariadb-java-client` och dialekten `MariaDBDialect`.
- I `backend/.env` anges bara adress, port och databas i `DB_URL`, t.ex. `VPS-ADRESS:3306/helpdesk`. `jdbc:mariadb://` står redan i `application.properties`.
- SQL-skript ska fungera i MariaDB. Sorteringen `utf8mb4_0900_ai_ci` finns bara i MySQL, så vi använder `utf8mb4_unicode_ci`.
- Beslut 1 och 2 nämner MySQL. De står kvar som de togs.

## 6. Databasservern på Davids VPS

**Datum: 2026-10-19**
**Status: Gäller** 

**Bakgrund:** Beslut 2 var att köra databasen på Aiven. Vi har bytt till en VPS som David har.

**Alternativ:**
- Aiven (beslut 2)
- Davids VPS
- En databas lokalt hos var och en

**Beslut:** Databasen körs på Davids VPS. Vilken databas det är står i beslut 7.

**Varför:** _[fyll i]_

**Konsekvenser:**
- Databasen är bara uppe när VPS:en är det, och David ansvarar för den. Backup behöver ordnas.
- Var och en får en egen databasanvändare. Lösenorden ligger aldrig i repot (DoD punkt 6).
- Port 3306 ska inte stå öppen mot hela internet. Begränsa den med brandvägg eller anslut via SSH-tunnel.
- Det går enkelt att skapa en databas per person att utveckla mot, plus en gemensam för `develop`. Se öppna frågor i `databasschema.md`.

## 5. Kategorier som enum, inte egen tabell

**Datum: 2026-10-19**
**Status: Gäller** 

**Bakgrund:** Ett ärende har en kategori (Dator, Skrivare, Nätverk, Konto och behörighet, Annat). Vi behövde bestämma hur den lagras i databasen.

**Alternativ:**
- Enum i Java-koden, lagrad som text i `tickets`
- Egen tabell `categories` som `tickets` kopplas till

**Beslut:** Enum, lagrad som text (`@Enumerated(EnumType.STRING)`).

**Varför:** Kategorierna är få och ingen story kräver att de kan ändras. En egen tabell hade gett en tabell, en relation och en endpoint till i sprint 1 utan att någon användare får något av det.

**Konsekvenser:** Nya eller ändrade kategorier kräver en kodändring. Att IT-ansvariga själva kan redigera kategorier är medvetet bortvalt. Eftersom värdet lagras som text går det att byta till en egen tabell senare utan att befintlig data behöver tolkas om.

## 4. Jira-nyckel i branches, commits och pull requests

**Datum: 2026-10-19**
**Status: Gäller** 

**Bakgrund:** När vi bytte till Jira (beslut 3) behövde korten i Jira kopplas till koden i GitHub.

**Alternativ:**
- Ingen koppling. Korten och koden hålls ihop för hand.
- Jira-nyckeln först i branchnamn, commits och PR-titlar, så att GitHub for Jira kopplar ihop dem.

**Beslut:** Jira-nyckeln först i allt. Branchen heter t.ex. `TB-8-skapa-arende-via-mejl` och commiten `TB-8 Skapa ärende via mejl`.

**Varför:** I Jira-kortet syns vilka branches, commits och pull requests som hör till storyn, utan att någon behöver länka för hand.

**Konsekvenser:** `Closes #N` gäller inte längre. DoD punkt 2 och PR-mallen är ändrade. Korten flyttas till Done med en automatiseringsregel i Jira eller för hand.

## 3. Jira vs Github issues

**Datum: 2026-10-16**
**Status: Gäller** 

**Bakgrund:** Vill vi använda Jira eller github issues som primärt verktyg för kort

**Alternativ:**
- Github issues och Jira
- Bara Jira
  
**Beslut:** Jira

**Varför:** Jira har större stöd för hela flödet för SCRUM

**Konsekvenser:** Ett tydligare och mer sömlöst arbetssätt.

## 2. MySQL-server

**Datum: 2026-10-16**
**Status: Ersatt av 6** 

**Bakgrund:** Var MySQL-servern hostas.

**Alternativ:**
- Aiven
- Supabase
- Egen VPS

**Beslut:** Aiven

**Varför:** Enkelt att sätta upp och gratis.

**Konsekvenser:** Att vi har en MySQL-server uppsatt som är publik.

## 1. Stack

**Datum: 2026-10-13**
**Status: Gäller** 

**Bakgrund:** Vilken stack vi ska använda.

**Alternativ:**
 - MySQL, React, Express
 - MySQL, React, Spring Boot

**Beslut:** Spring Boot

**Varför:** Bekant stack och tydligt ramverk.

**Konsekvenser:** Utvecklingsprocessen bör vara mer modulär och effektiv.
