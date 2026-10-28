import { BrowserRouter, Route, Routes } from 'react-router';
import { UserList } from './features/users/UserList';
import Ticket from './features/Tickets/Ticket';

/**
 * Routern är en knutpunkt som alla stories rör. Håll det till en rad per sida,
 * och lägg själva sidan i sin egen mapp under features/.
 */
export default function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <h1>Helpdesk</h1>
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<UserList />} />
        </Routes>
      </main>
      <Ticket></Ticket>
    </BrowserRouter>
  );
}
