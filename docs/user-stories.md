# User stories och backlog

Underlag för backloggen, version 1 (2026-10-16). Här samlar vi stories, acceptanskriterier och det vi diskuterat, innan korten läggs in i Jira.

> **När korten är inlagda i Jira är det Jira som gäller.** Ändringar görs då där, inte i den här filen. Filen ligger kvar som historik över hur backloggen såg ut från början.

## Ordnad backlog

| # | Kort | Typ | MoSCoW | Storlek | Epic | Status |
|---|---|---|---|---|---|---|
| 1 | Undersökning: Hur kör vi MySQL lokalt? | Undersökning | Must | max 2 h | – | Utkast |
| 2 | Projektskelett med React, Spring Boot och MySQL | Teknisk | Must | M | – | Utkast |
| 3 | Välja vem man är | Story | Must | M | åtkomst | Genomgången |
| 4 | Anmäla ett fel | Story | Must | **M (referens)** | anmäla fel | Genomgången |
| 5 | Se mina ärenden | Story | Must | S | följa ärenden | Genomgången |
| 6 | Se alla ärenden | Story | Must | S | hantera ärenden | Genomgången |
| 7 | Öppna ett ärende | Story | Must | S | hantera ärenden | Genomgången |
| 8 | Ändra status på ett ärende | Story | Must | S | hantera ärenden | Utkast |
| 9 | Tilldela ett ärende | Story | Must | M | hantera ärenden | Utkast |
| 10 | Kommentera ett ärende | Story | Must | M | kommentarer | Utkast |
| 11 | Svara på kommentarer i mitt ärende | Story | Must | S | kommentarer | Utkast |
| 12 | Filtrera ärenden på status | Story | Must | S | hantera ärenden | Utkast |
| 13 | Ange hur bråttom det är | Story | Should | S | anmäla fel | Utkast |
| 14 | Logga in med lösenord | Story | Should | L | åtkomst | Utkast |
| 15 | Mejl när mitt ärende är löst | Story | Could | L | följa ärenden | – |
| 16 | Bifoga skärmdump | Story | Could | L | anmäla fel | – |
| 17 | Statistik över öppna ärenden per kategori | Story | Could | M | uppföljning | – |
| 18 | Skapa ärende via mejl | Story | Won't | – | anmäla fel | – |

**Genomgången:** acceptanskriterierna är diskuterade och godkända av gruppen. **Utkast:** ska gås igenom innan storyn tas in i en sprint.

**Referensstory för estimering:** "Anmäla ett fel" är M. Övriga storlekar är jämförda med den.

## Vad vi ändrade när vi diskuterade

| Datum | Ändring | Varför |
|---|---|---|
| 2026-10-16 | "Skapa ärende" och "Välja kategori" slogs ihop till "Anmäla ett fel" | Kategori-storyn gick inte att bygga eller visa utan den andra (Independent i INVEST). |
| 2026-10-16 | Ny story: "Öppna ett ärende" | Status, tilldelning och kommentarer behöver en ärendevy att finnas i. |
| 2026-10-16 | Mobilkriteriet flyttades från "Anmäla ett fel" till DoD punkt 9 | Appen byggs mobile first, så kravet gäller alla stories och hör hemma i DoD. |
| 2026-10-16 | Vart man skickas efter valet av användare flyttades från "Välja vem man är" till "Se mina ärenden" och "Se alla ärenden" | Annars kunde "Välja vem man är" inte bli klar förrän de två andra var byggda, trots att den görs först (Independent i INVEST). |
| 2026-10-16 | "Välja vem man är" fick ett nytt "så att" och ett kriterium för att byta användare | Värdet "jag ser det som gäller mig" levereras nu av story 3 och 4. |
| 2026-10-16 | "Mejl när ärendet är löst" fick Could, och "Skapa ärende via mejl" lades till som Won't | Appen fungerar utan mejl. Bortvalet syns som ett kort så att vi inte tar samma diskussion igen. |

## Korten

### 1. Undersökning: Hur kör vi MySQL lokalt?

**Typ:** Undersökning · **MoSCoW:** Must · **Storlek:** max 2 h · **Epic:** –

#### Fråga

Hur kör vi MySQL lokalt så att alla i teamet har samma version och samma databas? Alternativen vi ser:

- Alla installerar MySQL själva på sin dator
- MySQL körs i Docker med en gemensam `docker-compose.yml` i repot

#### Tidsgräns

Max 2 timmar.

#### Resultat

- Beslut i `docs/beslutslogg.md`
- Instruktion i README under "Kom igång"

