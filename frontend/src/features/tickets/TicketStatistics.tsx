import { useQuery } from '@tanstack/react-query';
import { categoryLabels, getTicketcountByCategory } from './ticketsApi';
import { DataTable } from '../../shared/DataTable';
import { Navigate } from 'react-router';
import { useSelectedUser } from '../users/selectedUserContext';

/** Statistik över öppna ärenden (TB-36). */
export default function TicketStatistics() {
	const { user } = useSelectedUser();
	const isItAdmin = user?.role === 'IT_ADMIN';
	const query = useQuery({
		queryKey: ['tickets', 'statistics'],
		queryFn: getTicketcountByCategory,
		enabled: isItAdmin
	});
	if (!isItAdmin) {
		return <Navigate to="/start" replace />;
	}
	return (
		<section className="card">
			<h2>Statistik</h2>
			{query.isPending && <p>Hämtar statistik …</p>}
			{query.isError && <p className="error">Kunde inte hämta statistik.</p>}

			{query.isSuccess && (
				<>
					<DataTable
						data={query.data.map(({ category, count }) => [categoryLabels[category], count])}></DataTable>
					<p>Totalt antal öppna ärenden: {query.data.reduce((sum, c) => sum + c.count, 0)}</p>
				</>
			)}
		</section>
	);
}
