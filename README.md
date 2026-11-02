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

## Teknik

| Del | Teknik |
|---|---|
| Frontend | React 19 med TypeScript, Vite, React Router |
| Backend | Java 21, Spring Boot 4 (Web, Data JPA, Validation) |
| Databas | MariaDB på Davids VPS |

Varför vi valt den här stacken står i [beslutsloggen](docs/beslutslogg.md).

## Kom igång

### Det här behöver du

- **Java 21**: kontrollera med `java -version`
- **Node.js 22** eller senare: kontrollera med `node -v`
- **Databasuppgifter** till MariaDB på Davids VPS: adress, användarnamn och lösenord. Fråga David. Uppgifterna skickas aldrig i chatten eller läggs i repot.

Maven behöver du inte installera. Repot innehåller `mvnw`, som laddar ner rätt version själv.

### 1. Klona repot

```bash
git clone https://github.com/theBANDsoftware/Helpdesk_BANMD.git
cd Helpdesk_BANMD
```

### 2. Lägg in databasuppgifterna

```bash
cp backend/helpdesk/.env.example backend/helpdesk/.env
```

Öppna `backend/helpdesk/.env` och fyll i adress, användarnamn och lösenord. `DB_URL` är bara adress, port och databas, t.ex. `123.45.67.89:3306/helpdesk`, utan `jdbc:mariadb://`. Filen finns i `.gitignore` och följer aldrig med i en commit.

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

## Kommandon

| Var | Kommando | Vad det gör |
|---|---|---|
| `backend/helpdesk/` | `./mvnw spring-boot:run` | Startar backend på port 8080 |
| `backend/helpdesk/` | `./mvnw test` | Kör testerna. De behöver ingen databas. |
| `frontend/` | `npm run dev` | Startar frontend på port 5173 |
| `frontend/` | `npm run build` | Typkontrollerar och bygger frontend |
| `frontend/` | `npm run lint` | Letar efter vanliga fel i koden |
| `frontend/` | `npm run format` | Formaterar koden med Prettier. Kör innan du committar. |

## Projektstruktur

Backend är uppdelad efter **typ av klass**: alla controllers i en mapp, alla services i en annan, och så vidare. Frontend är uppdelad efter **funktion**, med en mapp per funktion under `features/`.

```
backend/helpdesk/src/main/java/com/thebanmd/helpdesk/
  HelpdeskApplication.java
  controllers/                ← tar emot anropen, t.ex. UserController
  services/                   ← logiken, t.ex. UserService
  repositories/               ← pratar med databasen (Spring Data JPA), t.ex. UserRepository
  entities/                   ← en klass per tabell, t.ex. User, och enums som Role
  dtos/                       ← det som skickas till och från frontend, t.ex. UserResponse
  exceptions/                 ← gemensam felhantering, t.ex. 503 när databasen inte svarar

frontend/src/
  App.tsx                     ← routern: en rad per sida
  features/
    tickets/
      NewTicketForm.tsx
      TicketDetail.tsx
      ticketsApi.ts
    users/                    ← en mapp per funktion
      UserList.tsx
      usersApi.ts
  shared/
    apiClient.ts              ← alla anrop till backend går härigenom

database/                     ← SQL-skripten för databasen, körs av David
```

Strukturen i backend är beslut 9 i beslutsloggen. En ny funktion, till exempel ärenden, får därför en fil i varje mapp: `TicketController`, `TicketService`, `TicketRepository`, `Ticket` och sina dto:er. Frontend är fortfarande sorterad efter funktion och får mappen `frontend/src/features/tickets/`.

Frontend anropar alltid `/api/...`. Under utveckling skickar Vite vidare de anropen till backend på port 8080, så backend behöver ingen CORS-inställning.

## Dokumentation

| Dokument | Innehåll |
|---|---|
| [Gruppkontrakt](docs/gruppkontrakt.md) | Hur vi samarbetar |
| [Definition of Done](docs/definition-of-done.md) | När en story räknas som klar |
| [MVP](docs/mvp.md) | Vad som ingår i första versionen |
| [Databasschema](docs/databasschema.md) | Tabeller och relationer |
| [Beslutslogg](docs/beslutslogg.md) | Viktiga beslut och varför |
| [Sprintar](docs/sprintar/) | Planning, standups, review och retro per sprint |
| [Individuella reflektioner](docs/reflektioner/) | En per person, lämnas in vecka 8 |

## Board

Arbetet organiseras i Jira: _[länk till Jira-boarden]_
