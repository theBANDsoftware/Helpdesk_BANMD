import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation } from '@tanstack/react-query';
import { createTicket } from '../../shared/ticketsApi'; 
import { ApiError } from '../../shared/apiClient';
import { categoryLabels } from '../../Types';
import type { categoryTicket } from '../../Types';

export default function CreateTicketForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<categoryTicket>("OTHER");
  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      setTitle('');
      setDescription('');
      setCategory('OTHER');
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate({ title, description, category });
  }

  return (
    <section className="card">
      <h2>Anmäl ett fel</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Rubrik
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} required />
        </label>

        <label>
          Beskrivning
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>

        <label>
          Kategori
          <select value={category} onChange={(e) => setCategory(e.target.value as categoryTicket)}>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Skickar …' : 'Skicka'}
        </button>
      </form>

      {mutation.isSuccess && <p>Ärendet är skapat.</p>}
      {mutation.isError && <p className="error">{errorMessage(mutation.error)}</p>}
    </section>
  );
}
        

function errorMessage(error: unknown): string {
  console.log("FEL", error);
  if (error instanceof ApiError) {
    if (error.status === 400) {
      return 'Kontrollera att alla fält är ifyllda.';
    }
    if (error.status === 502 || error.status === 504) {
      return 'Kunde inte nå backend. Är den startad på port 8080?';
    }
    return `Backend svarade med fel (${error.status}).`;
  }
  return 'Något gick fel.';
}


  


