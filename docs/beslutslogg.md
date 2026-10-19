# Beslutslogg

<!--
  INSTRUKTION
  Här skriver ni ner större beslut och varför ni tog dem. Det är inte en lista över allt ni gör,
  utan över de val som påverkar projektet och som någon senare kan undra över.

  Exempel på beslut som ska hit:
  - Val av stack, ramverk eller större bibliotek
  - Hur ni strukturerar koden (mappar, lager, API-design)
  - Större ändringar i MVP:n eller databasschemat
  - Saker ni medvetet valt bort

  Skriv beslutet när det tas, inte i efterhand. Lägg nyaste beslutet överst.
  Ett beslut kan ersättas av ett senare. Skriv då "Ersatt av #N" på det gamla i stället för att ta bort det.
-->

## Mall

Kopiera den här för varje nytt beslut:

```markdown
## #N Rubrik

**Datum:**
**Status:** Gäller / Ersatt av #N

**Bakgrund:** Vad behövde vi bestämma, och varför?

**Alternativ:**
- Alternativ A
- Alternativ B

**Beslut:** Vad valde vi?

**Varför:** Varför valde vi det, och vad valde vi bort?

**Konsekvenser:** Vad betyder beslutet för projektet framåt?
```

<!-- Era beslut nedan, nyaste överst. -->

## 5. Kategorier som enum, inte egen tabell

**Datum: 2026-10-19**
**Status: Gäller** 

**Bakgrund:** Ett ärende har en kategori (Dator, Skrivare, Nätverk, Konto och behörighet, Annat). Vi behövde bestämma hur den lagras i databasen.

**Alternativ:**
- Enum i Java-koden, lagrad som text i `tickets`
- Egen tabell `categories` som `tickets` kopplas till

**Beslut:** Enum, lagrad som text (`@Enumerated(EnumType.STRING)`).

**Varför:** Kategorierna är få och ingen story kräver att de kan ändras. En egen tabell hade gett en tabell, en relation och en endpoint till i sprint 1 utan att någon användare får något av det.

**Konsekvenser:** Nya eller ändrade kategorier kräver en kodändring. Att IT-ansvariga själva kan redigera kategorier är medvetet bortvalt. Eftersom värdet lagras som text går det att byta till en egen tabell senare utan att befintlig data behöver tolkas om.

## 4. Jira-nyckel i branches, commits och pull requests

**Datum: 2026-10-19**
**Status: Gäller** 

**Bakgrund:** När vi bytte till Jira (beslut 3) behövde korten i Jira kopplas till koden i GitHub.

**Alternativ:**
- Ingen koppling. Korten och koden hålls ihop för hand.
- Jira-nyckeln först i branchnamn, commits och PR-titlar, så att GitHub for Jira kopplar ihop dem.

**Beslut:** Jira-nyckeln först i allt. Branchen heter t.ex. `TB-8-skapa-arende-via-mejl` och commiten `TB-8 Skapa ärende via mejl`.

**Varför:** I Jira-kortet syns vilka branches, commits och pull requests som hör till storyn, utan att någon behöver länka för hand.

**Konsekvenser:** `Closes #N` gäller inte längre. DoD punkt 2 och PR-mallen är ändrade. Korten flyttas till Done med en automatiseringsregel i Jira eller för hand.

## 3. Jira vs Github issues

**Datum: 2026-10-16**
**Status: Gäller** 

**Bakgrund:** Vill vi använda Jira eller github issues som primärt verktyg för kort

**Alternativ:**
- Github issues och Jira
- Bara Jira
  
**Beslut:** Jira

**Varför:** Jira har större stöd för hela flödet för SCRUM

**Konsekvenser:** Ett tydligare och mer sömlöst arbetssätt.

## 2. MySQL-server

**Datum: 2026-10-16**
**Status: Gäller** 

**Bakgrund:** Var MySQL-servern hostas.

**Alternativ:**
- Aiven
- Supabase
- Egen VPS

**Beslut:** Aiven

**Varför:** Enkelt att sätta upp och gratis.

**Konsekvenser:** Att vi har en MySQL-server uppsatt som är publik.

## 1. Stack

**Datum: 2026-10-13**
**Status: Gäller** 

**Bakgrund:** Vilken stack vi ska använda.

**Alternativ:**
 - MySQL, React, Express
 - MySQL, React, Spring Boot

**Beslut:** Spring Boot

**Varför:** Bekant stack och tydligt ramverk.

**Konsekvenser:** Utvecklingsprocessen bör vara mer modulär och effektiv.
