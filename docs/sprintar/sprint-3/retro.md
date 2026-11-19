# Retrospektiv: sprint 3

<!--
  INSTRUKTION
  Direkt efter reviewn, ungefär 15–20 minuter. Scrum Master leder.
  1. Följ upp förra retrons åtgärder: blev de av? Hjälpte de?
  2. Alla skriver tyst i 3 minuter: vad gick bra, vad gick mindre bra. Sedan går ni igenom det tillsammans.
  3. Välj högst 2–3 åtgärder. Varje åtgärd ska vara konkret och ha en ansvarig.
  4. Behöver Definition of Done eller gruppkontraktet ändras?
  Retron handlar om HUR ni har jobbat, inte om vad ni byggt. Det tas på reviewn.
  Skriv ärligt. Det här är bra underlag för er individuella reflektion.
-->

**Datum:** 2026-11-18
**Deltagare:** Adli Anabtawi, Bleart Rama, David Andersson, Noah Fältman, Mustafa Samir
**Leds av:** Mustafa Samir (Scrum Master sprint 3)

## Förra retrons åtgärder

| Åtgärd | Blev den av? | Hjälpte den? |
|---|---|---|
| Standupen loggas i `standup.md` direkt efter standupen, samma kväll. | Nej. Loggen skrevs i efterhand i slutet av sprinten, precis som i sprint 1 och 2. | Nej. Vad var och en gjorde fick återskapas från commits och minne. |
| `develop` mergas till `main` fredag kväll (ny regel i DoD). | Ja. PR #67 mergades fredag 13 november kl. 19.08. | Ja. `main` var uppdaterad inför reviewn, och ingen behövde fixa det under helgen. |
| Vi mergar löpande under veckan i stället för allt på fredag. | Ja. Korten mergades onsdag och torsdag, inget låg kvar till fredagen. | Ja. Inga merge-krockar den här sprinten, till skillnad från sprint 2 där `develop` inte gick att bygga förrän TB-58 var klar. |

## Vad gick bra?

- Alla åtta kort blev klara, för tredje sprinten i rad.
- Inga merge-konflikter. Problemet från sprint 2, där TB-31, TB-32 och TB-35 krockade på fredagen, upprepades inte.
- `develop` mergades till `main` på fredagskvällen, första gången enligt den nya DoD-regeln från sprint 1.
- Noah tog över TB-47 när det blev liggande, eftersom det låg nära hans egen TB-48. Det löstes direkt på onsdagens standup utan lång diskussion.
- Hög närvaro på standupen. Alla var med varje dag utom Adli på torsdagen.

## Vad gick mindre bra?

- Standup-loggen skrevs i efterhand för tredje sprinten i rad, trots att det har varit en åtgärd två retron i rad. Åtgärden fungerar uppenbarligen inte som den är formulerad.
- Mappen `docs/sprintar/sprint-3/` skapades först kvällen före reviewn, i stället för vid planeringen. Planeringsdokumentet fick skrivas i efterhand.
- TB-47 flyttades aldrig till Noah i Jira när han tog över. Tavlan visade fel ansvarig hela veckan.
- Retron hölls inte direkt efter reviewn utan sköts upp, vilket gör det svårare att minnas detaljer.

## Åtgärder till nästa sprint

<!-- Högst 2–3. Konkreta, med ansvarig. "Bli bättre på att kommunicera" är inte en åtgärd. -->

| Åtgärd | Ansvarig |
|---|---|
| Var och en skriver sin egen rad direkt i Discord-tråden när standupen är slut. Scrum Master klistrar in dem i `standup.md` samma kväll. | Alla. Scrum Master ansvarar för filen. |
| Retron hålls direkt efter reviewn, samma dag. | Scrum Master i sprint 4 (Noah) |
| Tar någon över ett kort som ligger på en annan person, flyttas det i Jira direkt. | Alla |

## Ändringar i Definition of Done eller gruppkontrakt

- **Gruppkontraktet:** sprintmappen i `docs/sprintar/` skapas på planeringsdagen, med alla fyra filerna från mallen. Adli gjorde det redan för sprint 4, så vi skriver in det som en regel.
