import { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketColumns, getTicket, categoryLabels, statusLabels, assignTicket } from './ticketsApi';
import { DataTable, setColumns } from '../../shared/DataTable';
import { ApiError } from '../../shared/apiClient';
import { useSelectedUser } from '../users/selectedUserContext';
import { getUsers } from '../users/usersApi';

/** Visar all information om ett ärende. */
export default function TicketDetail() {
  const { id } = useParams();
  const ticketId = Number(id);
  const location = useLocation();
  const backTo: string = location.state?.from ?? '/start';

  const { user: currentUser } = useSelectedUser();
  const queryClient = useQueryClient();
  const [assignError, setAssignError] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ['tickets', ticketId],
    queryFn: () => getTicket(ticketId),
    retry: (failureCount, error) =>
      !(error instanceof ApiError && error.status === 404) && failureCount < 3,
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

  if (!Number.isInteger(ticketId)) {
    return (
      <section className="card">
        <Link to={backTo}>&lt; Tillbaka</Link>
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

  return (
    <section className="card">
      <Link to={backTo}>&lt; Tillbaka</Link>
      {query.isPending && <p>Hämtar ärendet …</p>}
      {query.isError && query.error instanceof ApiError && query.error.status === 404 && (
        <p className="error">Ärendet hittades inte</p>
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
                assignedTo: query.data.assignedTo ?? 'Ej tilldelad',
              },
              ticketColumns,
              ['title', 'description'],
            )}
          ></DataTable>

          {/* Val för tilldelad – visas bara för IT-ansvariga */}
          {isItAdmin && (
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
          )}
        </>
      )}
    </section>
  );
}
