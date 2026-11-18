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

const priorityPillClass: Record<TicketPriority, string> = {
  HIGH: 'pill pill-danger',
  MEDIUM: 'pill pill-warning',
  LOW: 'pill',
};

/** Alla ärenden från alla anmälare, nyaste först, filtrerade på status. För IT-ansvariga (TB-25, TB-31). */
export default function AllTickets() {
  const query = useQuery({
    queryKey: ['tickets', 'all'],
    queryFn: getAllTickets,
  });
  const [sortBy, setSortBy] = useState<'time' | 'priority'>('priority');
  const [filter, setFilter] = useState('OPEN');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useSelectedUser();
  const isItAdmin = user?.role === 'IT_ADMIN';

  const unassignedCount = (query.data ?? []).filter(
    (ticket) => ticket.status !== 'RESOLVED' && !ticket.assignedTo,
  ).length;

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const statusFilteredTickets = (query.data ?? []).filter((ticket) => {
    if (filter === 'ALL') return true;
    if (filter === 'OPEN') return ticket.status === 'NEW' || ticket.status === 'IN_PROGRESS';
    return ticket.status === filter;
  });

  const visibleTickets = statusFilteredTickets.filter((ticket) => {
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
          <h2 className="section-title">Alla ärenden</h2>
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
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">Alla</option>
            <option value="OPEN">Ej lösta</option>
            <option value="NEW">{statusLabels.NEW}</option>
            <option value="IN_PROGRESS">{statusLabels.IN_PROGRESS}</option>
            <option value="RESOLVED">{statusLabels.RESOLVED}</option>
            <option value="WITHDRAWN">{statusLabels.WITHDRAWN}</option>
          </select>
        </label>

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

      {query.isSuccess && query.data.length > 0 && statusFilteredTickets.length === 0 && (
        <p className="empty-state">Inga ärenden med den statusen</p>
      )}

      {query.isSuccess &&
        statusFilteredTickets.length > 0 &&
        visibleTickets.length === 0 &&
        normalizedSearch !== '' && <p className="empty-state">Inga ärenden matchar sökningen</p>}

      {visibleTickets.length > 0 && (
        <ul className="list">
          {sortedTickets.map((ticket) => (
            <li key={ticket.id} className="list-item">
              <div className="list-item-top">
                <Link to={'/tickets/' + ticket.id} className="item-link">
                  <span className="item-title">{ticket.title}</span>
                </Link>
                <span className={priorityPillClass[ticket.priority]}>
                  {priorityLabels[ticket.priority]}
                </span>
              </div>
              <span className="item-meta">
                {categoryLabels[ticket.category]} · {statusLabels[ticket.status]} ·{' '}
                {formatDate(ticket.createdAt)}
              </span>
              <span className="item-meta">
                Anmälare: {ticket.createdBy} · Tilldelad: {ticket.assignedTo ?? 'Ej tilldelad'}
              </span>
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