#### Anteckningar

Ska vara klar före "Projektskelett med React, Spring Boot och MySQL", som bygger på beslutet.

---

### 2. Projektskelett med React, Spring Boot och MySQL

**Typ:** Teknisk · **MoSCoW:** Must · **Storlek:** M · **Epic:** –

#### Uppgift

Sätta upp projektskelett:

- `frontend/`: React med Vite
- `backend/`: Spring Boot (Spring Web, Spring Data JPA, Validation, MySQL Driver)
- Backend kopplad till MySQL enligt beslutet från undersökningen om MySQL lokalt

#### Varför

Alla stories i sprint 1 bygger på det.

#### Klart när

- [ ] Alla i teamet kan klona repot och starta databas, backend och frontend enligt README
- [ ] Frontend visar ett svar från en test-endpoint i backend
- [ ] Databasens användarnamn och lösenord ligger inte i repot

---

### 3. Välja vem man är

**Typ:** Story · **MoSCoW:** Must · **Storlek:** M · **Epic:** åtkomst

#### Story

**Som** anställd eller IT-ansvarig
**vill jag** välja vem jag är i en lista när jag öppnar appen
**så att** ärenden jag skapar och ändrar kopplas till mig.

#### Acceptanskriterier

- [ ] **AK 1:** Givet att ingen användare är vald, när jag öppnar appen, så visas en lista med alla användare, med namn och roll.
- [ ] **AK 2:** Givet att listan visas, när jag väljer en användare, så visas mitt namn och min roll i sidhuvudet tillsammans med en knapp för att byta användare.
- [ ] **AK 3:** Givet att jag har valt en användare, när jag laddar om sidan, så är jag fortfarande vald.
- [ ] **AK 4:** Givet att jag har valt en användare, när jag klickar på "Byt användare", så kommer jag tillbaka till listan med användare.
- [ ] **AK 5:** Givet att ingen användare är vald, när jag försöker gå direkt till en annan sida (t.ex. genom att skriva in adressen), så skickas jag till listan med användare.

#### Anteckningar

- Ingen riktig inloggning i MVP:n, se beslut 2 i beslutsloggen. Inloggning med lösenord finns som egen story (Should).
- Testdata: minst fyra anställda och två IT-ansvariga ska finnas i databasen från start, så att storyn går att testa.
- Efter valet visas en enkel startsida. Vart man skickas beroende på roll ingår i "Se mina ärenden" och "Se alla ärenden", så att den här storyn kan bli klar först.

---

### 4. Anmäla ett fel

**Typ:** Story · **MoSCoW:** Must · **Storlek:** **M (referens)** · **Epic:** anmäla fel

#### Story

**Som** anställd
**vill jag** anmäla ett fel med rubrik, beskrivning och kategori
**så att** IT får veta vad som är fel och vad det gäller.

#### Acceptanskriterier

- [ ] Formuläret har fälten Rubrik, Beskrivning och Kategori (Dator, Skrivare, Nätverk, Konto och behörighet, Annat)
- [ ] Det går inte att skicka ärendet om något fält saknas. Ett felmeddelande visas vid det fält som saknas.
- [ ] Rubriken kan vara högst 120 tecken
- [ ] När ärendet skickats visas en bekräftelse, och ärendet har status Ny och mig som anmälare
- [ ] Ärendet finns kvar efter att sidan laddats om

#### Anteckningar

- Ersätter två stories från pass 1 ("skapa ärende" och "välja kategori"). Kategori-storyn gick inte att bygga utan den andra (INVEST: Independent).
- Att formuläret fungerar i mobilbredd täcks av DoD punkt 9.
- Referensstory för estimeringen: M.

---

### 5. Se mina ärenden

**Typ:** Story · **MoSCoW:** Must · **Storlek:** S · **Epic:** följa ärenden

#### Story

**Som** anställd
**vill jag** se en lista över mina ärenden och deras status
**så att** jag slipper fråga IT hur det går.

#### Acceptanskriterier

- [ ] När jag väljer en anställd i användarlistan kommer jag direkt till "Mina ärenden"
- [ ] Vyn "Mina ärenden" visar bara ärenden där jag är anmälare
- [ ] Varje ärende visar rubrik, kategori, status och datum då det skapades
- [ ] Nyaste ärendet ligger överst
- [ ] Har jag inga ärenden visas texten "Du har inga ärenden än" och en knapp till formuläret för nytt ärende

#### Anteckningar

Bygger på "Välja vem man är" och "Anmäla ett fel".

