# Tester i backend

Det här dokumentet förklarar backendens automatiska tester:

- hur man kör dem,
- hur de fungerar,
- vad varje test kontrollerar,
- hur man skriver ett nytt test,
- vad man gör när ett test går rött.

Det riktar sig till alla i gruppen, även den som inte har skrivit ett test förut.

## Kort sammanfattning

- Det finns **62 tester** i åtta testklasser, i `backend/helpdesk/src/test/java/com/thebanmd/helpdesk/`.
- De kör på några sekunder och behöver **ingen databas, ingen `.env`-fil och ingen internetuppkoppling**.
- De testar **servicelagret**, där reglerna för vem som får göra vad finns, och att **inloggningen** släpper igenom och stoppar rätt anrop.
- De körs med `./mvnw test` i mappen `backend/helpdesk`.

Testerna ersätter inte de manuella testerna i Definition of Done. Acceptanskriterierna ska fortfarande testas för hand av både den som byggt storyn och granskaren. Testerna är ett skyddsnät: de säger till direkt om någon av misstag råkar ta sönder en regel som redan fungerade.

---

## 1. Köra testerna

### I terminalen

Gå till backendmappen och kör alla tester:

```bash
cd backend/helpdesk
./mvnw test
```

På Windows (Kommandotolken eller PowerShell) heter kommandot `mvnw.cmd test`.

Första gången laddar Maven ner det som behövs. Det kan ta en stund. Därefter går det på några sekunder.

**Köra en testklass:**

```bash
./mvnw test -Dtest=TicketServiceTest
```

**Köra ett enda test:** skriv klassen, `#` och metodnamnet.

```bash
./mvnw test -Dtest=TicketServiceTest#assignTicketKastarForbiddenOmAnstalldTilldelas
```

**Köra alla tester vars namn börjar likadant:** `*` betyder "vad som helst".

```bash
./mvnw test -Dtest="TicketServiceTest#assignTicket*"
```

### I IntelliJ

1. Öppna testfilen, t.ex. `TicketServiceTest.java`.
2. Klicka på den gröna pilen i marginalen:
   - Pilen bredvid **klassnamnet** kör alla tester i klassen.
   - Pilen bredvid en **testmetod** kör bara det testet.
3. Resultatet visas i fönstret **Run** längst ner. Gröna bockar är godkända tester, röda kryss är tester som misslyckats.

Alla tester på en gång: högerklicka på mappen `src/test/java` och välj **Run 'All Tests'**.

### I VS Code

VS Code behöver tillägget **Extension Pack for Java**.

1. Öppna testfilen. Ovanför varje test och klass står **Run Test | Debug Test**. Klicka på **Run Test**.
2. Alla tester: klicka på kolven (**Testing**) i vänsterkanten och tryck på dubbelpilen överst.

### Läsa resultatet

Går allt igenom avslutar Maven med:

