import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { UserList } from './features/users/UserList';
import { CurrentUser } from './features/users/CurrentUser';
import { RequireUser } from './features/users/RequireUser';
import { SelectedUserProvider } from './features/users/SelectedUserProvider';
import { StartPage } from './features/start/StartPage';
import NewTicketForm from './features/tickets/NewTicketForm';

/**
 * Routern är en knutpunkt som alla stories rör. Håll det till en rad per sida,
 * och lägg själva sidan i sin egen mapp under features/.
 *
 * Alla sidor utom användarlistan ligger under <RequireUser />, så att man
 * skickas till listan om ingen användare är vald.
 */
export default function App() {
  return (
    <BrowserRouter>
      <SelectedUserProvider>
        <header className="app-header">
          <h1>Helpdesk</h1>
          <CurrentUser />
        </header>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<UserList />} />
            <Route element={<RequireUser />}>
              <Route path="/start" element={<StartPage />} />
              <Route path="/tickets/new" element={<NewTicketForm />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </SelectedUserProvider>
    </BrowserRouter>
  );
}