---

### 6. Se alla ärenden

**Typ:** Story · **MoSCoW:** Must · **Storlek:** S · **Epic:** hantera ärenden

#### Story

**Som** IT-ansvarig
**vill jag** se alla ärenden i en lista
**så att** jag har överblick över vad som behöver göras.

#### Acceptanskriterier

- [ ] När jag väljer en IT-ansvarig i användarlistan kommer jag direkt till "Alla ärenden"
- [ ] Vyn "Alla ärenden" visar ärenden från alla anmälare
- [ ] Varje ärende visar rubrik, kategori, status, anmälare, vem som är tilldelad ("Ej tilldelad" om ingen är det) och datum
- [ ] Nyaste ärendet ligger överst
- [ ] En anställd ser ingen länk till "Alla ärenden" i menyn

#### Anteckningar

Det sista kriteriet är inget riktigt skydd, bara att menyn styrs av roll. Riktigt skydd kommer med inloggning (Should).

---

### 7. Öppna ett ärende

**Typ:** Story · **MoSCoW:** Must · **Storlek:** S · **Epic:** hantera ärenden

#### Story

**Som** IT-ansvarig
**vill jag** öppna ett ärende och se all information om det
**så att** jag förstår problemet innan jag börjar arbeta med det.

#### Acceptanskriterier

- [ ] Klickar man på ett ärende i en lista öppnas en vy med rubrik, hela beskrivningen, kategori, status, anmälare, tilldelad och datum
- [ ] En anställd kan öppna sina egna ärenden från "Mina ärenden" och ser samma information
- [ ] Från vyn kan man gå tillbaka till listan man kom ifrån
- [ ] Finns ärendet inte (t.ex. fel adress) visas "Ärendet hittades inte" i stället för en tom sida

#### Anteckningar

Ny story jämfört med pass 1. Ärendevyn behövs som plats för att ändra status, tilldela och kommentera.

---

### 8. Ändra status på ett ärende

**Typ:** Story · **MoSCoW:** Must · **Storlek:** S · **Epic:** hantera ärenden

#### Story

**Som** IT-ansvarig
**vill jag** ändra status på ett ärende
**så att** anmälaren ser hur arbetet går.

#### Acceptanskriterier

- [ ] **AK 1:** Givet att jag är IT-ansvarig och har öppnat ett ärende, när jag väljer en ny status (Ny, Pågår eller Löst) och sparar, så visas den nya statusen direkt i ärendet och i "Alla ärenden".
- [ ] **AK 2:** Givet att IT har ändrat status på mitt ärende, när jag som anställd öppnar "Mina ärenden", så ser jag den nya statusen.
- [ ] **AK 3:** Givet att jag är anställd och har öppnat mitt ärende, när jag tittar på statusen, så kan jag se den men inte ändra den.
- [ ] **AK 4:** Givet att ett ärende har status Löst, när IT ändrar det till Pågår, så är ärendet öppet igen och syns som ej löst.

---

### 9. Tilldela ett ärende

**Typ:** Story · **MoSCoW:** Must · **Storlek:** M · **Epic:** hantera ärenden

#### Story

**Som** IT-ansvarig
**vill jag** tilldela ett ärende till mig själv eller en kollega
**så att** det är tydligt vem som tar det.

#### Acceptanskriterier

- [ ] I ärendevyn finns ett val för tilldelad med alla IT-ansvariga och alternativet "Ej tilldelad"
- [ ] Anställda finns inte med bland alternativen
- [ ] Efter att jag sparat syns den tilldelade i ärendet och i "Alla ärenden"
- [ ] Man kan byta tilldelad eller ta bort tilldelningen
- [ ] Den som anmält ärendet ser vem som är tilldelad men kan inte ändra det

---

### 10. Kommentera ett ärende

**Typ:** Story · **MoSCoW:** Must · **Storlek:** M · **Epic:** kommentarer

#### Story

**Som** IT-ansvarig
**vill jag** skriva en kommentar på ett ärende
**så att** jag kan ställa följdfrågor till den som anmält.

#### Acceptanskriterier

- [ ] Under ärendet finns ett textfält och en knapp "Skicka"
- [ ] Kommentaren visas direkt under ärendet med mitt namn och tid, utan att sidan laddas om
- [ ] Kommentarerna visas i tidsordning, äldst först
- [ ] Det går inte att skicka en tom kommentar. Knappen är inaktiv tills något har skrivits.
- [ ] Kommentaren finns kvar efter att sidan laddats om

---

