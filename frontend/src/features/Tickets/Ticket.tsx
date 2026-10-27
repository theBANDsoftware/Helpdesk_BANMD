
import { useMutation } from '@tanstack/react-query';
import { createTicket } from '../../shared/ticketsApi'; 
import { ApiError } from '../../shared/apiClient';

function CreateTicketForm() {
  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      // t.ex. töm formuläret eller visa "Ärendet skapat"
    },
  });

  function handleSubmit(e: React.FormEvent) {
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
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
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
        




  


