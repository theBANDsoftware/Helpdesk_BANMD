import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { categoryLabels, getMyAssignedTickets, statusLabels } from './ticketsApi';
import { formatDate } from '../../shared/formatDate';

/** Vy för IT-ansvariga: Visar alla ärenden tilldelade den inloggade användaren. */
export default function MyAssignedTickets() {
  const query = useQuery({
    queryKey: ['tickets', 'assigned-to-me'],
    queryFn: getMyAssignedTickets,
  });

  return (
    <section className="card">
      <h2 className="section-title">Mina tilldelade ärenden</h2>

      {query.isPending && <p>Hämtar ärenden …</p>}
      {query.isError && <p className="error">Kunde inte hämta dina tilldelade ärenden.</p>}

      {query.isSuccess && query.data.length === 0 && (
        <p className="empty-state">Du har inga tilldelade ärenden just nu.</p>
      )}

      {query.isSuccess && query.data.length > 0 && (
        <ul className="list">
          {query.data.map((ticket) => (
            <li key={ticket.id} className="list-item">
              <Link to={'/tickets/' + ticket.id} className="item-link">
                <span className="item-title">
                  #{ticket.id} {ticket.title}
                </span>
              </Link>
              <span className="item-meta">
                {categoryLabels[ticket.category]} · {statusLabels[ticket.status]} ·{' '}
                {formatDate(ticket.createdAt)}
              </span>
              <span className="item-meta">Anmälare: {ticket.createdBy}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
