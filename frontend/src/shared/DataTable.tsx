import type { ReactNode } from 'react';
import { formatDate } from './formatDate';

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

export function setColumns(
	data: object,
	columns: Record<string, string>,
	filter: string[] = [],
): [string, ReactNode][] {
	const values = data as Record<string, ReactNode>;

	return Object.entries(columns)
		.filter(([key]) => key in values && !filter.includes(key))
		.map(([key, label]) => {
			const value = values[key];
			return [label, isIsoDate(value) ? formatDate(value) : !value ? '-' : value];
		});
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && ISO_DATE.test(value);
}
