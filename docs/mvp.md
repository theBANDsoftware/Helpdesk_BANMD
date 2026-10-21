# Projekt: Enkel helpdesk för en liten organisation

**Grupp:** _[the BANMD]_
**Arbetsnamn:** _[Helpdesk]_

## MVP-beskrivning

### Vad appen gör och för vem

Appen är ett enkelt ärendesystem för små organisationer, till exempel en skola eller ett kontor med 10–50 anställda och en eller två IT-ansvariga som ofta bara jobbar med IT på deltid. I dag kommer felanmälningar in via mejl, sms, Teams och i korridoren. Ärenden glöms bort, IT-ansvariga saknar överblick och den som anmält vet inte om någon har tittat på problemet. Med appen samlas alla ärenden på ett ställe: den anställda anmäler felet och kan följa statusen, och IT-ansvariga ser alla ärenden, fördelar dem och markerar dem som lösta.

### Användare

- **Anställd:** anmäler fel och följer sina egna ärenden.
- **IT-ansvarig:** ser alla ärenden, tilldelar dem och ändrar status.

### Ingår i MVP:n

1. Välja vem man är i en lista med användare (enkel inloggning utan lösenord; användarna och deras roller finns i databasen)
2. Skapa ett ärende med rubrik, beskrivning och kategori
3. Anställd ser sina egna ärenden och deras status
4. IT-ansvarig ser alla ärenden i en lista och kan filtrera på status
5. IT-ansvarig tilldelar ett ärende till sig själv eller en kollega
6. IT-ansvarig ändrar status: Ny → Pågår → Löst
7. Både anställd och IT-ansvarig kan skriva kommentarer på ett ärende

### Ingår inte i MVP:n

- Riktig inloggning med lösenord eller Microsoft-/Google-konto
- Prioritet och deadlines på ärenden
- Bilagor och skärmdumpar
- Notiser via mejl eller i appen
- Skapa ärenden genom att mejla till en adress
- Statistik och översiktspanel
- Kunskapsbank med vanliga problem och lösningar
- Register över datorer och annan utrustning kopplat till ärenden
- Stöd för flera organisationer i samma system
- Mobilapp

## User stories

Markerade med **MVP** eller **Senare**. Ordningen inom varje epic är ett första förslag på prioritering.

### Epic: Komma åt systemet

| # | Story | |
|---|---|---|
| 1 | Som **anställd** vill jag välja mig själv i en lista när jag öppnar appen så att ärendena jag skapar kopplas till mig. | MVP |
| 2 | Som **IT-ansvarig** vill jag logga in med lösenord så att ingen annan kan ändra i ärendena. | Senare |

### Epic: Anmäla fel

| # | Story | |
|---|---|---|
| 3 | Som **anställd** vill jag skapa ett ärende med rubrik och beskrivning så att IT får veta vad som är fel. | MVP |
| 4 | Som **anställd** vill jag välja en kategori (dator, skrivare, nätverk, konto, annat) så att IT direkt ser vad ärendet gäller. | MVP |
| 5 | Som **anställd** vill jag ange hur bråttom det är så att det som stoppar mitt arbete blir åtgärdat först. | Senare |
| 6 | Som **anställd** vill jag bifoga en skärmdump så att IT ser exakt vilket felmeddelande jag får. | Senare |

### Epic: Följa sina ärenden

| # | Story | |
|---|---|---|
| 7 | Som **anställd** vill jag se mina ärenden och deras status så att jag slipper fråga IT hur det går. | MVP |
| 8 | Som **anställd** vill jag få ett mejl när mitt ärende är löst så att jag vet när jag kan fortsätta arbeta. | Senare |

### Epic: Hantera ärenden

| # | Story | |
|---|---|---|
| 9 | Som **IT-ansvarig** vill jag se alla ärenden i en lista så att jag har överblick över vad som behöver göras. | MVP |
| 10 | Som **IT-ansvarig** vill jag filtrera listan på status så att jag bara ser det som fortfarande är öppet. | MVP |
| 11 | Som **IT-ansvarig** vill jag tilldela ett ärende till mig själv eller en kollega så att det är tydligt vem som tar det. | MVP |
| 12 | Som **IT-ansvarig** vill jag ändra status på ett ärende så att anmälaren ser hur arbetet går. | MVP |

### Epic: Kommunikation i ärendet

| # | Story | |
|---|---|---|
| 13 | Som **IT-ansvarig** vill jag skriva en kommentar på ett ärende så att jag kan ställa följdfrågor till den som anmält. | MVP |
| 14 | Som **anställd** vill jag svara på kommentarer i mitt ärende så att IT får den information de behöver. | MVP |

### Epic: Uppföljning

| # | Story | |
|---|---|---|
| 15 | Som **IT-ansvarig** vill jag se hur många ärenden som är öppna per kategori så att jag ser var de återkommande problemen finns. | Senare |

**Summa:** 15 stories, varav 10 MVP och 5 senare.

### Tekniska uppgifter (inte user stories)

Behövs för att MVP-storyna ska gå att bygga. Läggs som egna kort på boarden, kopplade till storyn de möjliggör.

- Sätta upp repot med `frontend/` och `backend/`
- Sätta upp Spring Boot (Spring Initializr) med en första endpoint
- Sätta upp MariaDB och koppla den till backend med Spring Data JPA
- Seed-data: några anställda och två IT-ansvariga, så att story 1 fungerar direkt

### Första tanke om data

Inget färdigt schema, bara ett underlag inför pass 2.

- **User:** id, namn, roll (anställd / IT-ansvarig)
- **Ticket:** id, rubrik, beskrivning, kategori, status, skapad av (User), tilldelad (User, kan vara tom), skapad, uppdaterad
- **Comment:** id, ärende (Ticket), författare (User), text, skapad

## Preliminärt stackval

| Del | Val |
|---|---|
| Frontend | React med TypeScript (Vite) |
| Backend | Java med Spring Boot |
| Databas | MariaDB, via Spring Data JPA (ändrat från MySQL, se beslut 7) |

**Motivering:** Vi väljer React, Spring Boot och MariaDB eftersom det är den stack gruppen känner sig tryggast i, och Spring Boots fasta struktur (controller, service, repository) gör att alla i gruppen skriver backendkoden på samma sätt när vi arbetar parallellt.

_Valet är preliminärt och kan ändras fram till pass 3._
