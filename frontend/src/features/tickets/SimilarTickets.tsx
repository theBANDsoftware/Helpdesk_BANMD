import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getAllTickets } from './ticketsApi';
import { useSelectedUser } from '../users/selectedUserContext';

type Props = {
  title: string;
};

/** Visar högst 3 av mina öppna ärenden som liknar rubriken jag skriver (TB-82). */
export default function SimilarTickets({ title }: Props) {
  const { user } = useSelectedUser();
  const query = useQuery({
    queryKey: ['tickets', 'all'],
    queryFn: getAllTickets,
  });

  // Orden i rubriken, i små bokstäver. Korta ord som "på" och "en" räknas inte.
  const words = title
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length >= 3);

  if (!user || !query.data || title.trim().length < 3 || words.length === 0) {
    return null;
  }

  const similar = query.data
    .filter((ticket) => ticket.createdById === user.id)
    .filter((ticket) => ticket.status === 'NEW' || ticket.status === 'IN_PROGRESS')
    .filter((ticket) => words.some((word) => ticket.title.toLowerCase().includes(word)))
    .slice(0, 3);

  if (similar.length === 0) {
    return null;
  }

  return (
    <div className="similar-tickets">
      <p className="similar-tickets-title">Du har redan liknande ärenden</p>
      <ul>
        {similar.map((ticket) => (
          <li key={ticket.id}>
            {/* Ny flik, så att det jag skrivit i formuläret finns kvar */}
            <Link to={'/tickets/' + ticket.id} target="_blank" rel="noopener noreferrer">
              {ticket.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
