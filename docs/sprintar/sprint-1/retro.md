# Retrospektiv: sprint 1

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

**Datum:** 2026-11-02
**Deltagare:** Adli Anabtawi, Bleart Rama, David Andersson, Noah Fältman, Mustafa Samir
**Leds av:** Adli Anabtawi (Scrum Master sprint 1)

## Förra retrons åtgärder

Inga. Det här var första sprinten.

## Vad gick bra?

- Vi hade standup nästan varje dag. Den låg på kvällen, så att alla kunde vara med, även de som jobbar.
- TB-23 byggdes tillsammans. På backend delade David skärm, och på frontend delade Noah och David. Resten följde med, så alla har sett hur en story går genom alla lager.
- Den som fastnade sa till, antingen i Discord eller på standupen.
- Arbetet var relativt jämnt fördelat. Bleart tog både TB-24 och TB-25, eftersom de hörde ihop och rörde samma filer, som planeringen föreslog.
- Nya behov som upptäcktes under sprinten blev egna kort i Jira (TB-42–TB-52) i stället för att byggas in i pågående stories.

## Vad gick mindre bra?

- Standupen loggades inte under sprinten. Närvaron fick återskapas i efterhand från Discord, men vad var och en gjorde och vilka hinder som fanns gick inte att få fram.
- En branch blev försenad till helgen. Söndag kväll fungerade inte för alla, så `develop` mergades till `main` först på måndagen, strax före reviewn. DoD säger söndag kväll.
- Granskningen av PR:er varierade. Vissa granskade noggrant, andra mindre.
- Rollen som Scrum Master var otydlig. Ingen av oss hade sett någon i rollen förut, så det var svårt att veta vad som förväntades.
- TB-24 och TB-28 krockade i samma filer, och det behövdes ett eget kort (TB-43) för att lösa merge-konflikten. Risken stod i `planning.md`, men vi följde inte upp den.
- 13 av 49 commits saknar Jira-nyckel (DoD punkt 2), och ansvariga fylldes aldrig i i `planning.md`.

## Åtgärder till nästa sprint

<!-- Högst 2–3. Konkreta, med ansvarig. "Bli bättre på att kommunicera" är inte en åtgärd. -->

| Åtgärd | Ansvarig |
|---|---|
| Allt som ska visas på reviewn är mergat till `develop` senast fredag kväll, och `develop` mergas till `main` samma kväll. | Alla. Scrum Master påminner på onsdagens standup och gör PR:en till `main`. |
| Standupen loggas i `standup.md` direkt efter standupen, samma kväll. | Scrum Master (David i sprint 2) |
| Vi skriver en kort lista över vad Scrum Master gör varje dag och varje vecka, och lägger den i gruppkontraktet. | Adli, och lämnar över till David |

## Ändringar i Definition of Done eller gruppkontrakt

- **DoD, "Inför sprint review":** `develop` mergas till `main` fredag kväll i stället för söndag kväll. Fredag passar gruppen bäst, och på söndagen har inte alla tid.
- **Gruppkontraktet:** en lista över vad Scrum Master gör, se åtgärd 3.
