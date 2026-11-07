import { readSelectedUserId } from './selectedUserStorage';

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
 * Lägger till den valda användaren i headern X-User-Id, så att backend vet
 * vem som gör anropet (beslut 10). Är ingen vald skickas ingen header.
 */
function withSelectedUser(headers: Record<string, string>): Record<string, string> {
  const userId = readSelectedUserId();
  return userId === null ? headers : { ...headers, 'X-User-Id': String(userId) };
}

// Metod som hanterar alla HTTP-requests (GET, POST, PUT osv)
export async function apiRequest<T>(
  path: string,
  method: string = 'GET',
  requestBody?: unknown,
  customHeaders: Record<string, string> = {}
): Promise<T> {
  const isFormData = requestBody instanceof FormData;

  const headers = withSelectedUser({
    Accept: 'application/json',
    ...(!isFormData && requestBody !== undefined && {
      'Content-Type': 'application/json'
    }),
    ...customHeaders,
  });

  const response = await fetch(`/api${path}`, {
    method,
    headers,
    body: requestBody === undefined
      ? undefined
      : isFormData
        ? requestBody
        : method.toUpperCase() === 'GET'
          ? undefined
          : JSON.stringify(requestBody),
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, body);
  }

  return body as T;
}