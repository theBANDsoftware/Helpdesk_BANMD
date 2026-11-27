# Demoguide

Ungefär 7 minuter. Starta backend och frontend enligt *Kom igång* i [README](../README.md) och öppna http://localhost:5173. Lösenordet till testanvändarna får du av David (se [inloggning.md](inloggning.md)).

Demon fungerar bäst om databasen har några ärenden i olika status, så att listorna inte är tomma. Använd två webbläsarfönster, ett vanligt och ett privat, så kan du vara inloggad som Anna och Maria samtidigt och slipper logga ut och in. Ett privat fönster har en egen inloggning, men två vanliga fönster delar på den.

## Som anställd (fönster 1)

1. Logga in som **Anna Lind** (`anna.lind@helpdesk.test`). Du hamnar på dina egna ärenden.
2. Visa att fel lösenord ger *Fel e-post eller lösenord.*, och att man stannar på inloggningen.
3. Klicka **Anmäl ett fel** och börja skriva en rubrik som liknar ett av Annas öppna ärenden. *Du har redan liknande ärenden* visas under fältet.
4. Skriv en ny rubrik, fyll i beskrivning och kategori, bifoga gärna en skärmdump och skicka.
5. Öppna ärendet. Det har status *Ny*, och du kan **Ändra** det eller **Ta tillbaka** det.
6. Skriv en kommentar, t.ex. "Det händer varje morgon".
7. Öppna **Notiser** och klicka **Slå på notiser i webbläsaren**, så att notiserna också dyker upp utanför sidan.

## Som IT-ansvarig (fönster 2)

8. Logga in som **Maria Nordin** (`maria.nordin@helpdesk.test`). Du ser alla ärenden och hur många som inte är tilldelade.
9. Visa filtren: välj kategorin Skrivare, byt tilldelning till Ingen, sök på "Anna" och sortera på prioritet. Gamla öppna ärenden har en klocka och röd bakgrund. Annas ärende har märket *Nytt svar*, eftersom hon skrev den senaste kommentaren.
10. Klicka **Ta ärendet** på Annas nya ärende. Siffran för otilldelade minskar.
11. Öppna ärendet, sätt prioritet Hög, status *Pågående* och svara på Annas kommentar.
12. Byt status till *Löst*. Fältet för lösningen dyker upp. Skriv vad som gjordes och spara. Lösningen syns som en kommentar.
13. Öppna **Statistik** och visa antalet ärenden per kategori.

## Tillbaka som anställd (fönster 1)

14. Inom 30 sekunder har siffran vid **Notiser** i menyn gått upp, och webbläsaren har visat en notis. Öppna **Notiser** och klicka på en notis. Den öppnar ärendet och markeras som läst.
15. Ärendet är löst och lösningen syns. Klicka **Öppna igen** för att visa att ärendet går tillbaka till IT.
16. Klicka **Logga ut**. Du hamnar på inloggningen, och skriver du in adressen till ett ärende direkt skickas du tillbaka dit.

## Mobil

Visa gärna mobilvyn också: öppna utvecklarverktygen i webbläsaren (F12) och välj en mobilbredd, t.ex. 360 px. Menyn flyttas då ner längst ner på skärmen.
