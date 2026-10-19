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

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`/api${path}`, {
    headers: { Accept: 'application/json' },
  });
  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(response.status, body);
  }
  return body as T;
}
