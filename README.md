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

Man loggar in med e-post och lösenord, och vad man ser beror på rollen. Inloggningen gäller i 8 timmar.

**Anställd**

- Anmäla ett fel med rubrik, beskrivning och kategori, och bifoga skärmdumpar. Medan man skriver rubriken visas liknande ärenden man redan har öppna.
- Se sina egna ärenden och följa status
- Ändra eller ta tillbaka ett ärende så länge det är nytt
- Kommentera sina ärenden och svara IT
- Öppna ett löst eller återkallat ärende igen om felet kommer tillbaka
- Få en notis när någon annan kommenterar, ändrar status eller tilldelar ens ärende. Antalet olästa syns i menyn, och man kan slå på notiser i webbläsaren.
- Läsa vanliga frågor

**IT-ansvarig**

- Se alla ärenden, med antalet som inte är tilldelade överst
- Söka på rubrik eller anmälare, filtrera på status, kategori, tilldelning och anmälare, och sortera på tid eller prioritet
- Se hur länge ett ärende har varit öppet. Öppna ärenden som är äldre än en vecka markeras.
- Se märket *Nytt svar* när anmälaren skrev den senaste kommentaren
- Ta ett otilldelat ärende direkt i listan, eller tilldela det till en annan IT-ansvarig
- Ändra status, prioritet och kategori. När ett ärende markeras som löst måste man skriva vad som gjordes.
- Se statistik över antal ärenden per kategori

## Demoguide

Hur man visar appen steg för steg, med vilka användare och i vilken ordning, står i [docs/demoguide.md](docs/demoguide.md).

## Teknik

| Del | Teknik |
|---|---|
| Frontend | React 19 med TypeScript, Vite, React Router, TanStack Query |
| Backend | Java 21, Spring Boot 4 (Web, Data JPA, Validation, Security med JWT), Swagger |
| Databas | MariaDB på Davids VPS |
| Bilder | Backblaze B2 (S3-kompatibel lagring) |

Varför vi valt den här stacken står i [beslutsloggen](docs/beslutslogg.md).

## Kom igång

### Det här behöver du

- **Java 21**: kontrollera med `java -version`
- **Node.js 22** eller senare: kontrollera med `node -v`
- **Databasuppgifter** till MariaDB på Davids VPS: adress, användarnamn och lösenord. Fråga David.
- **Lösenordet till testanvändarna**, för att logga in i appen. Det får du också av David.
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

Öppna `backend/helpdesk/.env` och fyll i:

- **Databasen**: `DB_URL`, `DB_USERNAME` och `DB_PASSWORD`. `DB_URL` är bara adress, port och databas, t.ex. `123.45.67.89:3306/helpdesk`, utan `jdbc:mariadb://`.
- **Bilderna**: `S3_ACCESS_KEY` och `S3_SECRET_KEY` från Mustafa. Endpoint, region och bucket står redan rätt (beslut 11).
- **Inloggningen**: `JWT_SECRET`, nyckeln som signerar inloggningen. Skapa en egen med `openssl rand -base64 32` och klistra in resultatet. Den måste vara minst 32 tecken. Mer om inloggningen finns i [docs/inloggning.md](docs/inloggning.md).

Filen finns i `.gitignore` och följer aldrig med i en commit. Startar du backend från IntelliJ kan du i stället lägga uppgifterna som miljövariabler i run-konfigurationen. De går före `.env`.

Databasen och tabellerna på VPS:en skapas av David med skripten i [`database/`](database/README.md). Det behöver du inte göra själv.

### 3. Starta backend (terminal 1)

```bash
cd backend/helpdesk
./mvnw spring-boot:run
```

På Windows: `mvnw.cmd spring-boot:run`. Första gången tar det en stund, eftersom Maven laddar ner alla beroenden. Backend är igång när det står `Started HelpdeskApplication`. API-dokumentationen finns på http://localhost:8080/swagger-ui.html. Där loggar du in med `POST /api/auth/login` och klistrar in token under **Authorize** (se [docs/inloggning.md](docs/inloggning.md)). Alla anrop utom inloggningen kräver token, så http://localhost:8080/api/tickets svarar 401 i webbläsaren. Det är rätt.

### 4. Starta frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Öppna http://localhost:5173. Sidan visar *Logga in*. Logga in med en av testanvändarna, t.ex. `maria.nordin@helpdesk.test` (IT-ansvarig) eller `anna.lind@helpdesk.test` (anställd), och lösenordet från David. Alla testanvändare finns i [docs/inloggning.md](docs/inloggning.md). Kommer du in når frontend backend, och backend når databasen.

### Om något inte fungerar

