# Inloggning

Det här dokumentet förklarar inloggningen i Helpdesk (TB-33):

- hur man kommer igång,
- hur det fungerar från början till slut,
- vilka filer som gör vad,
- hur man bygger nya endpoints så att de skyddas,
- vad man gör när något inte fungerar.

## Kort sammanfattning

- Man loggar in med **e-post och lösenord**. Det ersätter listan där man valde vem man var.
- Backend svarar med en **JWT** (JSON Web Token). Frontend sparar den och skickar den med på alla anrop i headern `Authorization: Bearer <token>`.
- **Spring Security** kontrollerar token på varje anrop. Saknas den, är den fel eller har den gått ut svarar backend **401**, och frontend skickar tillbaka användaren till inloggningen.
- Headern `X-User-Id` från beslut 10 används inte längre. Backend läser vem som anropar ur token.
- Lösenorden sparas som **BCrypt-hashar** i `users.password_hash`, aldrig i klartext och aldrig i repot.
- En token gäller i **8 timmar**.

---

## 1. Komma igång

### 1.1 Lägg till `JWT_SECRET` i `.env`

Backend behöver en hemlig nyckel som signerar inloggningstoken. Lägg till en rad i `backend/helpdesk/.env`. Skapa en egen nyckel med:

```bash
openssl rand -base64 32
```

och klistra in resultatet:

```
JWT_SECRET=det-som-kommandot-skrev-ut
```

- Nyckeln måste vara **minst 32 tecken**, annars startar inte backend.
- Var och en har sin **egen** nyckel. Det fungerar, eftersom varje backend bara kontrollerar token som den själv har skapat.
- Nyckeln får aldrig committas. `.env` finns i `.gitignore`.

Saknas `JWT_SECRET` startar backend ändå, med en varning i terminalen:

```
JWT_SECRET saknas i .env. En tillfällig nyckel används, så alla loggas ut vid omstart.
```

Då skapas en slumpad nyckel vid varje start, och alla som var inloggade får logga in igen när backend startas om.

### 1.2 Logga in

Testanvändarna har de här e-postadresserna. **Lösenordet får du av David**, privat, på samma sätt som databaslösenorden. Det står aldrig i repot eller i gruppchatten.

| Namn | Roll | E-post |
|---|---|---|
| Anna Lind | Anställd | `anna.lind@helpdesk.test` |
| Omar Haddad | Anställd | `omar.haddad@helpdesk.test` |
| Sara Berg | Anställd | `sara.berg@helpdesk.test` |
| Johan Ek | Anställd | `johan.ek@helpdesk.test` |
| Maria Nordin | IT-ansvarig | `maria.nordin@helpdesk.test` |
| Erik Holm | IT-ansvarig | `erik.holm@helpdesk.test` |

Domänen `.test` är reserverad och kan aldrig vara en riktig e-postadress.

Öppna http://localhost:5173, skriv e-post och lösenord och tryck **Logga in**. IT-ansvariga hamnar på Ärenden och anställda på Mina ärenden. Stora bokstäver och mellanslag i e-posten spelar ingen roll.

### 1.3 Testa backend i Swagger

Swagger finns på http://localhost:8080/swagger-ui.html och går att öppna utan inloggning. Anropen kräver däremot token:

1. Öppna `POST /api/auth/login`, tryck **Try it out** och skicka:
   ```json
   { "email": "maria.nordin@helpdesk.test", "password": "lösenordet" }
   ```
2. Kopiera värdet i `token` ur svaret, utan citattecken.
3. Tryck **Authorize** överst på sidan, klistra in token och tryck **Authorize** igen.
4. Nu skickas token med på alla anrop i Swagger.

### 1.4 Testa backend i terminalen

```bash
# Logga in och spara token
TOKEN=$(curl -s -H 'Content-Type: application/json' \
  -d '{"email":"maria.nordin@helpdesk.test","password":"lösenordet"}' \
  http://localhost:8080/api/auth/login | sed 's/.*"token":"\([^"]*\)".*/\1/')

# Anropa med token
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/tickets
```

---

## 2. Hur det fungerar

### 2.1 Flödet

```
1. Inloggning
   Frontend ── POST /api/auth/login {email, password} ──▶ AuthController ──▶ AuthService
                                                          1. hittar användaren på e-post
                                                          2. jämför lösenordet med BCrypt-hashen
                                                          3. skapar en JWT med användarens id
   Frontend ◀──────────── 200 {token, user} ────────────
   Frontend sparar token och user i localStorage

2. Alla andra anrop
   Frontend ── GET /api/tickets + Authorization: Bearer <token> ──▶
      Spring Security (SecurityConfig): är token äkta och inte för gammal?
         nej ──▶ 401. Controllern körs aldrig. Frontend loggar ut och visar inloggningen.
         ja  ──▶ TicketController: @CurrentUserId Long userId läses ur token
                    ──▶ TicketService får userId och kontrollerar roller precis som förut
```

