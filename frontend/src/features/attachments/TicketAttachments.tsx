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
    <div className="section-divider">
      <h3 className="subsection-title">Bifogade bilder</h3>

      {query.isPending && <p>Hämtar bilder …</p>}
      {query.isError && <p className="error">Kunde inte hämta bilderna.</p>}
      {query.isSuccess && attachments.length === 0 && (
        <p className="empty-state">Inga bilder bifogade.</p>
      )}

      {attachments.length > 0 && (
        <div className="media-grid">
          {attachments.map((attachment) => (
            <figure key={attachment.id} className="media-card">
              {brokenImages.includes(attachment.id) ? (
                <p className="error">Bilden kunde inte visas.</p>
              ) : (
                <a href={attachmentUrl(ticketId, attachment.id)} target="_blank" rel="noreferrer">
                  <img
                    src={attachmentUrl(ticketId, attachment.id)}
                    alt={attachment.filename}
                    className="media-thumb"
                    onError={() => setBrokenImages((ids) => [...ids, attachment.id])}
                  />
                </a>
              )}
              <figcaption className="media-caption">
                {attachment.filename} · {attachment.uploadedBy}
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {canUpload && !isFull && (
        <form className="form-stack" onSubmit={handleSubmit}>
          <label htmlFor="attachmentInput" className="form-field">
            Bifoga skärmdump
            <input
              id="attachmentInput"
              ref={fileInput}
              type="file"
              accept={ALLOWED_ATTACHMENT_TYPES.join(',')}
              onChange={handleFileChange}
              disabled={uploadMutation.isPending}
            />
          </label>
          <div className="btn-row">
            <button
              type="submit"
              className="btn"
              disabled={!selectedFile || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? 'Laddar upp …' : 'Ladda upp'}
            </button>
          </div>
          <p className="helper-text">
            PNG eller JPG, max 5 MB, högst {MAX_ATTACHMENTS_PER_TICKET} bilder per ärende.
          </p>
        </form>
      )}
      {canUpload && isFull && (
        <p className="helper-text">Ärendet har redan {MAX_ATTACHMENTS_PER_TICKET} bilder.</p>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
