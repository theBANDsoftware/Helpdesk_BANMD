import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSelectedUser } from './selectedUserContext';
import { roleLabels } from './usersApi';

/** Namn, roll och "Logga ut" i sidhuvudet (TB-33). Visas bara när någon är inloggad. */
export function CurrentUser() {
  const { user, logOut } = useSelectedUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  if (user === null) {
    return null;
  }

  function handleLogOut() {
    logOut();
    // Töm allt som hämtats, så att nästa person som loggar in inte ser den förras ärenden
    queryClient.clear();
    navigate('/');
  }

  return (
    <div className="inline-field">
      <span>
        {user.name} <span className="pill">{roleLabels[user.role]}</span>
      </span>
      <button type="button" className="btn" onClick={handleLogOut}>
        Logga ut
      </button>
    </div>
  );
}