```
[INFO] Tests run: 62, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

| Ord | Betyder |
|---|---|
| `Tests run` | Hur många tester som kördes |
| `Failures` | Tester där en kontroll inte stämde, t.ex. ett annat värde än väntat |
| `Errors` | Tester som kraschade med ett oväntat fel innan kontrollerna hann köras |
| `Skipped` | Tester som hoppades över (vi har inga sådana) |
| `BUILD SUCCESS` / `BUILD FAILURE` | Om allt gick igenom eller inte |

En rapport per testklass sparas i `backend/helpdesk/target/surefire-reports/`. Mappen `target/` finns inte i Git, och det är meningen.

---

## 2. Vad testas, och vad testas inte

Backenden är uppbyggd som controller → service → repository (se `README.md`). Testerna ligger på **servicelagret**, eftersom det är där reglerna finns:

| Lager | Testas automatiskt? | Varför |
|---|---|---|
| **Service** (t.ex. `TicketService`) | **Ja** | Här finns alla regler: vem som får göra vad, vilka statusar som är tillåtna, att en lösning krävs osv. |
| Controller | Delvis | `SecurityConfigTest` kontrollerar att anrop utan giltig token stoppas, och att rätt användar-id når controllern. Annars tar controllern bara emot anropet och skickar vidare till servicen. |
| `ApiExceptionHandler` | Delvis | 401 och 400 vid inloggning testas i `SecurityConfigTest`. Övriga statuskoder (t.ex. 403, 404, 409) testas för hand i webbläsaren eller Swagger. |
| Repository och SQL | Nej | Det skulle kräva en riktig databas. Frågorna testas när appen körs mot develop-databasen. |
| Frontend | Nej | Testas för hand enligt Definition of Done. |

Testerna kontrollerar alltså att **reglerna** stämmer, inte hur appen ser ut eller att databasen svarar.

---

## 3. Hur testerna fungerar

### Verktygen

Allt följer med i `spring-boot-starter-test`, så inget behöver installeras.

| Verktyg | Vad det gör | Det du ser i koden |
|---|---|---|
| **JUnit 5** | Hittar och kör testerna | `@Test` före varje testmetod, `@BeforeEach` för det som ska göras före varje test |
| **Mockito** | Skapar "låtsasobjekt" (mockar) i stället för riktiga repositoryn | `mock(...)`, `when(...).thenReturn(...)`, `verify(...)`, `never()` |
| **AssertJ** | Kontrollerar resultatet | `assertThat(...)`, `assertThatThrownBy(...)`, `.isEqualTo(...)`, `.hasMessage(...)` |
| **MapStruct** | Den riktiga mappern används, inte en mock | `Mappers.getMapper(TicketMapper.class)` |
| **ReflectionTestUtils** (Spring) | Sätter id på en användare, eftersom `User` inte har någon `setId` | `ReflectionTestUtils.setField(user, "id", 5L)` |
| **MockMvc** (Spring) | Skickar låtsade HTTP-anrop genom Spring Security och en controller, utan att starta en server | `@WebMvcTest`, `mockMvc.perform(get("/api/tickets"))`, `status().isUnauthorized()` |

### Varför ingen databas behövs: mockar

`TicketService` behöver `TicketRepository`, `UserRepository` och `CommentRepository` för att hämta och spara data. I testerna ersätts de av **mockar**. En mock är ett objekt som ser ut som ett repository men inte gör någonting förrän vi säger vad det ska svara.

```java
private final UserRepository userRepository = mock(UserRepository.class);
```

Mockarna ger tre möjligheter:

**1. Bestämma vad en mock ska svara.** Det här betyder: "när någon frågar efter användare 5, svara med Maria".

```java
when(userRepository.findById(5L)).thenReturn(Optional.of(maria));
```

Frågar koden efter något vi inte har bestämt får den ett tomt svar, t.ex. `null` eller `Optional.empty()`.

**2. Kontrollera att något anropades, eller inte anropades.** Det här betyder: "kontrollera att `save` aldrig anropades".

```java
verify(ticketRepository, never()).save(any());
```

Det använder vi för att visa att **ingenting sparades** när en regel slog till. `any()` betyder "med vilket argument som helst".

**3. Fånga det som sparades.** En `ArgumentCaptor` fångar objektet som skickades till `save`, så att vi kan titta på det:

```java
ArgumentCaptor<Comment> saved = ArgumentCaptor.forClass(Comment.class);
verify(commentRepository).save(saved.capture());
assertThat(saved.getValue().getBody()).isEqualTo("Lösning: Bytte tonerkassett");
```

Servicen skapas sedan precis som Spring hade gjort, fast med mockarna:

```java
private final TicketService service = new TicketService(
        ticketRepository, Mappers.getMapper(TicketMapper.class), userRepository, commentRepository);
