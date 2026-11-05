import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { categoryLabels, getMyAssignedTickets, statusLabels } from './ticketsApi';
import { formatDate } from '../../shared/formatDate';

//Vy för IT-ansvariga: Visar alla ärenden tilldelade den inloggade användaren.

export default function MyAssignedTickets() {
  const query = useQuery({
    queryKey: ['tickets', 'assigned-to-me'],
    queryFn: getMyAssignedTickets,
  });

  return (
    <section className="card">
      <h2>Mina tilldelade ärenden</h2>

      {/* Visas under pågående API-anrop */}
      {query.isPending && <p>Hämtar ärenden …</p>}

      {/* Visas om nätverksanropet misslyckas eller backend svarar med fel */}
      {query.isError && <p className="error">Kunde inte hämta dina tilldelade ärenden.</p>}

      {/* Empty state om användaren inte har några tilldelade ärenden */}
      {query.isSuccess && query.data.length === 0 && <p>Du har inga tilldelade ärenden just nu.</p>}

      {/* Rendera listan med översiktsinformation när data finns */}
      {query.isSuccess && query.data.length > 0 && (
        <ul className="ticket-list">
          {query.data.map((ticket) => (
            <li key={ticket.id}>
                {/* Klick navigerar användaren till ärendets detaljvy */}
              <Link to={'/tickets/' + ticket.id}>
                <span className="ticket-title">
                  #{ticket.id} {ticket.title}
                </span>
              </Link>

              {/* Översiktlig metadata: Kategori, status och formaterat skapat-datum */}
              <span className="ticket-meta">
                {categoryLabels[ticket.category]} · {statusLabels[ticket.status]} ·{' '}
                {formatDate(ticket.createdAt)}
              </span>
              {/* Vem som ursprungligen anmälde ärendet */}
              <span className="ticket-meta">Anmälare: {ticket.createdBy}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
