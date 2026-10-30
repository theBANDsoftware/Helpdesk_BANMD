import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { categoryLabels, getMyTickets, statusLabels } from './ticketsApi';
import { formatDate } from '../../shared/formatDate';

/** Den valda användarens egna ärenden, nyaste först (TB-24). */
export default function MyTickets() {
  const query = useQuery({
    queryKey: ['tickets', 'mine'],
    queryFn: getMyTickets,
  });

  return (
    <section className="card">
      <h2>Mina ärenden</h2>
      <p>
        <Link to="/tickets/new" className="button">
          Anmäl ett fel
        </Link>
      </p>

      {query.isPending && <p>Hämtar ärenden …</p>}
      {query.isError && <p className="error">Kunde inte hämta ärendena.</p>}

      {query.isSuccess && query.data.length === 0 && <p>Du har inga ärenden än</p>}

      {query.isSuccess && query.data.length > 0 && (
        <ul className="ticket-list">
          {query.data.map((ticket) => (
            <li key={ticket.id}>
              <span className="ticket-title">{ticket.title}</span>
              <span className="ticket-meta">
                {categoryLabels[ticket.category]} · {statusLabels[ticket.status]} ·{' '}
                {formatDate(ticket.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