```

Det fungerar eftersom `TicketService` får sina beroenden via konstruktorn (`@RequiredArgsConstructor` från Lombok).

### Ett test har tre delar

Varje test följer samma mönster, som brukar kallas **Arrange, Act, Assert**:

1. **Förbered** (Arrange): ställ upp läget, alltså vilka användare och ärenden som finns.
2. **Gör** (Act): anropa metoden som testas.
3. **Kontrollera** (Assert): stämmer resultatet?

Exempel från `TicketServiceTest`, med kommentarer som inte finns i koden:

```java
@Test
void updatePriorityKastarForbiddenOmAnstalldForsokerAndra() {
    // 1. Förbered: Annas ärende med prioritet Mellan, Anna är anställd
    Ticket ticket = ettNyttArende();

    // 2 och 3. Gör och kontrollera: Anna (id 1) försöker sätta Hög,
    //          och då ska det bli ForbiddenActionException med exakt det här meddelandet
    assertThatThrownBy(() -> service.updatePriority(1L, new UpdatePriorityRequest(TicketPriority.HIGH), 1L))
            .isInstanceOf(ForbiddenActionException.class)
            .hasMessage("Bara IT-ansvariga kan ändra prioritet på ärenden");

    // 3. Kontrollera också att ingenting ändrades eller sparades
    assertThat(ticket.getPriority()).isEqualTo(TicketPriority.MEDIUM);
    verify(ticketRepository, never()).save(any());
}
```

När ett fel ska kastas skrivs steg 2 och 3 ihop med `assertThatThrownBy(() -> ...)`. Pilen `() ->` gör att anropet körs inuti kontrollen, så att testet kan fånga felet i stället för att krascha.

### Varför testerna kontrollerar så mycket

- **Exakt felmeddelande** (`hasMessage`): det finns flera skäl till att samma metod kan ge `ForbiddenActionException`. `assignTicket` nekar både när en anställd försöker tilldela och när någon försöker tilldela till en anställd. Meddelandet visar att det var rätt regel som slog till. Det är också meddelandet som syns i appen.
- **Att ingenting sparades** (`verify(..., never()).save(...)`): ett fel som kastas *efter* att något sparats vore en bugg. Testet visar att kontrollen sker först.
- **Att ärendet är oförändrat** (`assertThat(ticket.getStatus()).isEqualTo(...)`): samma skäl, fast på själva objektet.
- **Både ärendet och svaret** i tester som lyckas: `ticket.getPriority()` visar att ärendet ändrades, och `response.priority()` visar att frontend får rätt värde tillbaka.

### Testpersonerna

Testerna använder samma personer, med samma id, som testdatan i `database/V2__testdata.sql`. Då känns de igen från appen:

| Id | Namn | Roll | Används som |
|---|---|---|---|
| 1 | Anna Lind | Anställd (`EMPLOYEE`) | Anmälare i de flesta testerna |
| 2 | Omar Haddad | Anställd | "Någon annan" som inte får röra Annas ärende |
| 5 | Maria Nordin | IT-ansvarig (`IT_ADMIN`) | Den som tilldelar, ändrar status, prioritet m.m. |
| 6 | Erik Holm | IT-ansvarig | Den som blir tilldelad |

### Hjälpmetoder

För att slippa upprepa samma förberedelse i varje test finns några hjälpmetoder:

| Hjälpmetod | Klass | Vad den ställer upp |
|---|---|---|
| `annasNyaArende()` | `TicketServiceTest` | Annas ärende med id 10 och status Ny. Anna (1) och Omar (2) finns, och `save` returnerar ärendet. |
| `ettNyttArende()` | `TicketServiceTest` | Annas ärende med id 1 och status Ny. Anna (1), Maria (5) och Erik (6) finns, och `save` returnerar ärendet. |
| `userWithId(id, namn, roll)` / `user(...)` | Flera | En användare med ett bestämt id |
| `setUp()` med `@BeforeEach` | `CommentServiceTest`, `AttachmentServiceTest` | Körs automatiskt före varje test i klassen och ställer upp samma personer och ärende |
| `file(namn, innehåll)` | `AttachmentServiceTest` | En uppladdad fil, som den som kommer från frontend |
| `FakeStorage` | `AttachmentServiceTest` | En fillagring i minnet i stället för Backblaze B2 |

### Namn på testerna

Testmetoderna heter som en mening på svenska, så att det syns i resultatet vad som gick fel:

```
<metoden som testas><vad som ska hända><när>
updatePriority  KastarForbidden  OmAnstalldForsokerAndra
```

Å, ä och ö skrivs som a och o i metodnamn, eftersom det är så resten av koden gör.

---

## 4. Alla tester, klass för klass

### `HelpdeskApplicationTests` (1 test)

| Test | Kontrollerar |
|---|---|
| `contextLoads` | Att hela Spring-appen kan starta: alla controllers, services, repositoryn och mappers hittas och kan kopplas ihop, och `application.properties` går att läsa. |

Testet har ingen kod i sig. Det går igenom om appen startar, och går sönder om t.ex. en klass saknar `@Service` eller en konstruktor kräver något som inte finns. Det behöver ingen databas, eftersom backend är inställd på att starta även när databasen inte svarar (`hibernate.boot.allow_jdbc_metadata_access=false` i `application.properties`).

### `UserServiceTest` (1 test)

| Test | Kontrollerar |
|---|---|
| `listUsersGerNamnOchRollFranRepositoryt` | Att listan med användare på startsidan får namn och roll från databasen, i den ordning repositoryt ger dem. |

### `CommentServiceTest` (3 tester): vem som får kommentera

Storyerna om att kommentera och svara på kommentarer. Ärendet är Omars (id 2).

| Test | Kontrollerar |
|---|---|
| `itAnsvarigFarKommenteraArendet` | Maria (IT) får kommentera, och kommentaren får hennes namn och rätt text. |
| `anmalarenFarSvaraISittEgetArende` | Omar får svara i sitt eget ärende. |
| `annanAnstalldFarInteKommentera` | Anna får inte kommentera Omars ärende. Hon får "Du kan bara kommentera dina egna ärenden." och ingenting sparas. |

### `AttachmentServiceTest` (10 tester): bifogade skärmdumpar

Storyn om att bifoga en skärmdump. B2 ersätts av `FakeStorage`, en lagring i minnet, så att testerna kan se vilka filer som "laddats upp" utan internet. Ärendet är Annas (id 10).

| Test | Kontrollerar |
|---|---|
| `anmalarenKanBifogaPng` | Anna kan bifoga en PNG. Filnamn, filtyp och uppladdare blir rätt, och filen sparas under `tickets/10/` med ändelsen `.png`. |
| `itAnsvarigKanBifogaTillAndrasArende` | Maria (IT) kan bifoga till Annas ärende. |
| `annanAnstalldFarInteBifoga` | Omar får inte bifoga till Annas ärende. Ingen fil sparas, varken i lagringen eller i databasen. |
| `filSomInteArBildNekasAvenOmDenHeterPng` | En textfil som döpts till `virus.png` nekas. Servicen tittar på filens innehåll, inte bara på namnet. |
| `forStorFilNekas` | En fil som är 1 byte för stor nekas med "Filen är för stor. Max 5 MB." |
| `hogstTreBilderPerArende` | En fjärde bild nekas när ärendet redan har tre. |
| `filenTasBortFranLagringenOmDatabasenMisslyckas` | Går det inte att spara i databasen tas filen bort från lagringen igen, så att inga filer blir liggande utan ärende. |
| `downloadHamtarBildenFranLagringen` | En bild som finns kan hämtas med rätt innehåll och filtyp. |
| `downloadViaFelArendeGerNotFound` | En bild går inte att hämta via ett annat ärendes adress. |
| `cleanFilenameTarBortSokvagar` | Sökvägar i filnamn tas bort (`C:\Users\anna\fel.png` blir `fel.png`, `../../etc/passwd` blir `passwd`), och ett filnamn som saknas blir `bild`. |

### `NotificationServiceTest` (3 tester): notiser

Notiserna i appen. Ärendet är Omars (id 2).

| Test | Kontrollerar |
|---|---|
| `anmalarenFarNotisNarNagonAnnanKommenterar` | När Maria kommenterar Omars ärende får Omar en notis med texten "Maria Nordin kommenterade ditt ärende ...". |
| `ingenNotisNarAnmalarenSjalvGorAndringen` | Gör Omar ändringen själv får han ingen notis. |
| `manKanInteMarkeraNagonAnnansNotisSomLast` | Man kan bara markera sina egna notiser som lästa. |

### `AuthServiceTest` (5 tester): inloggningen

Inloggning med e-post och lösenord. `UserRepository` är en mock, men BCrypt och JWT är de riktiga, så testerna visar att lösenordet verkligen kontrolleras och att token verkligen går att läsa. Mer om inloggningen i [inloggning.md](inloggning.md).

| Test | Kontrollerar |
|---|---|
| `loginGerTokenMedAnvandarensId` | Rätt lösenord ger en token med Marias id (5) som `sub`, rollen IT_ADMIN och 8 timmars giltighet. Svaret innehåller hennes namn och roll. |
| `loginGodtarStoraBokstaverOchMellanslagIEposten` | `"  Maria.Nordin@Helpdesk.test "` fungerar lika bra som `maria.nordin@helpdesk.test`. |
| `loginKastarInvalidCredentialsVidFelLosenord` | Fel lösenord ger `InvalidCredentialsException` med "Fel e-post eller lösenord." |
| `loginKastarSammaFelForEpostSomInteFinns` | En e-post som inte finns ger exakt samma meddelande, så att ingen kan prova sig fram till vilka adresser som finns. |
| `loginKastarInvalidCredentialsOmAnvandarenSaknarLosenord` | En användare som saknar lösenord i databasen kan inte logga in. |

### `SecurityConfigTest` (8 tester): vilka anrop som kräver inloggning

Ligger i `config/`, inte i `services/`. Testet startar bara webblagret (`@WebMvcTest`) med `TicketController` och `AuthController` och skickar låtsade HTTP-anrop med MockMvc. Servicarna är mockar, så testerna handlar bara om token och inte om reglerna i servicarna. Token i testerna signeras med samma nyckel som `SecurityConfig` använder.

| Test | Kontrollerar |
|---|---|
| `anropUtanTokenSvarar401` | Ett anrop utan token får 401, och servicen anropas aldrig. |
| `anropMedTokenGerControllernAnvandarensId` | En giltig token med id 5 gör att servicen anropas med `userId` 5. Det visar att `@CurrentUserId` läser rätt id ur token. |
| `felaktigTokenSvarar401` | En trasig token får 401. |
| `utgangenTokenSvarar401` | En token som har gått ut får 401. |
| `headernXUserIdGerIngenAtkomstLangre` | Den gamla headern `X-User-Id` ger ingen åtkomst längre. |
| `inloggningKraverIngenToken` | Inloggningen går att anropa utan token och svarar med token och användare. |
| `felLosenordSvarar401MedMeddelande` | Fel lösenord ger 401 med `{"error": "Fel e-post eller lösenord."}`. |
| `tomtLosenordSvarar400` | Tomt lösenord ger 400 med `{"password": "Lösenord krävs"}`. |

### `TicketServiceTest` (31 tester): ärenden

Den största testklassen. Testerna är grupperade efter story, med en kommentar (`// ---- ... ----`) före varje grupp.

