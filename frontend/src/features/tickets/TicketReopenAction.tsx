import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../../shared/apiClient';
import { reopenTicket, statusLabels, type TicketDetailResponse } from './ticketsApi';

interface TicketReopenActionProps {
  /** Visas bara för anmälaren när ärendet är löst eller återkallat. Backend kontrollerar samma sak. */
  ticket: TicketDetailResponse;
}

/**
 * Knappen "Öppna igen" för anmälaren (TB-73).
 * Ett löst ärende blir Pågående och ett återkallat blir Ny. Tilldelning,
 * kommentarer och bilder följer med, så IT ser hela historiken.
 */
export default function TicketReopenAction({ ticket }: TicketReopenActionProps) {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const reopenMutation = useMutation({
    mutationFn: () => reopenTicket(ticket.id),
    onSuccess: (updated) => {
      setError(null);
      // Visa den nya statusen direkt i ärendet och hämta om listorna
      queryClient.setQueryData(['tickets', ticket.id], updated);
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
    onError: (e) => {
      if (e instanceof ApiError && e.body && typeof e.body === 'object' && 'error' in e.body) {
        // T.ex. 409 om IT hunnit ändra status under tiden
        setError((e.body as { error: string }).error);
      } else {
        setError('Kunde inte öppna ärendet igen.');
      }
    },
  });

  // Ett löst ärende tas upp igen av IT, ett återkallat börjar om från början
  const nextStatus = ticket.status === 'RESOLVED' ? 'IN_PROGRESS' : 'NEW';

  return (
    <div className="reopen-action">
      <p>
        Ärendet är {statusLabels[ticket.status].toLowerCase()}. Kommer felet tillbaka kan du öppna
        det igen i stället för att anmäla ett nytt, så ser IT hela historiken.
      </p>
      <button
        type="button"
        onClick={() => reopenMutation.mutate()}
        disabled={reopenMutation.isPending}
      >
        {reopenMutation.isPending ? 'Öppnar …' : 'Öppna igen'}
      </button>
      <p className="reopen-hint">Ärendet får då status {statusLabels[nextStatus]}.</p>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
