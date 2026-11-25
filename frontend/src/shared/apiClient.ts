import { clearLogin, readToken } from './selectedUserStorage';

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

/**
 * Lägger till token från inloggningen i headern Authorization, så att backend vet
 * vem som gör anropet (TB-33). Är ingen inloggad skickas ingen header.
 */
function withToken(headers: Record<string, string>): Record<string, string> {
  const token = readToken();
  return token === null ? headers : { ...headers, Authorization: `Bearer ${token}` };
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
    throw new ApiError(response.status, body);
  }

  return body as T;
}
