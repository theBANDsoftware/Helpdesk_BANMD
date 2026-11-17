import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { categoryLabels, getAllTickets, priorityLabels, statusLabels } from './ticketsApi';
import { formatDate } from '../../shared/formatDate';
import { Link } from 'react-router';
import type { TicketPriority } from '../../Types';
import TicketSearch from './TicketSearch';
import { useSelectedUser } from '../users/selectedUserContext';

const priorityOrder: Record<TicketPriority, number> = {
  HIGH: 0,
  MEDIUM: 1,
  LOW: 2,
};

/** Alla ärenden från alla anmälare, nyaste först, filtrerade på status. För IT-ansvariga (TB-25, TB-31). */
export default function AllTickets() {
  const query = useQuery({
    queryKey: ['tickets', 'all'],
    queryFn: getAllTickets,
  });
  const [sortBy, setSortBy] = useState<'time' | 'priority'>('priority');
  const [typeFilter, setTypeFilter] = useState('OPEN');
  const [assignedFilter, setAssignedFilter] = useState("mine");
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useSelectedUser();
  const isItAdmin = user?.role === 'IT_ADMIN';

  // Ej tilldelade ärenden räknas på hela listan, oavsett statusfilter och sökning.
  // Lösta ärenden räknas inte (TB-52).
  const unassignedCount = (query.data ?? []).filter(
    (ticket) => ticket.status !== 'RESOLVED' && !ticket.assignedTo,
  ).length;

  const normalizedSearch = searchTerm.trim().toLowerCase();

  // Filtrera på status
  let filteredTickets = (query.data ?? []).filter((ticket) => {
    "WITHDRAWN"
    if (typeFilter === 'ALL') return true;
    if (typeFilter === 'OPEN') return ticket.status === 'NEW' || ticket.status === 'IN_PROGRESS';
    return ticket.status === typeFilter;
  });
  
  if(isItAdmin) {
    filteredTickets = filteredTickets.filter((ticket) => {
      if (assignedFilter === "mine") return ticket.assignedToId === user?.id;
      if (assignedFilter === "unassigned") return ticket.assignedToId === null;
      return true;
    });
  }

  // Filtrera på rubrik eller anmälare (skiftlägesokänsligt)
  const visibleTickets = filteredTickets.filter((ticket) => {
    if (!normalizedSearch) return true;
    const titleMatch = ticket.title.toLowerCase().includes(normalizedSearch);
    const creatorMatch = ticket.createdBy.toLowerCase().includes(normalizedSearch);
    return titleMatch || creatorMatch;
  });

  const sortedTickets = query.isSuccess
    ? [...visibleTickets].sort((a, b) => {
        if (sortBy === 'priority') {
          const diff = priorityOrder[a.priority] - priorityOrder[b.priority];
          if (diff !== 0) return diff;
        }
        return b.createdAt.localeCompare(a.createdAt);
      })
    : [];

  return (
    <section className="card">
      <h2>Ärenden</h2>

      {query.isSuccess && isItAdmin && (
        <p className={unassignedCount > 0 ? 'unassigned-count has-unassigned' : 'unassigned-count'}>
          {unassignedText(unassignedCount)}
        </p>
      )}

      {/* Sökkomponent */}
      <TicketSearch value={searchTerm} onChange={setSearchTerm} />
      <label className="status-filter">
        Visa
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="ALL">Alla</option>
          <option value="OPEN">Ej lösta</option>
          <option value="NEW">{statusLabels.NEW}</option>
          <option value="IN_PROGRESS">{statusLabels.IN_PROGRESS}</option>
          <option value="RESOLVED">{statusLabels.RESOLVED}</option>
          <option value="WITHDRAWN">{statusLabels.WITHDRAWN}</option>
        </select>
      </label>
      {isItAdmin && (
      <div className="filterCategory">
        <h3>Tilldelning</h3>
        {[["all", "Alla"], ["mine", "Mina"], ["unassigned", "Ingen"]].map(type => {
          return <label key={type[0]}>{type[1]}
          <input type="radio" name="personal" value={type[0]} checked={assignedFilter === type[0]} onChange={(e) => setAssignedFilter(e.target.value)} />
        </label>
        })}
      </div>
      )}
      <p>
        Sortera efter:{' '}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'time' | 'priority')}>
          <option value="time">Tid</option>
          <option value="priority">Prioritet</option>
        </select>
      </p>
      {query.isPending && <p>Hämtar ärenden …</p>}

      {query.isError && <p className="error">Kunde inte hämta ärendena.</p>}

      {query.isSuccess && query.data.length === 0 && <p>Det finns inga ärenden än</p>}

      {query.isSuccess && query.data.length > 0 && filteredTickets.length === 0 && (
        <p>Inga ärenden med den statusen</p>
      )}

      {query.isSuccess &&
        filteredTickets.length > 0 &&
        visibleTickets.length === 0 &&
        normalizedSearch !== '' && <p>Inga ärenden matchar sökningen</p>}

      {visibleTickets.length > 0 && (
        <ul className="ticket-list">
          {sortedTickets.map((ticket) => (
            <li key={ticket.id}>
              <Link to={'/tickets/' + ticket.id}>
                <span className="ticket-title">{ticket.title}</span>
              </Link>
              <span className="ticket-meta">
                {categoryLabels[ticket.category]} · {statusLabels[ticket.status]} · Prioritet:{' '}
                {priorityLabels[ticket.priority]} · {formatDate(ticket.createdAt)}
              </span>
              {isItAdmin && (
                <span className="ticket-meta">
                  Anmälare: {ticket.createdBy} · Tilldelad: {ticket.assignedTo ?? 'Ej tilldelad'}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function unassignedText(count: number): string {
  if (count === 0) return 'Alla ärenden är tilldelade';
  if (count === 1) return '1 ärende är inte tilldelat';
  return `${count} ärenden är inte tilldelade`;
}
