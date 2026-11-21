import { useState } from 'react';
import { Link } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timestampToTimestring } from '../../shared/formatDate';
import { assignTicket, categoryLabels, priorityLabels, statusLabels } from './ticketsApi';
import { useSelectedUser } from '../users/selectedUserContext';
import Icon from "../../shared/Icon";
import type { TicketPriority, TicketSummary } from '../../Types';

type Props = {
	data: TicketSummary;
	/** Skickas bara från listan för IT-ansvariga. Då går anmälarens namn att klicka på (TB-83). */
	onReporterClick?: (id: number, name: string) => void;
};

const priorityPillClass: Record<TicketPriority, string> = {
  HIGH: 'pill pill-danger',
  MEDIUM: 'pill pill-warning',
  LOW: 'pill',
};

/** En rad i en ärendelista. IT-ansvariga ser även prioritet, anmälare och tilldelad (TB-68). */
export default function TicketListItem({ data, onReporterClick }: Props) {
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

  const createdAt = timestampToTimestring(data.createdAt);
  const oldTicketWarning = isItAdmin && createdAt.warning && data.status != "WITHDRAWN" && data.status != "RESOLVED";
  const warningIcon = <Icon name="schedule" error></Icon>;

	return (
		<li key={data.id} className={"list-item"+((oldTicketWarning && isItAdmin)?" list-item-warning":"")}>
			<div className="list-item-top">
			<Link to={'/tickets/' + data.id} className="item-link">
				<span className="item-title">{(oldTicketWarning && isItAdmin)?warningIcon:""}{data.title}</span>
			</Link>
			<span className={priorityPillClass[data.priority]}>
				{priorityLabels[data.priority]}
			</span>
			</div>
			<span className="item-meta">
			{categoryLabels[data.category]} · {statusLabels[data.status]} ·{' '}
			{createdAt.time}
			</span>
			{isItAdmin && (
        <span className="item-meta">
          Anmälare:{' '}
          {onReporterClick ? (
            <button
              type="button"
              className="link-button"
              onClick={() => onReporterClick(data.createdById, data.createdBy)}
            >
              {data.createdBy}
            </button>
          ) : (
            data.createdBy
          )}{' '}
          · Tilldelad: {data.assignedTo ?? 'Ej tilldelad'}
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
	);
}
