-- Testdata så att storyn "Välja vem man är" och listorna går att testa direkt.
-- Påhittade personer. Fyra anställda och två IT-ansvariga.

INSERT INTO users (id, name, role) VALUES
  (1, 'Anna Lind',      'EMPLOYEE'),
  (2, 'Omar Haddad',    'EMPLOYEE'),
  (3, 'Sara Berg',      'EMPLOYEE'),
  (4, 'Johan Ek',       'EMPLOYEE'),
  (5, 'Maria Nordin',   'IT_ADMIN'),
  (6, 'Erik Holm',      'IT_ADMIN');

INSERT INTO tickets (id, title, description, category, status, created_by, assigned_to) VALUES
  (1, 'Skrivaren på plan 2 skriver inte ut',
      'Dokumenten hamnar i kön men inget kommer ut. Lampan blinkar orange.',
      'PRINTER', 'NEW', 1, NULL),
  (2, 'Kommer inte in på mejlen',
      'Får "fel lösenord" fast jag bytte lösenord i går.',
      'ACCOUNT', 'IN_PROGRESS', 2, 5),
  (3, 'Wifi försvinner i konferensrummet',
      'Nätet tappar anslutningen flera gånger i timmen i rum Ekan.',
      'NETWORK', 'RESOLVED', 3, 6);

INSERT INTO comments (ticket_id, author_id, body) VALUES
  (2, 5, 'Har du testat att logga in via webben också, eller bara i Outlook?'),
  (2, 2, 'Bara i Outlook. På webben fungerar det.'),
  (3, 6, 'Bytt accesspunkt i Ekan. Hör av dig om det händer igen.');
