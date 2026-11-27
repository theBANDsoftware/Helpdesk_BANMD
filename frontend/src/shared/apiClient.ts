import { clearSelectedUserNotFound, clearLogin, readToken } from './selectedUserStorage';

/**
 * Gemensam funktion för alla anrop till backend. Varje funktion (features/...)
 * har en egen api-fil som använder den här, i stället för att anropa fetch själv.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`Anropet misslyckades med status ${status}`);
    this.status = status;
    this.body = body;
  }
}

/** Backend sätter fältet code till det här när den inloggade användaren inte finns (TB-60). */
const USER_NOT_FOUND = 'USER_NOT_FOUND';

/**
 * Lägger till token från inloggningen i headern Authorization, så att backend vet
 * vem som gör anropet (TB-33). Är ingen inloggad skickas ingen header.
 */
function withToken(headers: Record<string, string>): Record<string, string> {
  const token = readToken();
  return token === null ? headers : { ...headers, Authorization: `Bearer ${token}` };
}

/**
 * Sant bara när 404 handlar om den inloggade användaren, t.ex. om den tagits bort
 * ur databasen. Vi läser fältet code och inte felmeddelandet, så att texten går
 * att ändra utan att den här kontrollen slutar fungera. Ett 404 för ett ärende
 * som inte finns saknar fältet och loggar därför aldrig ut (TB-60).
 */
function isUserNotFound(status: number, body: unknown): boolean {
  if (status !== 404 || typeof body !== 'object' || body === null) {
    return false;
  }
  return (body as { code?: unknown }).code === USER_NOT_FOUND;
}

// Metod som hanterar alla HTTP-requests (GET, POST, PUT osv)
export async function apiRequest<T>(
  path: string,
  method: string = 'GET',
  requestBody?: unknown,
  customHeaders: Record<string, string> = {},
): Promise<T> {
  const isFormData = requestBody instanceof FormData;

  const headers = withToken({
    Accept: 'application/json',
    ...(!isFormData &&
      requestBody !== undefined && {
        'Content-Type': 'application/json',
      }),
    ...customHeaders,
  });

  const response = await fetch(`/api${path}`, {
    method,
    headers,
    body:
      requestBody === undefined
        ? undefined
        : isFormData
          ? requestBody
          : method.toUpperCase() === 'GET'
            ? undefined
            : JSON.stringify(requestBody),
  });

  const body: unknown = await response.json().catch(() => null);

  // 401 betyder att token saknas, är fel eller har gått ut (efter 8 timmar).
  // Då loggas man ut och skickas till inloggningen. Vid själva inloggningen
  // betyder 401 fel lösenord, och då visar inloggningssidan felet i stället.
  if (response.status === 401 && path !== '/auth/login') {
    clearLogin();
    window.location.assign('/');
  }

  if (!response.ok) {
    // Finns inte användaren längre loggas man ut och skickas till inloggningen,
    // i stället för att fastna på ett felmeddelande (TB-60).
    if (isUserNotFound(response.status, body)) {
      clearSelectedUserNotFound();
    }
    throw new ApiError(response.status, body);
  }

  return body as T;
}
