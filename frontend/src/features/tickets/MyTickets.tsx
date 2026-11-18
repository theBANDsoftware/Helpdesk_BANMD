import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { categoryLabels, getMyTickets, priorityLabels, statusLabels } from './ticketsApi';
import { formatDate } from '../../shared/formatDate';

/** Den valda användarens egna ärenden, nyaste först (TB-24). */
export default function MyTickets() {
  const query = useQuery({
    queryKey: ['tickets', 'mine'],
    queryFn: getMyTickets,
  });

  return (
    <section className="card">
      <h2 className="section-title">Mina ärenden</h2>
      <div className="btn-row">
        <Link to="/tickets/new" className="btn btn-primary">
          Anmäl ett fel
        </Link>
      </div>

      {query.isPending && <p>Hämtar ärenden …</p>}
      {query.isError && <p className="error">Kunde inte hämta ärendena.</p>}

      {query.isSuccess && query.data.length === 0 && (
        <p className="empty-state">Du har inga ärenden än</p>
      )}

      {query.isSuccess && query.data.length > 0 && (
        <ul className="list">
          {query.data.map((ticket) => (
            <li key={ticket.id} className="list-item">
              <Link to={'/tickets/' + ticket.id} className="item-link">
                <span className="item-title">{ticket.title}</span>
              </Link>
              <span className="item-meta">
                {categoryLabels[ticket.category]} · {statusLabels[ticket.status]} · Prioritet:{' '}
                {priorityLabels[ticket.priority]} · {formatDate(ticket.createdAt)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
