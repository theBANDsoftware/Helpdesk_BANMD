import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '../../shared/apiClient';
import {
  ALLOWED_ATTACHMENT_TYPES,
  MAX_ATTACHMENT_BYTES,
  MAX_ATTACHMENTS_PER_TICKET,
  attachmentUrl,
  getAttachments,
  uploadAttachment,
} from './attachmentsApi';

interface TicketAttachmentsProps {
  ticketId: number;
  /** Den som anmält ärendet och IT-ansvariga får ladda upp. Backend kontrollerar samma sak. */
  canUpload: boolean;
}

/** Bifogade skärmdumpar i ett ärende (TB-35). */
export default function TicketAttachments({ ticketId, canUpload }: TicketAttachmentsProps) {
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [brokenImages, setBrokenImages] = useState<number[]>([]);

  const query = useQuery({
    queryKey: ['attachments', ticketId],
    queryFn: () => getAttachments(ticketId),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadAttachment(ticketId, file),
    onSuccess: () => {
      setSelectedFile(null);
      setError(null);
      if (fileInput.current) fileInput.current.value = '';
      queryClient.invalidateQueries({ queryKey: ['attachments', ticketId] });
    },
    onError: (e) => {
      if (e instanceof ApiError && typeof e.body === 'object' && e.body && 'error' in e.body) {
        setError((e.body as { error: string }).error);
      } else {
        setError('Kunde inte ladda upp bilden.');
      }
    },
  });

  // Samma kontroller som backend, så att man får svar direkt utan att vänta på uppladdningen.
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setError(null);
    if (file && !ALLOWED_ATTACHMENT_TYPES.includes(file.type)) {
      setError('Bara PNG- och JPG-bilder kan bifogas.');
      setSelectedFile(null);
      return;
    }
    if (file && file.size > MAX_ATTACHMENT_BYTES) {
      setError('Filen är för stor. Max 5 MB.');
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (selectedFile) uploadMutation.mutate(selectedFile);
  }

  const attachments = query.data ?? [];
  const isFull = attachments.length >= MAX_ATTACHMENTS_PER_TICKET;

  return (
    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
      <h3>Bifogade bilder</h3>

      {query.isPending && <p>Hämtar bilder …</p>}
      {query.isError && <p className="error">Kunde inte hämta bilderna.</p>}
      {query.isSuccess && attachments.length === 0 && <p>Inga bilder bifogade.</p>}

      {attachments.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          {attachments.map((attachment) => (
            <figure key={attachment.id} style={{ margin: 0, width: '180px' }}>
              {brokenImages.includes(attachment.id) ? (
                <p className="error">Bilden kunde inte visas.</p>
              ) : (
                <a href={attachmentUrl(ticketId, attachment.id)} target="_blank" rel="noreferrer">
                  <img
                    src={attachmentUrl(ticketId, attachment.id)}
                    alt={attachment.filename}
                    style={{
                      width: '180px',
                      height: '120px',
                      objectFit: 'contain',
                      borderRadius: '4px',
                      // Ram och grå bakgrund, så att skärmdumpar med vit bakgrund syns tydligt
                      border: '1px solid #ccc',
                      backgroundColor: '#f2f2f2',
                      padding: '4px',
                      boxSizing: 'border-box',
                    }}
                    onError={() => setBrokenImages((ids) => [...ids, attachment.id])}
                  />
                </a>
              )}
              <figcaption style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}>
                {attachment.filename} · {attachment.uploadedBy}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {canUpload && !isFull && (
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="attachmentInput"
            style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
          >
            Bifoga skärmdump
          </label>
          <input
            id="attachmentInput"
            ref={fileInput}
            type="file"
            accept={ALLOWED_ATTACHMENT_TYPES.join(',')}
            onChange={handleFileChange}
            disabled={uploadMutation.isPending}
          />
          <button type="submit" disabled={!selectedFile || uploadMutation.isPending}>
            {uploadMutation.isPending ? 'Laddar upp …' : 'Ladda upp'}
          </button>
          <p style={{ fontSize: '0.8rem' }}>
            PNG eller JPG, max 5 MB, högst {MAX_ATTACHMENTS_PER_TICKET} bilder per ärende.
          </p>
        </form>
      )}
      {canUpload && isFull && <p>Ärendet har redan {MAX_ATTACHMENTS_PER_TICKET} bilder.</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