**Skapa ett ärende (2)**

| Test | Kontrollerar |
|---|---|
| `createSpararArendetMedValdAnvandareSomAnmalare` | Ett nytt ärende får status Ny och den valda användaren som anmälare. |
| `createKastarUserNotFoundOmAnvandarenInteFinns` | En användare som inte finns ger `UserNotFoundException`, och inget ärende sparas. |

**Ändra status (4)**

| Test | Kontrollerar |
|---|---|
| `updateStatusAndrarStatusNarItAnsvarigAndrar` | Maria (IT) kan ändra från Ny till Pågående. |
| `updateStatusKanOppnaEttLostArendeIgen` | IT kan flytta ett löst ärende tillbaka till Pågående. |
| `updateStatusKastarForbiddenOmAnstalldForsokerAndra` | En anställd får "Bara IT-ansvariga kan ändra status på ärenden", och inget sparas. |
| `updateStatusKastarTicketNotFoundOmArendetInteFinns` | Ett ärende som inte finns ger `TicketNotFoundException`. |

**Anmälaren ändrar eller tar tillbaka sitt ärende (6)**

Alla använder `annasNyaArende()`.

| Test | Kontrollerar |
|---|---|
| `updateTicketAndrarRubrikBeskrivningOchKategoriForAnmalaren` | Anna kan ändra rubrik, beskrivning och kategori, och mellanslag i början och slutet tas bort. |
| `updateTicketNekasForAnnanAnvandare` | Omar får inte ändra Annas ärende. Rubriken är oförändrad och inget sparas. |
| `updateTicketNekasOmItHarHunnitAndraStatus` | Har IT hunnit sätta Pågående får Anna `TicketNotEditableException` (409) och inget ändras. |
| `withdrawTicketSatterStatusAterkallad` | Anna kan ta tillbaka sitt nya ärende, som får status Återkallad. |
| `withdrawTicketNekasNarArendetArLost` | Ett löst ärende kan inte tas tillbaka. |
| `withdrawTicketNekasForAnnanAnvandare` | Omar kan inte ta tillbaka Annas ärende. |

