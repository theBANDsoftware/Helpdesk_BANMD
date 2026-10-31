import { useQuery } from '@tanstack/react-query';
import { categoryLabels, getAllTickets, statusLabels } from './ticketsApi';
import { formatDate } from '../../shared/formatDate';

/** Alla ärenden från alla anmälare, nyaste först. För IT-ansvariga */
export default function AllTickets() {
  const query = useQuery({
    queryKey: ['tickets', 'all'],
    queryFn: getAllTickets,
  });

  return (
    <section className="card">
      <h2>Alla ärenden</h2>

      {query.isPending && <p>Hämtar ärenden …</p>}
      {query.isError && <p className="error">Kunde inte hämta ärendena.</p>}

      {query.isSuccess && query.data.length === 0 && <p>Det finns inga ärenden än</p>}

      {query.isSuccess && query.data.length > 0 && (
        <ul className="ticket-list">
          {query.data.map((ticket) => (
            <li key={ticket.id}>
              <span className="ticket-title">{ticket.title}</span>
              <span className="ticket-meta">
                {categoryLabels[ticket.category]} · {statusLabels[ticket.status]} ·{' '}
                {formatDate(ticket.createdAt)}
              </span>
              <span className="ticket-meta">
                Anmälare: {ticket.createdBy} · Tilldelad: {ticket.assignedTo ?? 'Ej tilldelad'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
