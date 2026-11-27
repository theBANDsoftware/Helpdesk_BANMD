import type { categoryTicket } from '../../Types';

/**
 * Frågorna och svaren till FAQ (TB-77).
 *
 * Texterna står direkt i koden. Det finns ingen databas och ingen endpoint,
 * så den som vill ändra en fråga gör det här och skickar en PR (beslut 15).
 * Att IT ska kunna redigera frågorna i appen är en egen, större story.
 */

export interface FaqItem {
  /** Frågan som användaren ser */
  question: string;
  /** Kort lösning. En eller två meningar, ett steg per mening. */
  answer: string;
}

export interface FaqSection {
  /** Samma kategorier som på ett ärende, så att det känns igen */
  category: categoryTicket;
  items: FaqItem[];
}

export const faqSections: FaqSection[] = [
  {
    category: 'PRINTER',
    items: [
      {
        question: 'Skrivaren skriver inte ut, men visar inget felmeddelande',
        answer:
          'Kontrollera att du har valt rätt skrivare i utskriftsrutan, eftersom Windows ofta väljer den du använde senast. Öppna sedan utskriftskön och ta bort gamla jobb som har fastnat, så startar nästa utskrift om.',
      },
      {
        question: 'Skrivaren blinkar rött',
        answer:
          'Rött blink betyder nästan alltid papperstrassel eller tomt papper. Öppna luckan, ta bort papperet försiktigt rakt ut och stäng luckan, så fortsätter utskriften av sig själv.',
      },
      {
        question: 'Utskriften blir blek eller randig',
        answer:
          'Tonern är på väg att ta slut. Ta ur tonerkassetten, vagga den försiktigt i sidled och sätt tillbaka den. Hjälper det bara en kort stund behöver du anmäla ett ärende så beställer IT en ny.',
      },
    ],
  },
  {
    category: 'NETWORK',
    items: [
      {
        question: 'Wifi kopplar ifrån hela tiden',
        answer:
          'Glöm nätverket i wifi-inställningarna och anslut på nytt. Sitter du långt från en accesspunkt, prova att flytta dig närmare, eftersom signalen är svag i hörnrummen.',
      },
      {
        question: 'Jag kommer inte åt en delad mapp',
        answer:
          'Kontrollera först att du är ansluten till kontorets nät eller till VPN, eftersom delade mappar inte går att nå hemifrån utan VPN. Fungerar det ändå inte kan behörigheten saknas, och då anmäler du ett ärende.',
      },
    ],
  },
  {
    category: 'ACCOUNT',
    items: [
      {
        question: 'Jag har glömt mitt lösenord',
        answer:
          'Använd länken "Glömt lösenord" på inloggningssidan, så får du ett mejl till din privata adress. Kommer inget mejl inom fem minuter, kolla skräpposten innan du anmäler ett ärende.',
      },
      {
        question: 'Kontot är låst efter för många försök',
        answer:
          'Kontot låses i 30 minuter efter fem felaktiga försök och låses sedan upp av sig självt. Behöver du komma in tidigare än så anmäler du ett ärende.',
      },
    ],
  },
  {
    category: 'COMPUTER',
    items: [
      {
        question: 'Datorn är väldigt långsam',
        answer:
          'Starta om datorn, eftersom den ofta har varit igång i flera veckor i vilande läge. Stäng också program du inte använder, särskilt webbläsarflikar, som tar mycket minne.',
      },
      {
        question: 'Skärmen är svart när jag kopplar in dockan',
        answer:
          'Dra ur dockans sladd från datorn, vänta tio sekunder och sätt tillbaka den. Hjälper det inte, prova en annan skärmkabel innan du anmäler ett ärende.',
      },
    ],
  },
];
