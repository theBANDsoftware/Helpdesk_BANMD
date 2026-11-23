# Helpdesk

Ett enkelt ärendesystem där anställda på en liten organisation anmäler IT-fel och följer dem, och där de IT-ansvariga får överblick, fördelar ärendena och markerar dem som lösta.

## Teamet

| Namn | GitHub |
|---|---|
| Adli Anabtawi | [@adlianabtawi](https://github.com/adlianabtawi) |
| Bleart Rama | [@BleartRama](https://github.com/BleartRama) |
| David Andersson | [@nattgud](https://github.com/nattgud) |
| Mustafa Samir | [@Mustafa-Samiir](https://github.com/Mustafa-Samiir) |
| Noah Fältman | [@noahfaltman-star](https://github.com/noahfaltman-star) |

## Vad appen kan

Det finns ingen riktig inloggning. Man väljer vem man är på startsidan, och vad man ser beror på rollen.

**Anställd**

- Anmäla ett fel med rubrik, beskrivning och kategori, och bifoga skärmdumpar
- Se sina egna ärenden och följa status
- Ändra eller ta tillbaka ett ärende så länge det är nytt
- Kommentera sina ärenden och svara IT
- Öppna ett löst eller återkallat ärende igen om felet kommer tillbaka
- Läsa vanliga frågor

**IT-ansvarig**

- Se alla ärenden, med antalet som inte är tilldelade överst
- Söka på rubrik eller anmälare, filtrera på status, kategori, tilldelning och anmälare, och sortera på tid eller prioritet
- Se hur länge ett ärende har varit öppet. Öppna ärenden som är äldre än en vecka markeras.
- Ta ett otilldelat ärende direkt i listan, eller tilldela det till en annan IT-ansvarig
- Ändra status, prioritet och kategori. När ett ärende markeras som löst måste man skriva vad som gjordes.
- Se statistik över antal ärenden per kategori

## Teknik

| Del | Teknik |
|---|---|
| Frontend | React 19 med TypeScript, Vite, React Router, TanStack Query |
| Backend | Java 21, Spring Boot 4 (Web, Data JPA, Validation), Swagger |
| Databas | MariaDB på Davids VPS |
| Bilder | Backblaze B2 (S3-kompatibel lagring) |

Varför vi valt den här stacken står i [beslutsloggen](docs/beslutslogg.md).

## Kom igång

### Det här behöver du

- **Java 21**: kontrollera med `java -version`
- **Node.js 22** eller senare: kontrollera med `node -v`
- **Databasuppgifter** till MariaDB på Davids VPS: adress, användarnamn och lösenord. Fråga David.
- **B2-nycklar** för bifogade bilder. Fråga Mustafa. Utan dem fungerar allt utom uppladdning av bilder.

Uppgifterna skickas aldrig i chatten eller läggs i repot. Maven behöver du inte installera. Repot innehåller `mvnw`, som laddar ner rätt version själv.

### 1. Klona repot

```bash
git clone https://github.com/theBANDsoftware/Helpdesk_BANMD.git
cd Helpdesk_BANMD
```

### 2. Lägg in uppgifterna

```bash
cp backend/helpdesk/.env.example backend/helpdesk/.env
```

Öppna `backend/helpdesk/.env` och fyll i databasuppgifterna och B2-nycklarna. `DB_URL` är bara adress, port och databas, t.ex. `123.45.67.89:3306/helpdesk`, utan `jdbc:mariadb://`. Filen finns i `.gitignore` och följer aldrig med i en commit.

Startar du backend från IntelliJ kan du i stället lägga uppgifterna som miljövariabler i run-konfigurationen. De går före `.env`.

Databasen och tabellerna på VPS:en skapas av David med skripten i [`database/`](database/README.md). Det behöver du inte göra själv.

### 3. Starta backend (terminal 1)

```bash
cd backend/helpdesk
./mvnw spring-boot:run
```

På Windows: `mvnw.cmd spring-boot:run`. Första gången tar det en stund, eftersom Maven laddar ner alla beroenden. Backend är igång när det står `Started HelpdeskApplication` och svarar på http://localhost:8080/api/users. API-dokumentationen finns på http://localhost:8080/swagger-ui.html.

### 4. Starta frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Öppna http://localhost:5173. Om allt fungerar visar sidan *Vem är du?* och en lista med användarna från databasen. Då når frontend backend, och backend når databasen. Sidan hämtar bara när den laddas, så ladda om den om du startade frontend innan backend var klar.

### Om något inte fungerar

| Sidan visar | Det betyder |
|---|---|
| Kunde inte nå backend | Backend är inte startad, eller startade med fel. Titta i terminal 1. |
| Databasen svarar inte: ${DB_URL} | `backend/helpdesk/.env` saknas eller ligger i fel mapp. Gör steg 2 och starta om backend. |
| Databasen svarar inte: … (något annat) | Fel i `backend/helpdesk/.env`, VPS:en är nere, eller din IP-adress släpps inte in. Backend startar ändå, så du kan rätta `.env` och starta om. |
| Det finns inga användare i databasen | Tabellerna finns men testdatan saknas. Be David köra `database/V2__testdata.sql`. |
| Bilder går inte att ladda upp | B2-nycklarna saknas eller är fel i `.env`. Resten av appen fungerar ändå. |

## Demoguide

Ungefär 5 minuter. Starta backend och frontend enligt *Kom igång* och öppna http://localhost:5173. Demon fungerar bäst om databasen har några ärenden i olika status, så att listorna inte är tomma.

**Som anställd**

1. Välj **Anna Lind** på *Vem är du?*. Du hamnar på dina egna ärenden.
2. Klicka **Anmäl ett fel**, fyll i rubrik, beskrivning och kategori, bifoga gärna en skärmdump och skicka.
3. Öppna ärendet. Det har status *Ny*, och du kan ändra det eller ta tillbaka det.
4. Skriv en kommentar, t.ex. "Det händer varje morgon".

**Som IT-ansvarig**

5. Klicka **Byt användare** i sidhuvudet och välj **Maria Nordin**. Du ser alla ärenden och hur många som inte är tilldelade.
6. Visa filtren: välj kategorin Skrivare, byt tilldelning till Ingen, sök på "Anna" och sortera på prioritet. Gamla öppna ärenden har en klocka och röd bakgrund.
7. Klicka **Ta ärendet** på Annas nya ärende. Siffran för otilldelade minskar.
8. Öppna ärendet, sätt prioritet Hög, status *Pågående* och svara på Annas kommentar.
9. Byt status till *Löst*. Fältet för lösningen dyker upp. Skriv vad som gjordes och spara. Lösningen syns som en kommentar.
10. Öppna **Statistik** och visa antalet ärenden per kategori.

**Tillbaka som anställd**

11. Byt till Anna Lind igen. Ärendet är löst och lösningen syns. Klicka **Öppna igen** för att visa att ärendet går tillbaka till IT.

Visa gärna mobilvyn också: öppna utvecklarverktygen i webbläsaren och välj en mobilbredd. Menyn flyttas då ner längst ner på skärmen.

## Kommandon

| Var | Kommando | Vad det gör |
|---|---|---|
| `backend/helpdesk/` | `./mvnw spring-boot:run` | Startar backend på port 8080 |
| `backend/helpdesk/` | `./mvnw test` | Kör testerna. De behöver ingen databas. |
| `frontend/` | `npm run dev` | Startar frontend på port 5173 |
| `frontend/` | `npm run build` | Typkontrollerar och bygger frontend |
| `frontend/` | `npm run lint` | Letar efter vanliga fel i koden |
| `frontend/` | `npm run format` | Formaterar koden med Prettier. Kör innan du committar. |
| `frontend/` | `npm run format:check` | Kontrollerar formateringen utan att ändra något |

## Projektstruktur

Backend är uppdelad efter **typ av klass**: alla controllers i en mapp, alla services i en annan, och så vidare. Frontend är uppdelad efter **funktion**, med en mapp per funktion under `features/`.

```
backend/helpdesk/src/main/java/com/thebanmd/helpdesk/
  HelpdeskApplication.java
  controllers/                ← tar emot anropen: Ticket, Comment, Attachment, User
  services/                   ← logiken, t.ex. TicketService och S3FileStorageService
  repositories/               ← pratar med databasen (Spring Data JPA)
  entities/                   ← en klass per tabell: Ticket, Comment, Attachment, User
  enums/                      ← Category, Status, TicketPriority, Role
  dtos/                       ← det som skickas till och från frontend
  mappers/                    ← gör om entiteter till dto:er
  exceptions/                 ← egna fel och gemensam felhantering, t.ex. 503 när databasen inte svarar

frontend/src/
  App.tsx                     ← routern: en rad per sida
  Types.ts                    ← gemensamma typer, t.ex. TicketSummary
  features/
    tickets/                  ← listan, detaljvyn, formuläret, statistik och tickets-API:t
    comments/                 ← kommentarer på ett ärende
    attachments/              ← bifogade skärmdumpar
    users/                    ← välj användare, menyn och vem som är vald
    start/                    ← startsidan
    faq/                      ← vanliga frågor
  shared/
    apiClient.ts              ← alla anrop till backend går härigenom
    DataTable.tsx             ← tabellen i detaljvyn och statistiken
    formatDate.ts             ← datum och "tid sedan"
    Icon.tsx                  ← ikoner från Material Symbols

database/                     ← SQL-skripten för databasen, körs av David
```

Strukturen i backend är beslut 9 i beslutsloggen. En ny funktion får därför en fil i varje mapp, till exempel `CommentController`, `CommentService`, `CommentRepository`, `Comment`, `CommentMapper` och sina dto:er. I frontend får den en egen mapp under `features/`.

Frontend anropar alltid `/api/...`. Under utveckling skickar Vite vidare de anropen till backend på port 8080, så backend behöver ingen CORS-inställning.

## Dokumentation

| Dokument | Innehåll |
|---|---|
| [Gruppkontrakt](docs/gruppkontrakt.md) | Hur vi samarbetar |
| [Definition of Done](docs/definition-of-done.md) | När en story räknas som klar |
| [MVP](docs/mvp.md) | Vad som ingår i första versionen |
| [User stories](docs/user-stories.md) | Alla stories med acceptanskriterier |
| [Databasschema](docs/databasschema.md) | Tabeller och relationer |
| [Databasskript](database/README.md) | Vilka SQL-skript som finns och i vilken ordning de körs |
| [Beslutslogg](docs/beslutslogg.md) | Viktiga beslut och varför |
| [Sprintar](docs/sprintar/) | Planning, standups, review och retro per sprint |
| [Individuella reflektioner](docs/reflektioner/) | En per person, lämnas in vecka 8 |

## Board

Arbetet organiseras i Jira: [TB-boarden](https://davidceandersson.atlassian.net/jira/software/projects/TB/boards/101)
