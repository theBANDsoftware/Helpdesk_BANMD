/**
 * Den valda användaren sparas i webbläsarens localStorage, så att valet finns
 * kvar när sidan laddas om (beslut 10). Filen vet inget om hur en användare
 * ser ut, bara att den har ett id. Det räcker för apiClient.
 */
const STORAGE_KEY = 'helpdesk.selectedUser';

export function readSelectedUser(): unknown {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === null ? null : JSON.parse(saved);
  } catch {
    // Trasig JSON, eller localStorage är avstängt i webbläsaren.
    return null;
  }
}

export function writeSelectedUser(user: { id: number } | null): void {
  try {
    if (user === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  } catch {
    // Går det inte att spara gäller valet bara tills sidan laddas om.
  }
}

export function readSelectedUserId(): number | null {
  const user = readSelectedUser();
  if (typeof user === 'object' && user !== null && 'id' in user && typeof user.id === 'number') {
    return user.id;
  }
  return null;
}
