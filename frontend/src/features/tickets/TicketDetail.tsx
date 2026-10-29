import { Link, useLocation, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { ticketColumns, getTicket, categoryLabels, statusLabels } from './ticketsApi';
import { DataTable, setColumns} from "../../shared/DataTable";
import { ApiError } from '../../shared/apiClient';

/** Visar all information om ett ärende. */
export default function TicketDetail() {
	const { id } = useParams();
	const ticketId = Number(id);
	const location = useLocation();
	const backTo: string = location.state?.from ?? '/start';

	const query = useQuery({
		queryKey: ['tickets', ticketId],
		queryFn: () => getTicket(ticketId),
		retry: (failureCount, error) => !(error instanceof ApiError && error.status === 404) && failureCount < 3,
		enabled: Number.isInteger(ticketId),
	});
	if (!Number.isInteger(ticketId)) {
		return (
			<section className="card">
				<Link to={backTo}>&lt; Tillbaka</Link>
				<p className="error">Ärendet hittades inte</p>
			</section>
		);
	}
	return (
		<section className="card">
			<Link to={backTo}>&lt; Tillbaka</Link>
			{query.isPending && <p>Hämtar ärendet …</p>}
			{query.isError && query.error instanceof ApiError && query.error.status === 404 && (
				<p className="error">Ärendet hittades inte</p>
			)}
			{query.isSuccess && (
				<>
					<h2>{query.data.title}</h2>
					<p>{query.data.description}</p>
					<DataTable data={setColumns({
						...query.data,
						category: categoryLabels[query.data.category],
						status: statusLabels[query.data.status],
						assignedTo: query.data.assignedTo ?? 'Ej tilldelad',
					}, ticketColumns, ["title", "description"])}></DataTable>
				</>
			)}
		</section>
	);
}