**Återkallad är bara för anmälaren (1)**

| Test | Kontrollerar |
|---|---|
| `updateStatusKanInteSattaAterkallad` | Inte ens IT kan sätta status Återkallad via statusbytet. Det får bara anmälaren göra. |

**IT ändrar kategori (2)**

| Test | Kontrollerar |
|---|---|
| `updateCategoryAndrarKategoriNarItAnsvarigAndrar` | Maria kan ändra kategori, även på ett löst ärende. |
| `updateCategoryKastarForbiddenOmAnstalldForsokerAndra` | En anställd får "Bara IT-ansvariga kan ändra kategori", och inget sparas. |

**Lösning när ärendet markeras som löst (3)**

| Test | Kontrollerar |
|---|---|
| `updateStatusTillLostSpararLosningenSomKommentar` | Lösningen sparas som en kommentar med "Lösning: " först, mellanslag runt texten tas bort, och Maria står som författare. |
| `updateStatusTillLostUtanLosningKastarResolutionRequired` | Löst med bara mellanslag som lösning ger "Skriv vad som gjordes för att lösa ärendet.", och varken ärendet eller någon kommentar sparas. |
| `updateStatusTillPagaendeBehoverIngenLosning` | Pågående kräver ingen lösning, och ingen kommentar sparas. |

