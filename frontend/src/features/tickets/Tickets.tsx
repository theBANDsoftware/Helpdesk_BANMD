import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllTickets, statusLabels } from './ticketsApi';
import type { TicketPriority } from '../../Types';
import TicketSearch from './TicketSearch';
import { useSelectedUser } from '../users/selectedUserContext';
import TicketListItem from './TicketListItem';

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

  const unassignedCount = (query.data ?? []).filter(
    (ticket) => ticket.status !== 'RESOLVED' && ticket.status !== 'WITHDRAWN' && !ticket.assignedTo,
  ).length;

  const normalizedSearch = searchTerm.trim().toLowerCase();

  // Filtrera på status
  let filteredTickets = (query.data ?? []).filter((ticket) => {
    if (typeFilter === 'ALL') return true;
    if (typeFilter === 'OPEN') return ticket.status === 'NEW' || ticket.status === 'IN_PROGRESS';
    return ticket.status === typeFilter;
  });
  
  // Filtrera efter tilldelning
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
      <div className="dashboard-hero">
        <div className="dashboard-hero-top">
          <h2 className="section-title">Ärenden</h2>
        </div>
        <TicketSearch value={searchTerm} onChange={setSearchTerm} />
      </div>

      {query.isSuccess && isItAdmin && (
        <p className={unassignedCount > 0 ? 'badge badge-warning' : 'badge'}>
          {unassignedText(unassignedCount)}
        </p>
      )}

      <div className="inline-row">
      <label className="inline-field">
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
        <label className="inline-field">
          Sortera efter
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'time' | 'priority')}>
            <option value="time">Tid</option>
            <option value="priority">Prioritet</option>
          </select>
        </label>
      </div>
      {query.isPending && <p>Hämtar ärenden …</p>}


      {query.isError && <p className="error">Kunde inte hämta ärendena.</p>}

      {query.isSuccess && query.data.length === 0 && (
        <p className="empty-state">Det finns inga ärenden än</p>
      )}

      {query.isSuccess && query.data.length > 0 && filteredTickets.length === 0 && (
        <p>Inga ärenden med den statusen</p>
      )}

      {query.isSuccess &&
        filteredTickets.length > 0 &&
        visibleTickets.length === 0 &&
        normalizedSearch !== '' && <p className="empty-state">Inga ärenden matchar sökningen</p>}

      {visibleTickets.length > 0 && (
        <ul className="list">
          {sortedTickets.map((ticket) => (
            <TicketListItem key={ticket.id} data={ticket}></TicketListItem>
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