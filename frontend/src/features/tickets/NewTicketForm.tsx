import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation } from '@tanstack/react-query';
import { categoryLabels, createTicket } from './ticketsApi';
import { ApiError } from '../../shared/apiClient';
import type { categoryTicket } from '../../Types';

type Field = 'title' | 'description' | 'category';
type FieldErrors = Partial<Record<Field, string>>;

const fieldMessages: Record<Field, string> = {
  title: 'Fyll i en rubrik (högst 120 tecken).',
  description: 'Fyll i en beskrivning.',
  category: 'Välj en kategori.',
};

export default function NewTicketForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<categoryTicket>("OTHER");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      setTitle('');
      setDescription('');
      setCategory('OTHER');
    },
    onError: (error) => setFieldErrors(fieldErrorsFromBackend(error)),
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errors = validate(title, description);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }
    mutation.mutate({ title, description, category });
  }

  return (
    <section className="card">
      <h2>Anmäl ett fel</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Rubrik
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} aria-invalid={!!fieldErrors.title} />
        </label>
        {fieldErrors.title && <p className="error">{fieldErrors.title}</p>}

        <label>
          Beskrivning
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} aria-invalid={!!fieldErrors.description} />
        </label>
        {fieldErrors.description && <p className="error">{fieldErrors.description}</p>}

        <label>
          Kategori
          <select value={category} onChange={(e) => setCategory(e.target.value as categoryTicket)} aria-invalid={!!fieldErrors.category}>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        {fieldErrors.category && <p className="error">{fieldErrors.category}</p>}

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Skickar …' : 'Skicka'}
        </button>
      </form>

      {mutation.isSuccess && <p>Ärendet är skapat.</p>}
      {mutation.isError && <p className="error">{errorMessage(mutation.error)}</p>}
    </section>
  );
}

function validate(title: string, description: string): FieldErrors {
  const errors: FieldErrors = {};
  if (title.trim() === '') {
    errors.title = fieldMessages.title;
  }
  if (description.trim() === '') {
    errors.description = fieldMessages.description;
  }
  return errors;
}

// Backend svarar 400 med ett fel per fält, t.ex. {"title": "..."}. Texterna visas på svenska här.
function fieldErrorsFromBackend(error: unknown): FieldErrors {
  if (!(error instanceof ApiError) || error.status !== 400 || typeof error.body !== 'object' || error.body === null) {
    return {};
  }
  const errors: FieldErrors = {};
  for (const field of Object.keys(error.body)) {
    if (field in fieldMessages) {
      errors[field as Field] = fieldMessages[field as Field];
    }
  }
  return errors;
}

function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return 'Kontrollera fälten ovan.';
    }
    if (error.status === 502 || error.status === 504) {
      return 'Kunde inte nå backend. Är den startad på port 8080?';
    }
    return `Backend svarade med fel (${error.status}).`;
  }
  return 'Något gick fel.';
}
