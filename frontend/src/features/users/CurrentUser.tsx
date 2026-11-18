import { useNavigate } from 'react-router';
import { useSelectedUser } from './selectedUserContext';
import { roleLabels } from './usersApi';

/** Namn, roll och "Byt användare" i sidhuvudet (AK 2 och 4). Visas bara när någon är vald. */
export function CurrentUser() {
  const { user, clearUser } = useSelectedUser();
  const navigate = useNavigate();

  if (user === null) {
    return null;
  }

  function switchUser() {
    clearUser();
    navigate('/');
  }

  return (
    <div className="inline-field">
      <span>
        {user.name} <span className="pill">{roleLabels[user.role]}</span>
      </span>
      <button type="button" className="btn" onClick={switchUser}>
        Byt användare
      </button>
    </div>
  );
}
