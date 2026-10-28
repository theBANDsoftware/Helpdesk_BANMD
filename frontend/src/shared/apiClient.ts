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

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`/api${path}`, {
    headers: withSelectedUser({ Accept: 'application/json' }),
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, body);
  }
  return body as T;
}

export async function apiPost<T>(path: string, requestBody: unknown): Promise<T> {
  const response = await fetch(`/api${path}`, {
    headers: withSelectedUser({ Accept: 'application/json', 'Content-Type': 'application/json' }),
    method: "POST",
    body: requestBody !== undefined ? JSON.stringify(requestBody): undefined,
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, body);
  }
  return body as T;
}
