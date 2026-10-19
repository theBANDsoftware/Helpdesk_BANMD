# Helpdesk

Ett enkelt ärendesystem där anställda på en liten organisation anmäler IT-fel och följer dem, och där de IT-ansvariga får överblick, fördelar ärendena och markerar dem som lösta.

## Teamet

| Namn | GitHub |
|---|---|
| | |
| | |
| | |
| | |

## Teknik

| Del | Teknik |
|---|---|
| Frontend | React 19 med TypeScript, Vite, React Router |
| Backend | Java 21, Spring Boot 4 (Web, Data JPA, Validation) |
| Databas | MySQL 8 på en gruppmedlems VPS |

Varför vi valt den här stacken står i [beslutsloggen](docs/beslutslogg.md).

## Kom igång

### Det här behöver du

- **Java 21**: kontrollera med `java -version`
- **Node.js 22** eller senare: kontrollera med `node -v`
- **Databasuppgifter** till MySQL på VPS:en: adress, användarnamn och lösenord. Fråga den som sköter databasen. Uppgifterna skickas aldrig i chatten eller läggs i repot.

Maven behöver du inte installera. Repot innehåller `mvnw`, som laddar ner rätt version själv.

### 1. Klona repot

```bash
git clone https://github.com/theBANDsoftware/Helpdesk_BANMD.git
cd Helpdesk_BANMD
```

### 2. Lägg in databasuppgifterna

```bash
cp backend/.env.example backend/.env
```

Öppna `backend/.env` och fyll i adress, användarnamn och lösenord. Filen finns i `.gitignore` och följer aldrig med i en commit.

### 3. Starta backend (terminal 1)

```bash
cd backend
./mvnw spring-boot:run
```

På Windows: `mvnw.cmd spring-boot:run`. Första gången tar det en stund, eftersom Maven laddar ner alla beroenden. Backend är igång när det står `Started HelpdeskApplication` och svarar på http://localhost:8080/api/health.

### 4. Starta frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Öppna http://localhost:5173. Om allt fungerar visar sidan två gröna rader: *Frontend når backend* och *Backend når databasen*. Sidan kontrollerar bara när den laddas, så ladda om den om du startade frontend innan backend var klar.

### Om något inte fungerar

| Sidan visar | Det betyder |
|---|---|
| Kunde inte nå backend | Backend är inte startad, eller startade med fel. Titta i terminal 1. |
| Backend svarar, men når inte databasen | Fel i `backend/.env`, VPS:en är nere, eller din IP-adress släpps inte in. Backend startar ändå, så du kan rätta `.env` och starta om. |
| *(ingen sida, backend startar inte)* | Står det `'url' must start with "jdbc"` i terminal 1 saknas `backend/.env`. Gör steg 2. |

## Kommandon

| Var | Kommando | Vad det gör |
|---|---|---|
| `backend/` | `./mvnw spring-boot:run` | Startar backend på port 8080 |
| `backend/` | `./mvnw test` | Kör testerna. De behöver ingen databas. |
| `frontend/` | `npm run dev` | Startar frontend på port 5173 |
| `frontend/` | `npm run build` | Typkontrollerar och bygger frontend |
| `frontend/` | `npm run lint` | Letar efter vanliga fel i koden |
| `frontend/` | `npm run format` | Formaterar koden med Prettier. Kör innan du committar. |

## Projektstruktur

Koden är uppdelad efter **funktion**, inte efter lager. Allt som hör till en funktion ligger i samma mapp, så att två personer som bygger olika stories sällan rör samma filer.

```
backend/src/main/java/se/theband/helpdesk/
  HelpdeskApplication.java
  health/                     ← en mapp per funktion
    HealthController.java     ← tar emot anropet
    HealthService.java        ← logiken
    HealthRepository.java     ← pratar med databasen
    HealthResponse.java

frontend/src/
  App.tsx                     ← routern: en rad per sida
  features/
    health/                   ← en mapp per funktion
      HealthStatus.tsx
      healthApi.ts
  shared/
    apiClient.ts              ← alla anrop till backend går härigenom
```

En ny funktion, till exempel ärenden, får mappen `backend/.../tickets/` och `frontend/src/features/tickets/`, uppbyggd på samma sätt som `health`.

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
