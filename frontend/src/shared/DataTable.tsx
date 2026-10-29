import type { ReactNode } from 'react';

type Props = {
	data: [string, ReactNode][];
};

export function DataTable({ data }: Props) {
	return (
		<table className="data-table">
			<tbody>
				{data.map(([label, value]) => (
					<tr key={label}>
						<th scope="row">{label}</th>
						<td>{value}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

export function setColumns(data: object, columns: Record<string, string>, filter: string[] = []): [string, ReactNode][] {
	return Object.entries(data)
		.filter(([key]) => columns[key] && !filter.includes(key))
		.map(([key, value]) => [columns[key], isIsoDate(value) ? formatDate(value) : ((!value)?"-":value)]);
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

function isIsoDate(value: unknown): value is string {
	return typeof value === 'string' && ISO_DATE.test(value);
}

function formatDate(value: string): string {
	return new Date(value).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' });
}