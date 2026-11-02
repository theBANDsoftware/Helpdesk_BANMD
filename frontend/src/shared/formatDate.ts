/** Gör om en ISO-sträng från backend, t.ex. "2026-10-21T13:10:38Z", till "2026-10-21 14:10". */
export function formatDate(value: string): string {
  return new Date(value).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' });
}
