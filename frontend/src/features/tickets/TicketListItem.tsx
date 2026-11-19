import { useState } from 'react';
import { Link } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate, timestampToTimestring } from '../../shared/formatDate';
import { assignTicket, categoryLabels, priorityLabels, statusLabels } from './ticketsApi';
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

	const queryClient = useQueryClient();
	const [takeError, setTakeError] = useState<string | null>(null);

	// Knappen visas bara för IT-ansvariga, på otilldelade ärenden som inte är avslutade (TB-62)
	const canTake =
		isItAdmin &&
		data.assignedToId === null &&
		(data.status === 'NEW' || data.status === 'IN_PROGRESS');

	const takeMutation = useMutation({
		mutationFn: () => {
			if (!user) throw new Error('Ingen användare är vald');
			return assignTicket(data.id, user.id, user.id);
		},
		onSuccess: () => {
			setTakeError(null);
			queryClient.invalidateQueries({ queryKey: ['tickets'] });
		},
		onError: () => {
			setTakeError('Kunde inte ta ärendet. Försök igen.');
		},
	});
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
			{timestampToTimestring(data.createdAt)}
			</span>
			{isItAdmin && (
        <span className="item-meta">
        Anmälare: {data.createdBy} · Tilldelad: {data.assignedTo ?? 'Ej tilldelad'}
        </span>
      )}
	  {canTake && (
				<div className="btn-row">
					<button
						type="button"
						className="btn"
						onClick={() => takeMutation.mutate()}
						disabled={takeMutation.isPending}
					>
						{takeMutation.isPending ? 'Tar ärendet …' : 'Ta ärendet'}
					</button>
				</div>
			)}
				{takeError && <p className="error">{takeError}</p>}
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
