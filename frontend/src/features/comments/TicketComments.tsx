import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, addComment } from './CommentsApi';
import type { CommentResponse } from './CommentsApi';
import './TicketComments.css';

interface TicketCommentsProps {
  ticketId: number;
  canComment: boolean;
}

export default function TicketComments({ ticketId, canComment }: TicketCommentsProps) {
  const queryClient = useQueryClient();
  const [commentBody, setCommentBody] = useState('');

  // Hämta kommentarerna för detta ärende
  const { data: comments } = useQuery({
    queryKey: ['comments', ticketId],
    queryFn: () => getComments(ticketId),
    enabled: !!ticketId,
  });

  // Skapa en mutation för att skicka en ny kommentar
  const commentMutation = useMutation({
    mutationFn: (newComment: string) => addComment(ticketId, newComment),
    onSuccess: () => {
      setCommentBody('');
      queryClient.invalidateQueries({ queryKey: ['comments', ticketId] });
    },
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentBody.trim()) return;
    commentMutation.mutate(commentBody);
  };

  return (
    <div className="ticket-comments">
      <h3 className="ticket-comments-heading">Kommentarer</h3>

      {/* Lista alla befintliga kommentarer */}
      <div className="comment-list">
        {!comments || comments.length === 0 ? (
          <p className="comment-empty">Inga kommentarer ännu.</p>
        ) : (
          comments.map((comment: CommentResponse) => (
            <article key={comment.id} className="comment-card">
              <div className="comment-meta">
                <span className="comment-author">{comment.author}</span>
                <time className="comment-date" dateTime={comment.createdAt}>
                  {new Date(comment.createdAt).toLocaleString('sv-SE', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>
              <p className="comment-body">{comment.body}</p>
            </article>
          ))
        )}
      </div>

      {/* Formulär - visas för IT-ansvariga och för den som anmält ärendet (TB-30) */}
      {canComment && (
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <p className="comment-guideline">
            Håll en saklig och tydlig ton – beskriv relevanta detaljer för ärendet.
          </p>
          <textarea
            className="comment-textarea"
            rows={3}
            placeholder="Skriv en kommentar..."
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
          />
          <button
            type="submit"
            disabled={!commentBody.trim() || commentMutation.isPending}
            className="comment-submit"
          >
            {commentMutation.isPending ? 'Skickar …' : 'Skicka'}
          </button>
        </form>
      )}
    </div>
  );
}