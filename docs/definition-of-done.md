# Definition of Done

Gäller för **alla** stories. Det som gäller för en enskild story står i dess acceptanskriterier. En story är klar när både acceptanskriterierna och DoD är uppfyllda.

En story är klar när:

1. Alla acceptanskriterier är uppfyllda och testade för hand, både av den som byggt storyn och av granskaren.
2. Koden ligger i `develop` via en pull request som är kopplad till issuen (`Closes #N`).
3. Pull requesten är granskad och godkänd av minst en annan i teamet.
4. Den som mergar hämtar `develop` och startar databas, backend och frontend. Allt startar utan fel.
5. Ändringen innehåller ingen kvarglömd felsökningskod: inga `console.log` eller `System.out.println`, ingen utkommenterad kod och inga TODO.
6. Databaslösenord och andra hemligheter läses från miljövariabler eller från en lokal fil som finns i `.gitignore`. De ligger aldrig i repot.
7. Backendkoden följer lagren controller → service → repository. Controllern innehåller ingen affärslogik och anropar inte repositoryt direkt.
8. README eller `docs/` är uppdaterad om ändringen påverkar hur man startar eller använder projektet.

**Medvetet bortvalt i version 1:** krav på automatiska tester. Vi tar upp det på retron om fel som borde ha fångats börjar slinka igenom.

## Inför sprint review

Gäller hela sprinten, inte enskilda stories. Görs senast söndag kväll, när `review.md` fylls i.

- Scrum Master mergar `develop` till `main` via en pull request.
- `main` startas, och demoplanen testas från början till slut.
- Bara stories som uppfyller DoD visas som klara. Det är `main` som visas på reviewn.

## Versioner

| Version | Datum | Ändring | Varför (från vilken retro?) |
|---|---|---|---|
| 1 | 2026-10-16 | Första versionen | – |
