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

## 14. Ett återtaget ärende får status Återkallad

**Datum: 2026-11-12**
**Status: Gäller**

**Bakgrund:** I TB-51 kan anmälaren ta tillbaka sitt ärende medan det har status Ny. Storyn säger att vi måste bestämma vad "ta tillbaka" betyder i databasen innan den påbörjas.

**Alternativ:**
- Ärendet får status `RESOLVED` (Löst)
- En ny status `WITHDRAWN` (Återkallad)
- Ärendet tas bort

**Beslut:** En ny status, `WITHDRAWN`, som visas som "Återkallad". Bara anmälaren kan sätta den, och bara när ärendet har status `NEW`. IT-ansvariga kan inte välja den i statuslistan. Skriptet `V4__status_aterkallad.sql` lägger till värdet i `chk_tickets_status`.

**Varför:** Med `RESOLVED` ser det ut som att IT har löst ärendet, och det går inte att se skillnad på lösta och återkallade ärenden. Tas ärendet bort försvinner historiken, kommentarerna och bilderna, och filerna i B2 blir kvar utan koppling. En egen status är tydlig och behåller allt.

**Konsekvenser:**
- `V4__status_aterkallad.sql` måste köras i develop-databasen innan TB-51 testas (beslut 8).
- `Status.java`, `StatusTicket` i frontend och `statusLabels` har fått värdet `WITHDRAWN`.
- Filtret "Ej lösta" i Alla ärenden visar bara Ny och Pågående. Återkallade ärenden har ett eget val i filtret.
- Statistiken (TB-36) räknar redan bara `NEW` och `IN_PROGRESS`, så den påverkas inte.

## 13. Fyra godkännanden räcker för en PR till `main`

**Datum: 2026-11-09**
**Status: Gäller**

**Bakgrund:** En pull request till `main` krävde fem godkännanden. Vi är fem i gruppen och ingen kan godkänna sin egen pull request, så det gick aldrig att nå fem.

**Alternativ:**
- Fem godkännanden, som tidigare
- Fyra godkännanden, alltså alla utom den som skapat pull requesten

**Beslut:** En pull request till `main` behöver fyra godkännanden.

**Varför:** Fyra är det högsta antal som går att få när den som skapat pull requesten inte kan godkänna den. Alla andra i gruppen har ändå granskat det som går till `main`.

**Konsekvenser:**
- Inställningen för `main` i GitHub ändras från fem till fyra godkännanden.
- Alla utom den som skapat pull requesten måste godkänna den, så en frånvarande person stoppar mergen till `main`.
- Pull requests till `develop` påverkas inte. Där räcker ett godkännande (DoD punkt 3).

## 12. Ingen Jira-nyckel i commits

**Datum: 2026-11-06**
**Status: Gäller** 

**Bakgrund:** Enligt beslut 4 ska varje commit börja med Jira-nyckeln. Branchnamnet och PR-titeln har redan nyckeln, så vi behövde bestämma om den också behövs i varje commit.

**Alternativ:**
- Jira-nyckeln först i varje commit, som i beslut 4
- Jira-nyckeln bara i branchnamnet och PR-titeln, aldrig i commits

**Beslut:** Commit-meddelanden innehåller ingen Jira-nyckel. Branchnamnet och PR-titeln börjar fortfarande med den, t.ex. branchen `TB-8-skapa-arende-via-mejl` och PR:en `TB-8 Skapa ärende via mejl`.

**Varför:** Det räcker med branchen och PR:en. Jira kopplar ihop kortet med koden genom dem, så nyckeln i varje commit ger inget extra.

**Konsekvenser:**
- Ersätter den del av beslut 4 som gäller commits.
- DoD punkt 2, PR-mallen och gruppkontraktet är ändrade.
- Commit-meddelandet beskriver bara vad som ändrats, t.ex. `Lägg till sortering på prioritet`.

## 11. Bifogade bilder sparas i Backblaze B2, inte i databasen

**Datum: 2026-11-06**
**Status: Gäller**

**Bakgrund:** TB-35 (Bifoga skärmdump) behöver lagra bildfiler. Vi delar en databas på VPS:en men kör backend lokalt var för sig, så filerna måste ligga på ett ställe som alla når.

**Alternativ:**
- Bilderna i databasen (BLOB)
- En mapp på disken där backend körs
- S3-kompatibel lagring på VPS:en (t.ex. Garage)
- Molnlagring: Backblaze B2

**Beslut:** Bilderna sparas i en privat bucket i Backblaze B2 (region EU Central). Databasen sparar bara information om varje bild i tabellen `attachments`. Backend når B2 med AWS S3-klienten, via interfacet `FileStorageService` och klassen `S3FileStorageService`. Uppgifterna ligger i `.env` (`S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`).

**Varför:** Bilder i databasen gör den stor och långsam. En mapp på disken fungerar inte när alla kör backend lokalt, för då ser bara den som laddade upp bilden den. Egen lagring på VPS:en kräver att någon sätter upp och sköter en tjänst till. B2 är gratis upp till 10 GB, data ligger i EU och ingen behöver sköta någon server.

**Konsekvenser:**
- Alla behöver S3-raderna i sin `.env`. Nycklarna delas privat, aldrig i Git eller i chattar. Saknas de startar backend ändå, men uppladdning svarar 503.
- Bilderna hämtas alltid via backend. Bucketen är privat och nyckeln gäller bara den bucketen.
- Max 5 MB per bild, bara PNG och JPG, högst 3 bilder per ärende. Bara den som anmält ärendet och IT-ansvariga får ladda upp.
- Vill vi byta lagring skriver vi en ny klass som implementerar `FileStorageService`. Resten av koden ändras inte.

## 10. Vald användare skickas i headern `X-User-Id`

**Datum: 2026-10-28**
**Status: Gäller** 

**Bakgrund:** I MVP:n väljer man vem man är i en lista, utan lösenord (beslut 2). Backend måste ändå veta vem som gör anropet, till exempel vem som är anmälare när ett ärende skapas. Tills nu var anmälaren hårdkodad till användare 1.

**Alternativ:**
- Id:t skickas i bodyn på varje anrop som behöver det, t.ex. `createdById` i `CreateTicketRequest`
- Id:t skickas i en header, `X-User-Id`, på alla anrop
- Riktig inloggning med session eller token

**Beslut:** Frontend sparar den valda användaren i webbläsaren och skickar dess id i headern `X-User-Id` på alla anrop till backend. Det görs på ett ställe, i `shared/apiClient.ts`. Controllers som behöver veta vem som anropar läser headern med `@RequestHeader("X-User-Id")`.

**Varför:** Vem som anropar är inte en del av själva ärendet, så det hör inte hemma i bodyn. Med en header behöver ingen DTO ändras när fler endpoints behöver veta vem som anropar. Riktig inloggning är en egen story (TB-33, Should) och för stor för MVP:n.

**Konsekvenser:**
- Det här är inget skydd. Vem som helst kan skicka vilket id som helst. Riktigt skydd kommer med inloggning, och då ersätts headern.
- Saknas headern svarar backend 400. Finns inte användaren svarar backend 404, så att frontend kan skicka tillbaka till listan.

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
**Status: Gäller, utom för commits. Delen om commits är ersatt av #12.** 

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