**Anmälaren öppnar ärendet igen (6)**

| Test | Kontrollerar |
|---|---|
| `reopenTicketGorLostArendePagaende` | Ett löst ärende som öppnas igen får status Pågående. |
| `reopenTicketGorAterkalltArendeNytt` | Ett återkallat ärende som öppnas igen får status Ny. |
| `reopenTicketBehallerTilldelningOchHistorik` | Tilldelningen finns kvar och inga kommentarer läggs till eller tas bort. |
| `reopenTicketNekasForAnnanAnvandare` | Omar kan inte öppna Annas ärende igen. |
| `reopenTicketNekasNarArendetArNytt` | Ett nytt ärende kan inte "öppnas igen" och ger "Bara ett löst eller återkallat ärende kan öppnas igen." |
| `reopenTicketNekasNarArendetArPagaende` | Samma sak för ett pågående ärende. |

**Behörighetsreglerna: tilldela, prioritet och statistik (7)**

Alla utom statistiktesterna använder `ettNyttArende()`.

| Test | Kontrollerar |
|---|---|
| `assignTicketTilldelarNarItAnsvarigTilldelar` | Maria kan tilldela ärendet till Erik, och svaret visar "Erik Holm". |
| `assignTicketKastarForbiddenOmAnstalldForsokerTilldela` | Anna får "Bara IT-ansvariga kan tilldela ärenden". Ärendet är fortfarande inte tilldelat och inget sparas. |
| `assignTicketKastarForbiddenOmAnstalldTilldelas` | Maria får inte tilldela ärendet till Anna, eftersom bara IT-ansvariga kan bli tilldelade. Meddelandet är "Bara IT-ansvariga kan tilldelas ärenden". |
| `updatePriorityAndrarPrioritetNarItAnsvarigAndrar` | Maria kan ändra prioritet från Mellan till Hög. |
| `updatePriorityKastarForbiddenOmAnstalldForsokerAndra` | Anna får "Bara IT-ansvariga kan ändra prioritet på ärenden". Prioriteten är fortfarande Mellan och inget sparas. |
| `getNumberOfTicketsPerCategoryRaknarOppnaArendenForItAnsvarig` | Statistiken räknar öppna ärenden per kategori (två skrivare, ett nätverk), skrivare ligger först, och alla fem kategorier kommer med, även de som har 0. Servicen frågar bara efter ärenden med status Ny och Pågående. |
| `getNumberOfTicketsPerCategoryKastarForbiddenForAnstalld` | En anställd får "Bara IT-ansvariga kan se statistik", och ingen fråga mot databasen görs. |

---

## 5. Översikt: behörighetsreglerna och deras tester

Den här tabellen visar alla regler om vem som får göra vad, och vilka tester som vaktar dem. Ändrar du en av reglerna ska motsvarande test gå rött. Gör det inte det saknas ett test.

