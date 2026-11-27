import { BrowserRouter, Outlet, Navigate, Route, Routes } from 'react-router';
import { LoginForm } from './features/users/LoginForm';
import { CurrentUser } from './features/users/CurrentUser';
import { RequireUser } from './features/users/RequireUser';
import { SelectedUserProvider } from './features/users/SelectedUserProvider';
import { StartPage } from './features/start/StartPage';
import { NavMenu } from './features/users/NavMenu';
import NewTicketForm from './features/tickets/NewTicketForm';
import TicketDetail from './features/tickets/TicketDetail';
import AllTickets from './features/tickets/Tickets';
import TicketStatistics from './features/tickets/TicketStatistics';
import FaqPage from './features/faq/FaqPage';
import Notifications from './features/notifications/Notifications';
import "./index.css"

/**
 * Routern är en knutpunkt som alla stories rör. Håll det till en rad per sida,
 * och lägg själva sidan i sin egen mapp under features/.
 *
 * Alla sidor utom inloggningen ligger under <RequireUser />, så att man
 * skickas till inloggningen om ingen är inloggad (TB-33).
 */
export default function App() {
  return (
    <BrowserRouter>
      <SelectedUserProvider>
        <Routes>
          {/* Startsida: Välj användare (ingen sidomeny) */}
          <Route
            path="/"
            element={
              <div className="login-shell">
                <header className="workspace-topbar">
                  <span className="workspace-brand">Helpdesk</span>
                </header>
                <main className="login-main">
                  <LoginForm />
                </main>
              </div>
            }
          />

          {/* Inloggat läge: Helskärm med toppbar + vänstersidomeny */}
          <Route element={<RequireUser />}>
            <Route
              element={
                <div className="workspace-shell">
                  <header className="workspace-topbar">
                    <span className="workspace-brand">Helpdesk</span>
                    <CurrentUser />
                  </header>
                  <div className="workspace-body">
                    <aside className="workspace-sidebar">
                      <NavMenu />
                    </aside>
                    <main className="workspace-main">
                      <Outlet />
                    </main>
                  </div>
                </div>
              }
            >
              <Route path="/start" element={<StartPage />} />
              <Route path="/tickets" element={<AllTickets />} />
              <Route path="/tickets/mine" element={<AllTickets />} />
              <Route path="/tickets/new" element={<NewTicketForm />} />
              <Route path="/tickets/:id" element={<TicketDetail />} />
              <Route path="/tickets/statistics" element={<TicketStatistics />} />
              <Route path="/faq" element={<FaqPage />} />
							<Route path="/notifications" element={<Notifications />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SelectedUserProvider>
    </BrowserRouter>
  );
}
