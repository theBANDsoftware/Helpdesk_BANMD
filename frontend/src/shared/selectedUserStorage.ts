/**
 * Den valda användaren sparas i webbläsarens localStorage, så att valet finns
 * kvar när sidan laddas om (beslut 10). Filen vet inget om hur en användare
 * ser ut, bara att den har ett id. Det räcker för apiClient.
 */
const STORAGE_KEY = 'helpdesk.selectedUser';

/** Skickas på window när valet tömts för att användaren inte finns i databasen (TB-60). */
export const SELECTED_USER_REMOVED_EVENT = 'helpdesk:selected-user-removed';

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

/**
 * Tömmer valet och berättar för appen att användaren inte finns längre (TB-60).
 *
 * apiClient ligger utanför React och kan inte nå SelectedUserProvider direkt,
 * så den skickar ett event på window i stället. Provider lyssnar och nollar sin
 * state, och då skickar RequireUser vidare till listan "Vem är du?".
 */
export function clearSelectedUserNotFound(): void {
  writeSelectedUser(null);
  try {
    window.dispatchEvent(new Event(SELECTED_USER_REMOVED_EVENT));
  } catch {
    // Finns inget window räcker det att valet är tömt i localStorage.
  }
}