| Regel | Var i koden | Nekas för fel person | Tillåts för rätt person |
|---|---|---|---|
| Bara IT får tilldela | `TicketService.assignTicket` | `assignTicketKastarForbiddenOmAnstalldForsokerTilldela` | `assignTicketTilldelarNarItAnsvarigTilldelar` |
| Bara IT kan bli tilldelade | `TicketService.assignTicket` | `assignTicketKastarForbiddenOmAnstalldTilldelas` | `assignTicketTilldelarNarItAnsvarigTilldelar` |
| Bara IT får ändra status | `TicketService.updateStatus` | `updateStatusKastarForbiddenOmAnstalldForsokerAndra` | `updateStatusAndrarStatusNarItAnsvarigAndrar` |
| Ingen får sätta Återkallad via statusbytet | `TicketService.updateStatus` | `updateStatusKanInteSattaAterkallad` | – |
| Bara IT får ändra kategori | `TicketService.updateCategory` | `updateCategoryKastarForbiddenOmAnstalldForsokerAndra` | `updateCategoryAndrarKategoriNarItAnsvarigAndrar` |
| Bara IT får ändra prioritet | `TicketService.updatePriority` | `updatePriorityKastarForbiddenOmAnstalldForsokerAndra` | `updatePriorityAndrarPrioritetNarItAnsvarigAndrar` |
| Bara IT får se statistik | `TicketService.getNumberOfTicketsPerCategory` | `getNumberOfTicketsPerCategoryKastarForbiddenForAnstalld` | `getNumberOfTicketsPerCategoryRaknarOppnaArendenForItAnsvarig` |
| Bara anmälaren får ändra sitt ärende | `TicketService.updateTicket` | `updateTicketNekasForAnnanAnvandare` | `updateTicketAndrarRubrikBeskrivningOchKategoriForAnmalaren` |
| Bara anmälaren får ta tillbaka sitt ärende | `TicketService.withdrawTicket` | `withdrawTicketNekasForAnnanAnvandare` | `withdrawTicketSatterStatusAterkallad` |
| Bara anmälaren får öppna sitt ärende igen | `TicketService.reopenTicket` | `reopenTicketNekasForAnnanAnvandare` | `reopenTicketGorLostArendePagaende` |
| IT och anmälaren får kommentera | `CommentService.createComment` | `annanAnstalldFarInteKommentera` | `itAnsvarigFarKommenteraArendet`, `anmalarenFarSvaraISittEgetArende` |
| IT och anmälaren får bifoga bilder | `AttachmentService.upload` | `annanAnstalldFarInteBifoga` | `anmalarenKanBifogaPng`, `itAnsvarigKanBifogaTillAndrasArende` |
| Bara mottagaren får markera en notis som läst | `NotificationService.markAsRead` | `manKanInteMarkeraNagonAnnansNotisSomLast` | – |
| Alla anrop utom inloggningen kräver giltig token | `SecurityConfig` | `anropUtanTokenSvarar401`, `felaktigTokenSvarar401`, `utgangenTokenSvarar401`, `headernXUserIdGerIngenAtkomstLangre` | `anropMedTokenGerControllernAnvandarensId` |
| Bara rätt e-post och lösenord ger en token | `AuthService.login` | `loginKastarInvalidCredentialsVidFelLosenord`, `loginKastarSammaFelForEpostSomInteFinns` | `loginGerTokenMedAnvandarensId` |

**Regler som inte har tester än:**

| Regel | Var i koden |
|---|---|
| Bara anmälaren och IT får se ett ärende | `TicketService.findById` |
| IT ser alla ärenden, en anställd bara sina egna | `TicketService.getAllTickets` |

De är bra kandidater för nästa test. Mönstret finns i avsnitt 6.

---

## 6. Skriva ett nytt test

### Steg för steg

1. **Bestäm vad som ska kontrolleras.** En regel och ett utfall per test. Skriv hellre två små tester (nekas och tillåts) än ett stort.
2. **Öppna rätt testklass.** Tester för `TicketService` ligger i `TicketServiceTest` osv. Finns det ingen klass än, skapa en i `src/test/java/com/thebanmd/helpdesk/services/` med samma namn som servicen plus `Test`.
3. **Lägg testet i rätt grupp**, eller börja en ny grupp med en kommentar: `// ---- Kort beskrivning av storyn ----`.
4. **Namnge testet som en mening**, t.ex. `findByIdKastarForbiddenOmAnnanAnstalldForsokerSe`.
5. **Förbered** med en hjälpmetod om det finns en som passar, annars med `when(...).thenReturn(...)`.
6. **Gör** anropet.
7. **Kontrollera** resultatet, och vid fel även att ingenting sparades.
8. **Kör testet** och se att det går igenom.
9. **Se testet gå rött en gång.** Ändra tillfälligt i servicen så att regeln inte gäller, t.ex. genom att kommentera bort raden med kontrollen, och kör testet igen. Går det inte rött testar det inte det du tror. Glöm inte att ångra ändringen.

### Mall: en regel som nekar

```java
@Test
void <metod>KastarForbiddenOm<VemSomForsoker>() {
    // Förbered
    Ticket ticket = ettNyttArende();

    // Gör och kontrollera att det blir fel
    assertThatThrownBy(() -> service.<metod>(1L, ..., <idPaFelPerson>))
            .isInstanceOf(ForbiddenActionException.class)
            .hasMessage("<exakt meddelande från servicen>");

    // Kontrollera att ingenting ändrades
    assertThat(ticket.get<Fält>()).isEqualTo(<värdet före>);
    verify(ticketRepository, never()).save(any());
}
```

### Mall: en regel som tillåter

```java
@Test
void <metod><VadSomHander>Nar<VemSomGor>() {
    // Förbered
    Ticket ticket = ettNyttArende();

    // Gör
    TicketDetailResponse response = service.<metod>(1L, ..., <idPaRattPerson>);

    // Kontrollera både ärendet och svaret till frontend
    assertThat(ticket.get<Fält>()).isEqualTo(<nytt värde>);
    assertThat(response.<fält>()).isEqualTo(<nytt värde>);
}
```

