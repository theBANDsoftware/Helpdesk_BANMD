import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ticketColumns,
  getTicket,
  categoryLabels,
  statusLabels,
  assignTicket,
  updateTicketStatus,
  updateTicketPriority,
  priorityLabels,
  type StatusTicket,
} from './ticketsApi';
import { DataTable, setColumns } from '../../shared/DataTable';
import { ApiError } from '../../shared/apiClient';
import { useSelectedUser } from '../users/selectedUserContext';
import { getUsers } from '../users/usersApi';
import type { TicketPriority } from '../../Types';
import TicketComments from '../comments/TicketComments';
import TicketAttachments from '../attachments/TicketAttachments';
import TicketOwnerActions from './TicketOwnerActions';

/** Visar all information om ett ärende. */
export default function TicketDetail() {
  const { id } = useParams();
  const ticketId = Number(id);
  const navigate = useNavigate();

  const { user: currentUser } = useSelectedUser();
  const queryClient = useQueryClient();
  const [assignError, setAssignError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [priorityError, setPriorityError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['tickets', ticketId],
    queryFn: () => getTicket(ticketId),
        retry: (failureCount, error) =>
      !(error instanceof ApiError && (error.status === 404 || error.status === 403)) &&
      failureCount < 3,
      enabled: Number.isInteger(ticketId),
  });

  // Hämta listan med användare om den inloggade är IT_ADMIN
  const isItAdmin = currentUser?.role === 'IT_ADMIN';
  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    enabled: isItAdmin,
  });

  // Mutation för att ändra eller ta bort tilldelning
  const assignMutation = useMutation({
    mutationFn: (assignedToUserId: number | null) => {
      if (!currentUser) throw new Error('Ingen användare är vald');
      return assignTicket(ticketId, assignedToUserId, currentUser.id);
    },
    onSuccess: (updatedTicket) => {
      setAssignError(null);
      queryClient.setQueryData(['tickets', ticketId], updatedTicket);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (error) => {
      if (
        error instanceof ApiError &&
        typeof error.body === 'object' &&
        error.body &&
        'error' in error.body
      ) {
        setAssignError((error.body as { error: string }).error);
      } else {
        setAssignError('Kunde inte ändra tilldelning.');
      }
    },
  });

  // Mutation för att ändra status (TB-27). Samma mönster som tilldelningen ovan.
  const statusMutation = useMutation({
    mutationFn: (status: StatusTicket) => {
      if (!currentUser) throw new Error('Ingen användare är vald');
      return updateTicketStatus(ticketId, status, currentUser.id);
    },
    onSuccess: (updatedTicket) => {
      setStatusError(null);
      queryClient.setQueryData(['tickets', ticketId], updatedTicket);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (error) => {
      if (
        error instanceof ApiError &&
        typeof error.body === 'object' &&
        error.body &&
        'error' in error.body
      ) {
        setStatusError((error.body as { error: string }).error);
      } else {
        setStatusError('Kunde inte ändra status.');
      }
    },
  });

  // Mutation till prioritering
  const priorityMutation = useMutation({
    mutationFn: (priority: TicketPriority) => {
      if (!currentUser) throw new Error('Ingen användare är vald');
      return updateTicketPriority(ticketId, priority, currentUser.id);
    },
    onSuccess: (updatedTicket) => {
      setPriorityError(null);
      queryClient.setQueryData(['tickets', ticketId], updatedTicket);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (error) => {
      if (
        error instanceof ApiError &&
        typeof error.body === 'object' &&
        error.body &&
        'error' in error.body
      ) {
        setPriorityError((error.body as { error: string }).error);
      } else {
        setPriorityError('Kunde inte ändra status.');
      }
    },
  });

  if (!Number.isInteger(ticketId)) {
    return (
      <section className="card">
        <a href="#" onClick={() => navigate(-1)} className="link">
          &lt; Tillbaka
        </a>
        <p className="error">Ärendet hittades inte</p>
      </section>
    );
  }

  // Filtrera bort anställda (EMPLOYEE) så enbart IT_ADMIN visas
  const itAdmins = usersQuery.data?.filter((u) => u.role === 'IT_ADMIN') ?? [];
  const currentAssignedAdmin = itAdmins.find((admin) => admin.name === query.data?.assignedTo);

  function handleAssignChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const targetUserId = value === '' ? null : Number(value);
    assignMutation.mutate(targetUserId);
  }

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    statusMutation.mutate(e.target.value as StatusTicket);
  }

  function handlePriorityChange(e: React.ChangeEvent<HTMLSelectElement>) {
    priorityMutation.mutate(e.target.value as TicketPriority);
  }

  return (
    <>
      {query.isSuccess && (
        <section>
          <TicketComments
            ticketId={ticketId}
            canComment={isItAdmin || query.data.createdById === currentUser?.id}
          />
        </section>
      )}
      <section className="card">
        <a href="#" onClick={() => navigate(-1)} className="link">
          &lt; Tillbaka
        </a>
        {query.isPending && <p>Hämtar ärendet …</p>}
                {query.isError && query.error instanceof ApiError && query.error.status === 404 && (
          <p className="error">Ärendet hittades inte</p>
        )}
        {query.isError && query.error instanceof ApiError && query.error.status === 403 && (
          <p className="error">Du har inte behörighet att se det här ärendet</p>
        )}
        {query.isSuccess && (
          <>
            <h2>{query.data.title}</h2>
            <p>{query.data.description}</p>
            <DataTable
              data={setColumns(
                {
                  ...query.data,
                  category: categoryLabels[query.data.category],
                  status: statusLabels[query.data.status],
                  priority: priorityLabels[query.data.priority],
                  assignedTo: query.data.assignedTo ?? 'Ej tilldelad',
                },
                ticketColumns,
                ['title', 'description'],
              )}
            ></DataTable>

            {/* Ändra eller ta tillbaka. Bara anmälaren, och bara när status är Ny (TB-51). */}
            {query.data.createdById === currentUser?.id && query.data.status === 'NEW' && (
              <TicketOwnerActions ticket={query.data} />
            )}

            {/* Bifogade skärmdumpar (TB-35). Anmälaren och IT-ansvariga får ladda upp. */}
            <TicketAttachments
              ticketId={ticketId}
              canUpload={isItAdmin || currentUser?.name === query.data.createdBy}
            />

            {/* Val för status – visas bara för IT-ansvariga (TB-27, AK 3) */}
            {isItAdmin && (
              <div
                className="status-control"
                style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #333' }}
              >
                <label
                  htmlFor="statusSelect"
                  style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
                >
                  Status
                </label>
                <select
                  id="statusSelect"
                  value={query.data.status}
                  onChange={handleStatusChange}
                  disabled={statusMutation.isPending}
                >
                  {/* Återkallad kan IT inte välja, bara anmälaren kan ta tillbaka (TB-51).
                      Den visas bara när ärendet redan är återkallat. */}
                  {(Object.keys(statusLabels) as StatusTicket[])
                    .filter((status) => status !== 'WITHDRAWN' || query.data.status === 'WITHDRAWN')
                    .map((status) => (
                      <option key={status} value={status} disabled={status === 'WITHDRAWN'}>
                        {statusLabels[status]}
                      </option>
                    ))}
                </select>
                {statusMutation.isPending && <span> Sparar …</span>}
                {statusError && <p className="error">{statusError}</p>}
              </div>
            )}

          {/* Val för prioritet */}
          {isItAdmin && (
            <><div
              className="status-control"
              style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #333' }}
            >
              <label
                htmlFor="prioritySelect"
                style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
              >
                Prioritet
              </label>
              <select
                id="prioritySelect"
                value={query.data.priority}
                onChange={handlePriorityChange}
                disabled={priorityMutation.isPending}
              >
                {(Object.keys(priorityLabels) as TicketPriority[]).map((priority) => (
                  <option key={priority} value={priority}>
                    {priorityLabels[priority]}
                  </option>
                ))}
              </select>
              {priorityMutation.isPending && <span> Sparar …</span>}
              {priorityError && <p className="error">{priorityError}</p>}
            </div>

          {/* Val för tilldelad – visas bara för IT-ansvariga */}
            <div
              className="assign-control"
              style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #333' }}
            >
            <label
              htmlFor="assignSelect"
              style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
            >
              Tilldelad
            </label>
              <select
                id="assignSelect"
                value={currentAssignedAdmin ? currentAssignedAdmin.id : ''}
                onChange={handleAssignChange}
                disabled={assignMutation.isPending}
              >
                <option value="">Ej tilldelad</option>
                {itAdmins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name}
                  </option>
                ))}
              </select>
              {assignMutation.isPending && <span> Sparar …</span>}
              {assignError && <p className="error">{assignError}</p>}
            </div>
            </>
          )}
          </>
        )}
      </section>
    </>
  );
}
