import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../../shared/apiClient';
import type { categoryTicket } from '../../Types';
import {
  categoryLabels,
  updateTicket,
  withdrawTicket,
  type TicketDetailResponse,
} from './ticketsApi';

type Field = 'title' | 'description' | 'category';
type FieldErrors = Partial<Record<Field, string>>;

interface TicketOwnerActionsProps {
  /** Visas bara för anmälaren när ärendet har status Ny. Backend kontrollerar samma sak. */
  ticket: TicketDetailResponse;
}

/** Knapparna "Ändra" och "Ta tillbaka" för anmälaren (TB-51). */
export default function TicketOwnerActions({ ticket }: TicketOwnerActionsProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description);
  const [category, setCategory] = useState<categoryTicket>(ticket.category);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);

  // Visa det nya ärendet direkt i detaljvyn, och hämta om "Mina ärenden" och de andra listorna
  function showUpdated(updated: TicketDetailResponse) {
    queryClient.setQueryData(['tickets', ticket.id], updated);
    queryClient.invalidateQueries({ queryKey: ['tickets'] });
  }

  const updateMutation = useMutation({
    mutationFn: () => updateTicket(ticket.id, { title, description, category }),
    onSuccess: (updated) => {
      setIsEditing(false);
      setError(null);
      showUpdated(updated);
    },
    onError: (e) => handleError(e, 'Kunde inte spara ändringarna.'),
  });

  const withdrawMutation = useMutation({
    mutationFn: () => withdrawTicket(ticket.id),
    onSuccess: (updated) => {
      setError(null);
      showUpdated(updated);
    },
    onError: (e) => handleError(e, 'Kunde inte ta tillbaka ärendet.'),
  });

  function handleError(e: Error, fallback: string) {
    if (e instanceof ApiError && e.body && typeof e.body === 'object') {
      const body = e.body as Record<string, string>;
      if ('error' in body) {
        // T.ex. 409: IT-ansvarig har hunnit ändra status medan man redigerade
        setError(body.error);
        return;
      }
      // 400 från @Valid: ett meddelande per fält
      setFieldErrors(body as FieldErrors);
      setError('Kontrollera fälten.');
      return;
    }
    setError(fallback);
  }

  function startEditing() {
    setTitle(ticket.title);
    setDescription(ticket.description);
    setCategory(ticket.category);
    setFieldErrors({});
    setError(null);
    setIsEditing(true);
  }

  function handleSave(e: FormEvent) {
    e.preventDefault();
    // Samma krav som när ärendet skapas
    const errors: FieldErrors = {};
    if (!title.trim() || title.length > 120) errors.title = 'Fyll i en rubrik (högst 120 tecken).';
    if (!description.trim()) errors.description = 'Fyll i en beskrivning.';
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) updateMutation.mutate();
  }

  function handleWithdraw() {
    if (window.confirm('Vill du ta tillbaka ärendet?')) {
      withdrawMutation.mutate();
    }
  }

  const isBusy = updateMutation.isPending || withdrawMutation.isPending;

  return (
    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
      {!isEditing && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" onClick={startEditing} disabled={isBusy}>
            Ändra
          </button>
          <button type="button" onClick={handleWithdraw} disabled={isBusy}>
            {withdrawMutation.isPending ? 'Tar tillbaka …' : 'Ta tillbaka'}
          </button>
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleSave} noValidate>
          <h3>Ändra ärendet</h3>
          <label>
            Rubrik
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              aria-invalid={!!fieldErrors.title}
            />
          </label>
          {fieldErrors.title && <p className="error">{fieldErrors.title}</p>}

          <label>
            Beskrivning
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-invalid={!!fieldErrors.description}
            />
          </label>
          {fieldErrors.description && <p className="error">{fieldErrors.description}</p>}

          <label>
            Kategori
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as categoryTicket)}
              aria-invalid={!!fieldErrors.category}
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {fieldErrors.category && <p className="error">{fieldErrors.category}</p>}

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" disabled={isBusy}>
              {updateMutation.isPending ? 'Sparar …' : 'Spara'}
            </button>
            <button type="button" onClick={() => setIsEditing(false)} disabled={isBusy}>
              Avbryt
            </button>
          </div>
        </form>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}