### Exempel: en regel som saknar test

Så här kan testet för att Omar inte får se Annas ärende se ut:

```java
@Test
void findByIdKastarForbiddenOmAnnanAnstalldForsokerSe() {
    annasNyaArende();
    when(userRepository.findById(2L)).thenReturn(Optional.of(userWithId(2L, "Omar Haddad", Role.EMPLOYEE)));

    assertThatThrownBy(() -> service.findById(10L, 2L))
            .isInstanceOf(ForbiddenActionException.class)
            .hasMessage("Du har inte behörighet att se det här ärendet");
}
```

### Bra att veta

- **Använd `any()` bara när argumentet inte spelar roll.** Vill du kontrollera *vad* som skickades, ange värdet (som `findByStatusIn(List.of(Status.NEW, Status.IN_PROGRESS))` i statistiktestet) eller använd en `ArgumentCaptor`.
- **Ett test ska inte bero på ett annat.** Varje test får nya mockar och ny testdata, så ordningen spelar ingen roll.
- **Kopiera felmeddelandet från servicen.** Ändras meddelandet där måste testet ändras också. Det är meningen, eftersom meddelandet syns för användaren.
- **Imports:** IntelliJ lägger till dem med Alt+Enter (Option+Enter på Mac). De statiska importerna (`assertThat`, `when`, `verify` osv.) finns redan överst i testklasserna.

---

## 7. När ett test går rött

### Läsa felet

Maven skriver vilket test som gick sönder, på vilken rad och varför. Ett exempel, när kontrollen i `updatePriority` hade tagits bort:

```
[ERROR] Failures:
[ERROR]   TicketServiceTest.updatePriorityKastarForbiddenOmAnstalldForsokerAndra:429
Expecting code to raise a throwable.
[ERROR] Tests run: 31, Failures: 1, Errors: 0, Skipped: 0
[INFO] BUILD FAILURE
```

Raden betyder: testet väntade sig att `updatePriority` skulle kasta ett fel, men inget fel kastades. Alltså fick en anställd ändra prioritet. `:429` är radnumret i testfilen.

Vanliga meddelanden från AssertJ:

| Meddelande | Betyder |
|---|---|
| `Expecting code to raise a throwable.` | Testet väntade sig ett fel, men koden gick igenom. En regel saknas eller har flyttats. |
| `Expecting actual throwable to be an instance of: ...ForbiddenActionException but was: ...` | Ett fel kastades, men av fel typ. |
| `Expecting message to be: "..." but was: "..."` | Rätt typ av fel, men annat meddelande. |
| `expected: X but was: Y` | Ett värde var inte det väntade, t.ex. en annan status. |
| `Wanted but not invoked` / `Never wanted here` (Mockito) | Något anropades inte, eller anropades fast det inte skulle, t.ex. `save`. |

### Vad gör man?

1. **Ändrade du regeln med flit?** Om en story faktiskt ändrar en regel ska testet ändras så att det beskriver den nya regeln. Skriv det i PR:en under "Till granskaren", så att granskaren ser att ändringen är avsiktlig.
2. **Ändrade du inte regeln med flit?** Då har testet hittat en bugg. Rätta koden, inte testet.
3. **Ta aldrig bort eller kommentera bort ett test för att få det grönt.** Då försvinner skyddet för regeln.

---

## 8. Vanliga problem

| Problem | Lösning |
|---|---|
| `./mvnw: Permission denied` | Filen har tappat rätten att köras. Kör `chmod +x mvnw` i `backend/helpdesk`. |
| `release version 21 not supported` eller liknande | Fel Java-version. Testerna kräver Java 21. Kontrollera med `java -version`. |
| Fel om att getters eller konstruktorer saknas i IntelliJ | Lombok är inte aktiverat. Slå på **Annotation Processing** under *Settings → Build, Execution, Deployment → Compiler → Annotation Processors*. |
| Testerna hittas inte i VS Code | Installera **Extension Pack for Java** och öppna mappen `backend/helpdesk`, eller hela repot. |
| `contextLoads` går rött efter en ändring | Appen kan inte starta. Läs första `Caused by:` i utskriften. Ofta saknas `@Service`/`@Component`, eller en ny konstruktorparameter har en typ som Spring inte känner till. |
| Alla tester går igenom men appen beter sig fel | Testerna täcker bara servicelagret, se avsnitt 2. Testa controllern och frontend för hand. |
