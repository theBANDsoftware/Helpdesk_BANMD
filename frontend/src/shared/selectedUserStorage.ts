/**
 * Den inloggade användaren och dess token sparas i webbläsarens localStorage, så att
 * man är inloggad även när sidan laddas om (TB-33). Filen vet inget om hur en
 * användare ser ut, bara att den ska sparas och läsas.
 */
const USER_KEY = 'helpdesk.selectedUser';
const TOKEN_KEY = 'helpdesk.token';

/** Skickas på window när man loggats ut för att användaren inte finns i databasen (TB-60). */
export const SELECTED_USER_REMOVED_EVENT = 'helpdesk:selected-user-removed';

export function readSelectedUser(): unknown {
  try {
    const saved = localStorage.getItem(USER_KEY);
    return saved === null ? null : JSON.parse(saved);
  } catch {
    // Trasig JSON, eller localStorage är avstängt i webbläsaren.
    return null;
  }
}

/** Token från inloggningen, eller null om ingen är inloggad. Skickas med på alla anrop. */
export function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** Sparar användaren och token efter en lyckad inloggning. */
export function saveLogin(user: { id: number }, token: string): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Går det inte att spara gäller inloggningen bara tills sidan laddas om.
  }
}

/** Tar bort användaren och token, vid utloggning eller när token inte gäller längre. */
export function clearLogin(): void {
  try {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Inget sparat att ta bort.
  }
}

/**
 * Loggar ut och berättar för appen att användaren inte finns längre (TB-60).
 *
 * apiClient ligger utanför React och kan inte nå SelectedUserProvider direkt,
 * så den skickar ett event på window i stället. Provider lyssnar och nollar sin
 * state, och då skickar RequireUser vidare till inloggningen.
 */
export function clearSelectedUserNotFound(): void {
  clearLogin();
  try {
    window.dispatchEvent(new Event(SELECTED_USER_REMOVED_EVENT));
  } catch {
    // Finns inget window räcker det att inloggningen är borttagen ur localStorage.
  }
}
