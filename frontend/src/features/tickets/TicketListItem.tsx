import { Link } from 'react-router';
import { formatDate } from '../../shared/formatDate';
import { categoryLabels, priorityLabels, statusLabels } from './ticketsApi';
import { useSelectedUser } from '../users/selectedUserContext';
import type { TicketPriority, TicketSummary } from '../../Types';

type Props = {
	data: TicketSummary;
};

const priorityPillClass: Record<TicketPriority, string> = {
  HIGH: 'pill pill-danger',
  MEDIUM: 'pill pill-warning',
  LOW: 'pill',
};

/** En rad i en ärendelista. IT-ansvariga ser även prioritet, anmälare och tilldelad (TB-68). */
export default function TicketListItem({ data }: Props) {
	const { user } = useSelectedUser();
	const isItAdmin = user?.role === 'IT_ADMIN';

	return (
    <>
		<li key={data.id} className="list-item">
			<div className="list-item-top">
			<Link to={'/tickets/' + data.id} className="item-link">
				<span className="item-title">{data.title}</span>
			</Link>
			<span className={priorityPillClass[data.priority]}>
				{priorityLabels[data.priority]}
			</span>
			</div>
			<span className="item-meta">
			{categoryLabels[data.category]} · {statusLabels[data.status]} ·{' '}
			{formatDate(data.createdAt)}
			</span>
			{isItAdmin && (
        <span className="item-meta">
        Anmälare: {data.createdBy} · Tilldelad: {data.assignedTo ?? 'Ej tilldelad'}
        </span>
      )}
		</li>


		{/* <li>
			<Link to={'/tickets/' + data.id}>
				<span className="ticket-title">{data.title}</span>
			</Link>
			<span className="ticket-meta">
				{categoryLabels[data.category]} · {statusLabels[data.status]} ·{' '}
				{isItAdmin && <>Prioritet: {priorityLabels[data.priority]} · </>}
				{formatDate(data.createdAt)}
			</span>
			{isItAdmin && (
				<span className="ticket-meta">
					Anmälare: {data.createdBy} · Tilldelad: {data.assignedTo ?? 'Ej tilldelad'}
				</span>
			)}
		</li> */}
    </>
	);
}
