/** Gör om en ISO-sträng från backend, t.ex. "2026-10-21T13:10:38Z", till "2026-10-21 14:10". */
export function formatDate(value: string): string {
  return new Date(value).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' });
}

// Enheter från störst till minst: [singular, plural, antal millisekunder]
const timeUnits: [string, string, number][] = [
	['år', 'år', 365 * 24 * 60 * 60 * 1000],
	['månad', 'månader', 30 * 24 * 60 * 60 * 1000],
	['vecka', 'veckor', 7 * 24 * 60 * 60 * 1000],
	['dag', 'dagar', 24 * 60 * 60 * 1000],
	['timme', 'timmar', 60 * 60 * 1000],
	['minut', 'minuter', 60 * 1000],
];

/** Gör om en ISO-sträng till hur länge sedan det var i största hela enheten, t.ex. "3 timmar sedan". */
export function timestampToTimestring(value: string): string {
	const elapsed = Date.now() - new Date(value).getTime();

	for (const [singular, plural, ms] of timeUnits) {
		const count = Math.floor(elapsed / ms);
		if (count >= 1) {
			return `${count} ${count === 1 ? singular : plural} sedan`;
		}
	}
	return 'Nyss';
}