### 2.2 Vad är en JWT?

En JWT består av tre delar med punkter emellan: `huvud.innehåll.signatur`.

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1Iiwicm9sZSI6IklUX0FETUlOIiwiZXhwIjoxNzk1NjYwMDAwfQ.k3Fz...
└──────── huvud ───┘ └────────────────────── innehåll ──────────────────────────┘ └ signatur
```

- **Huvudet** säger hur token är signerad (HS256).
- **Innehållet** är vanlig JSON, bara kodad. Vem som helst kan läsa det, t.ex. genom att klistra in token på jwt.io. Hos oss:

  | Fält | Betyder | Exempel |
  |---|---|---|
  | `sub` (subject) | Användarens id. **Det enda backend läser.** | `"5"` |
  | `iat` (issued at) | När token skapades | tidsstämpel |
  | `exp` (expires) | När token slutar gälla, 8 timmar senare | tidsstämpel |
  | `iss` (issuer) | Vem som skapat den | `"helpdesk"` |
  | `name`, `role` | Namn och roll, bara för att token ska gå att förstå vid felsökning | `"Maria Nordin"`, `"IT_ADMIN"` |

- **Signaturen** räknas fram av huvudet och innehållet tillsammans med `JWT_SECRET`. Ändrar någon innehållet, t.ex. `sub` från `"1"` till `"5"`, stämmer signaturen inte längre, och backend svarar 401. Utan nyckeln går det inte att räkna fram en ny signatur.

En JWT är alltså **inte hemlig, men den går inte att förfalska**. Därför står inget hemligt i den.

Backend litar inte på `role` i token. Rollen hämtas alltid från databasen i servicen, så en ändrad roll gäller direkt och inte först när token går ut.

### 2.3 Vad är BCrypt?

Lösenordet sparas aldrig, bara en **hash** av det. En hash är en envägsfunktion: av `lösenordet` blir det t.ex. `$2y$10$E/ioa5...`, men det går inte att räkna baklänges.

- Vid inloggning hashas det inskrivna lösenordet på samma sätt, och resultatet jämförs med hashen i databasen (`passwordEncoder.matches(...)`).
- BCrypt lägger till slumpdata (salt), så samma lösenord ger olika hashar.
- BCrypt är medvetet långsam. Läcker databasen tar det mycket lång tid att gissa sig fram till lösenorden.
- Hashen skickas aldrig till frontend. `UserResponse` innehåller bara `id`, `name` och `role`.

### 2.4 Felkoder

| Kod | Betyder | När |
|---|---|---|
| **400** Bad Request | Anropet är felaktigt | E-post eller lösenord är tomt vid inloggning (`@NotBlank`) |
| **401** Unauthorized | Vi vet inte vem du är | Fel e-post eller lösenord, ingen token, felaktig token eller utgången token |
| **403** Forbidden | Vi vet vem du är, men du får inte göra det här | En anställd försöker t.ex. se statistik eller ändra status |

Vid fel inloggning är meddelandet alltid detsamma, **"Fel e-post eller lösenord."**, oavsett om e-posten saknas eller lösenordet är fel. Annars skulle man kunna prova sig fram till vilka e-postadresser som finns.

---

## 3. Backend fil för fil

Alla sökvägar under `backend/helpdesk/src/main/java/com/thebanmd/helpdesk/`.

| Fil | Vad den gör |
|---|---|
| `config/SecurityConfig.java` | Hjärtat. Bestämmer vilka anrop som kräver token, kopplar in JWT-kontrollen och skapar BCrypt, nyckeln och de två objekten som skapar och kontrollerar token. |
| `config/CurrentUserId.java` | Annotationen `@CurrentUserId`, som sätts på en parameter i en controller. |
| `config/CurrentUserIdResolver.java` | Fyller i parametrar med `@CurrentUserId`: hämtar token som Spring Security redan har godkänt och ger tillbaka `sub` som `Long`. |
| `config/WebConfig.java` | Registrerar resolvern hos Spring MVC, så att annotationen fungerar i alla controllers. |
| `config/OpenApiConfig.java` | Ger Swagger knappen **Authorize** och döljer `@CurrentUserId` från parametrarna i Swagger. |
| `controllers/AuthController.java` | `POST /api/auth/login`. Den enda endpoint som går att anropa utan token. |
| `services/AuthService.java` | Kontrollerar e-post och lösenord och skapar token. |
| `dtos/LoginRequest.java` | Det frontend skickar: `email` och `password`, båda `@NotBlank`. |
| `dtos/LoginResponse.java` | Det backend svarar: `token` och `user` (`UserResponse`). |
| `exceptions/InvalidCredentialsException.java` | Kastas vid fel inloggning. Blir 401 i `ApiExceptionHandler`. |
| `entities/User.java` | Två nya fält: `email` och `passwordHash`, med getters men inga setters. |
| `repositories/UserRepository.java` | Ny metod `findByEmail`. |

Övriga ändringar:
- **`TicketController`, `CommentController`, `AttachmentController` och `NotificationController`:** `@RequestHeader("X-User-Id") Long userId` är utbytt mot `@CurrentUserId Long userId` på 16 ställen. Services och repositories är oförändrade. De får fortfarande ett `userId`, så alla behörighetsregler fungerar som förut.
- **`ApiExceptionHandler`:** hanteraren för saknad `X-User-Id` är borttagen, och en hanterare för `InvalidCredentialsException` (401) är tillagd.
- **`application.properties`:** `security.jwt.secret` (från `JWT_SECRET`) och `security.jwt.expires-in=8h`.
- **`.env.example`:** raden `JWT_SECRET`.
- **`pom.xml`:** `spring-boot-starter-security-oauth2-resource-server`, som innehåller Spring Security, JWT-stödet och BCrypt. Dessutom `spring-boot-starter-security-test` för testerna.

### 3.1 Vilka anrop är öppna?

I `SecurityConfig` står de anrop som går att göra utan token. Allt annat kräver token.

| Anrop | Varför det är öppet |
|---|---|
| `POST /api/auth/login` | Man har ingen token innan man har loggat in |
| `GET /api/tickets/{id}/attachments/{id}` | Bilder visas med `<img src="...">`, och en bild kan inte skicka med någon token |
| `/swagger-ui.html`, `/swagger-ui/**`, `/v3/api-docs/**` | API-dokumentationen. Anropen från Swagger kräver ändå token. |

### 3.2 Andra inställningar i `SecurityConfig`

- **`csrf` är avstängt.** CSRF-attacker utnyttjar att webbläsaren skickar cookies automatiskt. Vår token ligger i en header som frontend lägger dit själv, så attacken fungerar inte.
- **`STATELESS`.** Backend sparar ingen inloggning i minnet. Varje anrop bär sin egen token.

---

## 4. Frontend fil för fil

Alla sökvägar under `frontend/src/`.

| Fil | Vad den gör |
|---|---|
| `features/users/LoginForm.tsx` | Inloggningssidan på `/`. E-post, lösenord, knappen **Logga in** (avstängd tills båda fälten är ifyllda) och felmeddelanden. Ersätter `UserList.tsx`, som är borttagen. |
| `features/users/usersApi.ts` | `login(email, password)` anropar `POST /api/auth/login`. |
| `shared/selectedUserStorage.ts` | Sparar användaren och token i localStorage: `readToken`, `saveLogin(user, token)` och `clearLogin()`. |
| `shared/apiClient.ts` | Lägger till `Authorization: Bearer <token>` på alla anrop. Svarar backend 401 töms inloggningen och sidan går till `/`, utom vid själva inloggningen, där 401 betyder fel lösenord. |
| `features/users/SelectedUserProvider.tsx` och `selectedUserContext.ts` | `logIn(user, token)` och `logOut()`. Vid start räknas man bara som inloggad om det finns en token sparad. |
| `features/users/CurrentUser.tsx` | Namn, roll och **Logga ut** i sidhuvudet. Utloggningen tömmer också allt TanStack Query har hämtat (`queryClient.clear()`), så att nästa person inte ser den förras ärenden. |
| `features/tickets/ticketsApi.ts` | Fyra funktioner skickade `X-User-Id` själva. Headern och parametern `currentUserId` är borttagna. |

Kroken `useSelectedUser()` heter som förut, så att andra filer inte behövde ändras. Den ger nu den **inloggade** användaren.

---

## 5. Bygga en ny endpoint

**Behöver endpointen veta vem som anropar?** Lägg till en parameter med `@CurrentUserId`:

```java
@PostMapping("/{id}/something")
public SomethingResponse doSomething(@PathVariable Long id, @CurrentUserId Long userId) {
    return somethingService.doSomething(id, userId);
}
```

Gör sedan behörighetskontrollen i servicen, som i `TicketService` (t.ex. `requireItAdmin`).

**Använd aldrig `@RequestHeader("X-User-Id")`.** Headern finns inte längre, och anropet skulle få 400.

**Ska endpointen gå att nå utan inloggning?** Det ska vara ovanligt. Lägg i så fall till den bland `permitAll` i `SecurityConfig` och skriv varför i en kommentar.

**I frontend** behöver du inte göra något. `apiRequest` skickar med token automatiskt.

---

## 6. Tester

13 tester. Alla körs med `./mvnw test` och behöver ingen databas.

**`services/AuthServiceTest`** (5) testar inloggningen. `UserRepository` är en mock, men BCrypt och JWT är de riktiga.

| Test | Kontrollerar |
|---|---|
| `loginGerTokenMedAnvandarensId` | Rätt lösenord ger en token med `sub` 5, rollen IT_ADMIN och 8 timmars giltighet |
| `loginGodtarStoraBokstaverOchMellanslagIEposten` | `"  Maria.Nordin@Helpdesk.test "` fungerar |
| `loginKastarInvalidCredentialsVidFelLosenord` | Fel lösenord ger "Fel e-post eller lösenord." |
| `loginKastarSammaFelForEpostSomInteFinns` | Okänd e-post ger exakt samma meddelande |
| `loginKastarInvalidCredentialsOmAnvandarenSaknarLosenord` | En användare utan hash kan inte logga in |

**`config/SecurityConfigTest`** (8) startar bara webblagret (`@WebMvcTest`) med `TicketController` och `AuthController`. Servicarna är mockar, så testerna handlar bara om token.

| Test | Kontrollerar |
|---|---|
| `anropUtanTokenSvarar401` | Ingen token ger 401, och servicen anropas aldrig |
| `anropMedTokenGerControllernAnvandarensId` | En token med `sub` 5 gör att servicen får `userId` 5 |
| `felaktigTokenSvarar401` | En trasig token ger 401 |
| `utgangenTokenSvarar401` | En token som har gått ut ger 401 |
| `headernXUserIdGerIngenAtkomstLangre` | Det gamla sättet fungerar inte längre |
| `inloggningKraverIngenToken` | Inloggningen går att anropa utan token |
| `felLosenordSvarar401MedMeddelande` | Fel lösenord ger 401 med JSON-meddelandet |
| `tomtLosenordSvarar400` | Tomt lösenord ger 400 "Lösenord krävs" |

---

## 7. Kända begränsningar

Det här är medvetna förenklingar. Bra att kunna förklara vid redovisningen.

| Begränsning | Förklaring |
|---|---|
| **Token sparas i localStorage** | Enkelt, och fungerar efter omladdning. Men om någon lyckas köra JavaScript på sidan (XSS) kan den läsa token. Alternativet är en httpOnly-cookie, men då behövs CSRF-skydd. |
| **Utloggning gäller bara webbläsaren** | Logga ut tar bort token i webbläsaren. En kopierad token gäller ändå tills den går ut efter 8 timmar, eftersom backend inte sparar någon lista över utloggade token. Det är priset för att backend är `STATELESS`. |
| **Bilder är öppna** | Den som har exakt adress till en bild kan se den utan att logga in (se 3.1). Så var det redan innan inloggningen. |
| **Ingen registrering eller byte av lösenord** | Användare och lösenord läggs in i databasen av David (se `database/README.md`). |
| **Var och en har sin egen nyckel** | En token från din backend fungerar inte mot någon annans. Det spelar ingen roll så länge alla kör sin egen backend. |

---

## 8. Om något inte fungerar

| Det händer | Det betyder |
|---|---|
| "Fel e-post eller lösenord." fast uppgifterna är rätt | Lösenordet är inte satt i databasen än, eller så är `V6__inloggning.sql` inte körd. Fråga David. |
| "Fyll i både e-post och lösenord." | Ett av fälten är tomt. |
| Man loggas ut av sig själv | Token har gått ut (8 timmar), eller backend har startats om utan `JWT_SECRET` i `.env`. |
| Backend startar inte: "JWT_SECRET måste vara minst 32 tecken lång." | Nyckeln i `.env` är för kort. Skapa en ny med `openssl rand -base64 32`. |
| Alla anrop i Swagger ger 401 | Du har inte tryckt **Authorize**, eller token har gått ut. Logga in igen (avsnitt 1.3). |
| En ny endpoint ger 400 med ett fel om att headern `X-User-Id` saknas | Endpointen använder fortfarande `@RequestHeader("X-User-Id")`. Byt till `@CurrentUserId` (avsnitt 5). |
| Databasfel om kolumnen `email` | `V6__inloggning.sql` är inte körd i databasen. |