| Sidan visar | Det betyder |
|---|---|
| Kunde inte nå backend | Backend är inte startad, eller startade med fel. Titta i terminal 1. |
| Databasen svarar inte: ${DB_URL} | `backend/helpdesk/.env` saknas eller ligger i fel mapp. Gör steg 2 och starta om backend. |
| Databasen svarar inte: … (något annat) | Fel i `backend/helpdesk/.env`, VPS:en är nere, eller din IP-adress släpps inte in. Backend startar ändå, så du kan rätta `.env` och starta om. |
| Fel e-post eller lösenord. | Fel uppgifter, eller så har David inte satt lösenorden eller kört `database/V6__inloggning.sql` än. |
| Man loggas ut av sig själv | Inloggningen gäller i 8 timmar. Utan `JWT_SECRET` i `.env` loggas alla också ut när backend startas om. |
| Bilder går inte att ladda upp | B2-nycklarna saknas eller är fel i `.env`. Resten av appen fungerar ändå. |

## Kommandon

| Var | Kommando | Vad det gör |
|---|---|---|
| `backend/helpdesk/` | `./mvnw spring-boot:run` | Startar backend på port 8080 |
| `backend/helpdesk/` | `./mvnw test` | Kör testerna. De behöver ingen databas. Se [docs/tester.md](docs/tester.md). |
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
  config/                     ← inställningar som inte är controllers, services eller annat, t.ex. säkerhet och JWT för inloggningen
  controllers/                ← tar emot anropen: Auth, Ticket, Comment, Attachment, Notification, User
  services/                   ← logiken, t.ex. TicketService, AuthService och S3FileStorageService
  repositories/               ← pratar med databasen (Spring Data JPA)
  entities/                   ← en klass per tabell: Ticket, Comment, Attachment, Notification, User
  enums/                      ← Category, Status, TicketPriority, Role
  dtos/                       ← det som skickas till och från frontend
  mappers/                    ← gör om entiteter till dto:er
  exceptions/                 ← egna fel och gemensam felhantering, t.ex. 503 när databasen inte svarar

frontend/src/
  App.tsx                     ← routern: en rad per sida
  Types.ts                    ← gemensamma typer, t.ex. TicketSummary
  features/
    tickets/                  ← listan, detaljvyn, formuläret, sökningen, statistik och tickets-API:t
    comments/                 ← kommentarer på ett ärende
    attachments/              ← bifogade skärmdumpar
    notifications/            ← notiserna och antalet olästa i menyn
    users/                    ← inloggningen, menyn och vem som är inloggad
    start/                    ← startsidan
    faq/                      ← vanliga frågor
  shared/
    apiClient.ts              ← alla anrop till backend går härigenom, med token från inloggningen
    selectedUserStorage.ts    ← sparar inloggningen i webbläsaren
    DataTable.tsx             ← tabellen i detaljvyn och statistiken
    formatDate.ts             ← datum och "tid sedan"
    Icon.tsx                  ← ikoner från Material Symbols

database/                     ← SQL-skripten för databasen, körs av David
```

Strukturen i backend är beslut 9 i beslutsloggen, och mappen `config/` är tillagd i beslut 18. En ny funktion får därför en fil i varje mapp, till exempel `CommentController`, `CommentService`, `CommentRepository`, `Comment`, `CommentMapper` och sina dto:er. I frontend får den en egen mapp under `features/`.

Frontend anropar alltid `/api/...`. Under utveckling skickar Vite vidare de anropen till backend på port 8080, så backend behöver ingen CORS-inställning.

## Dokumentation

| Dokument | Innehåll |
|---|---|
| [Gruppkontrakt](docs/gruppkontrakt.md) | Hur vi samarbetar |
| [Definition of Done](docs/definition-of-done.md) | När en story räknas som klar |
| [MVP](docs/mvp.md) | Vad som ingår i första versionen |
| [User stories](docs/user-stories.md) | Alla stories med acceptanskriterier |
| [Demoguide](docs/demoguide.md) | Hur man visar appen, steg för steg |
| [Databasschema](docs/databasschema.md) | Tabeller och relationer |
| [Databasskript](database/README.md) | Vilka SQL-skript som finns och i vilken ordning de körs |
| [Inloggning](docs/inloggning.md) | Hur inloggningen med JWT fungerar, testanvändare och felsökning |
| [Tester](docs/tester.md) | Vilka tester som finns och hur man kör dem |
| [Beslutslogg](docs/beslutslogg.md) | Viktiga beslut och varför |
| [Sprintar](docs/sprintar/) | Planning, standups, review och retro per sprint |
| [Individuella reflektioner](docs/reflektioner/) | En per person, lämnas in vecka 8 |

## Board

Arbetet organiseras i Jira: [TB-boarden](https://davidceandersson.atlassian.net/jira/software/projects/TB/boards/101)
