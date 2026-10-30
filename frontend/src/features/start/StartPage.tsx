import { Link } from 'react-router';
import { useSelectedUser } from '../users/selectedUserContext';

/**
 * Enkel startsida efter valet av användare. Vart man skickas beroende på roll
 * kommer med "Se mina ärenden" (TB-24) och "Se alla ärenden" (TB-25).
 */

export function StartPage() {
  const { user } = useSelectedUser();

  return (
    <section className="card">
      <h2>Hej {user?.name}!</h2>
      <p>
        <Link to="/tickets/new">Anmäl ett fel</Link>
      </p>

      {/* Länk till alla ärenden för IT_ADMIN */}
      {user?.role === 'IT_ADMIN' && (
        <p>
          <Link to="/tickets">Se alla ärenden</Link>
        </p>
      )}
    </section>
  );
}
