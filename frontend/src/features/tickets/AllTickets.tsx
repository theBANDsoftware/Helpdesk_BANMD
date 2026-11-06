import { useQuery } from '@tanstack/react-query';
import { categoryLabels, getAllTickets, priorityLabels, statusLabels } from './ticketsApi';
import { formatDate } from '../../shared/formatDate';
import { Link } from 'react-router';
import { useState } from 'react';
import type { TicketPriority } from '../../Types';

const priorityOrder: Record<TicketPriority, number> = {
	HIGH: 0,
	MEDIUM: 1,
	LOW: 2,
};

/** Alla ärenden från alla anmälare, nyaste först. För IT-ansvariga */
export default function AllTickets() {
  const query = useQuery({
    queryKey: ['tickets', 'all'],
    queryFn: getAllTickets,
  });
  const [sortBy, setSortBy] = useState<'time' | 'priority'>('priority');
  const sortedTickets = query.isSuccess
      ? [...query.data].sort((a, b) => {
        if (sortBy === 'priority') {
          const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
          if (diff !== 0) return diff;
        }
        return b.createdAt.localeCompare(a.createdAt);
      })
      : [];
  return (
    <section className="card">
      <h2>Alla ärenden</h2>

      {query.isPending && <p>Hämtar ärenden …</p>}
      {query.isError && <p className="error">Kunde inte hämta ärendena.</p>}

      {query.isSuccess && query.data.length === 0 && <p>Det finns inga ärenden än</p>}

      {query.isSuccess && query.data.length > 0 && (
        <>
          <p>Sortera efter: <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'time' | 'priority')}>
            <option value="time">Tid</option>
            <option value="priority">Prioritet</option>
          </select></p>
          <ul className="ticket-list">
            {sortedTickets.map((ticket) => (
              <li key={ticket.id}>
              <Link to={"/tickets/"+ticket.id}><span className="ticket-title">{ticket.title}</span></Link>
                <span className="ticket-meta">
                  {categoryLabels[ticket.category]} · {statusLabels[ticket.status]} · Prioritet: {priorityLabels[ticket.priority]} ·{' '}
                  {formatDate(ticket.createdAt)}
                </span>
                <span className="ticket-meta">
                  Anmälare: {ticket.createdBy} · Tilldelad: {ticket.assignedTo ?? 'Ej tilldelad'}
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