### 11. Svara på kommentarer i mitt ärende

**Typ:** Story · **MoSCoW:** Must · **Storlek:** S · **Epic:** kommentarer

#### Story

**Som** anställd
**vill jag** svara på kommentarer i mitt ärende
**så att** IT får den information de behöver.

#### Acceptanskriterier

- [ ] **AK 1:** Givet att IT har kommenterat mitt ärende, när jag öppnar ärendet, så ser jag kommentaren med namn och tid.
- [ ] **AK 2:** Givet att jag har öppnat ett av mina ärenden, när jag skriver ett svar och skickar det, så visas svaret bland kommentarerna med mitt namn och tid.
- [ ] **AK 3:** Givet att textfältet är tomt, när jag försöker skicka, så skickas ingenting.

#### Anteckningar

Återanvänder kommentarsfunktionen från "Kommentera ett ärende". Därför S.

---

### 12. Filtrera ärenden på status

**Typ:** Story · **MoSCoW:** Must · **Storlek:** S · **Epic:** hantera ärenden

#### Story

**Som** IT-ansvarig
**vill jag** filtrera listan på status
**så att** jag bara ser det som fortfarande är öppet.

#### Acceptanskriterier

- [ ] Ovanför "Alla ärenden" finns ett val: Alla, Ej lösta, Ny, Pågår och Löst
- [ ] "Ej lösta" (Ny och Pågår) är förvalt när vyn öppnas
- [ ] Listan uppdateras direkt när jag byter filter
- [ ] Matchar inga ärenden visas "Inga ärenden med den statusen"

---

### 13. Ange hur bråttom det är

**Typ:** Story · **MoSCoW:** Should · **Storlek:** S · **Epic:** anmäla fel

#### Story

**Som** anställd
**vill jag** ange hur bråttom det är
**så att** det som stoppar mitt arbete blir åtgärdat först.

#### Acceptanskriterier

- [ ] Formuläret har fältet Brådska med valen Låg, Normal (förvalt) och Hög – stoppar mitt arbete
- [ ] Brådska visas i båda listorna och i ärendevyn
- [ ] IT-ansvarig kan sortera "Alla ärenden" på brådska

---

### 14. Logga in med lösenord

**Typ:** Story · **MoSCoW:** Should · **Storlek:** L · **Epic:** åtkomst

#### Story

**Som** IT-ansvarig
**vill jag** logga in med lösenord
**så att** ingen annan kan ändra i ärendena.

#### Acceptanskriterier

#### Anteckningar

- Bedömd som L: ingen i gruppen har byggt inloggning med Spring Security förut. Gör gärna en undersökning först och dela upp storyn efter den.
- Ersätter valet i listan från "Välja vem man är" (beslut 2 i beslutsloggen).

---

### 15. Mejl när mitt ärende är löst

**Typ:** Story · **MoSCoW:** Could · **Storlek:** L · **Epic:** följa ärenden

#### Story

**Som** anställd
**vill jag** få ett mejl när mitt ärende är löst
**så att** jag vet när jag kan fortsätta arbeta.

#### Anteckningar

Kräver e-postadress på användare och utskick av mejl. Acceptanskriterier skrivs om storyn flyttas upp.

---

### 16. Bifoga skärmdump

**Typ:** Story · **MoSCoW:** Could · **Storlek:** L · **Epic:** anmäla fel

#### Story

**Som** anställd
**vill jag** bifoga en skärmdump till mitt ärende
**så att** IT ser exakt vilket felmeddelande jag får.

#### Anteckningar

Kräver filuppladdning och lagring av filer. Acceptanskriterier skrivs om storyn flyttas upp.

---

### 17. Statistik över öppna ärenden per kategori

**Typ:** Story · **MoSCoW:** Could · **Storlek:** M · **Epic:** uppföljning

#### Story

**Som** IT-ansvarig
**vill jag** se hur många ärenden som är öppna per kategori
**så att** jag ser var de återkommande problemen finns.

#### Anteckningar

Acceptanskriterier skrivs om storyn flyttas upp.

---

### 18. Skapa ärende via mejl

**Typ:** Story · **MoSCoW:** Won't · **Storlek:** – · **Epic:** anmäla fel

#### Story

**Som** anställd
**vill jag** skapa ett ärende genom att mejla till en adress
**så att** jag inte behöver öppna appen.

#### Anteckningar

**Won't (this time).** Medvetet bortvald: kräver att en mejlbox läses av och tolkas, vilket är ett eget projekt. Står här så att vi inte tar samma diskussion igen.
