# Retrospektiv: sprint 2

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

**Datum:** 2026-11-09
**Deltagare:** Adli Anabtawi, Bleart Rama, David Andersson, Noah Fältman, Mustafa Samir
**Leds av:** David Andersson (Scrum Master sprint 2)

## Förra retrons åtgärder

| Åtgärd | Blev den av? | Hjälpte den? |
|---|---|---|
| Allt mergas till `develop` senast fredag kväll, och `develop` mergas till `main` samma kväll. | Delvis. Alla stories mergades till `develop` på fredagen, men mergarna krockade och `develop` gick inte att bygga förrän TB-58 mergades på lördagen. `develop` mergades inte till `main` samma kväll. | Delvis. Vi upptäckte krockarna före reviewn, men inte i tid till fredag kväll. |
| Standupen loggas i `standup.md` samma kväll. | Nej. Loggen fylldes i efterhand i slutet av sprinten. | Nej. Vad var och en gjorde fick återskapas från commits och minne. |
| Vi skriver en lista över vad Scrum Master gör och lägger den i gruppkontraktet. | Nej. `gruppkontrakt.md` ändrades inte under sprinten. | – |

## Vad gick bra?

- Alla kort i sprinten blev klara i tid till reviewn.
- Närvaron på standupen var hög. Alla fem var med varje dag utom tisdag, då Bleart och Mustafa saknades.
- När `develop` gick sönder efter fredagens mergar fick det ett eget kort (TB-58), som fixades på lördagen. Ingen behövde lappa i någon annans branch.

## Vad gick mindre bra?

- TB-31, TB-32 och TB-35 ändrade samma filer och mergades samma fredagseftermiddag. Mergarna krockade, och `develop` gick inte att bygga förrän TB-58 var klar på lördagen.
- Standupen loggades inte samma kväll, trots att det var en åtgärd från förra retron. Loggen fylldes i efterhand i slutet av sprinten.

## Åtgärder till nästa sprint

<!-- Högst 2–3. Konkreta, med ansvarig. "Bli bättre på att kommunicera" är inte en åtgärd. -->

| Åtgärd | Ansvarig |
|---|---|
| Standupen loggas i `standup.md` direkt efter standupen, samma kväll. | Scrum Master (Mustafa i sprint 3) |

## Ändringar i Definition of Done eller gruppkontrakt

- **DoD, "Inför sprint review":** `develop` mergas till `main` fredag kväll i stället för söndag kväll. Det beslutades redan på retron i sprint 1 men fördes aldrig in i `docs/definition-of-done.md`. Nu är det gjort.
- **DoD punkt 2, PR-mallen och gruppkontraktet:** commits innehåller ingen Jira-nyckel längre. Branchnamn och PR-titel har den fortfarande (beslut 11).
