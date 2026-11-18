import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments, addComment } from './CommentsApi';
import type { CommentResponse } from './CommentsApi';

interface TicketCommentsProps {
  ticketId: number;
  canComment: boolean;
}

export default function TicketComments({ ticketId, canComment }: TicketCommentsProps) {
  const queryClient = useQueryClient();
  const [commentBody, setCommentBody] = useState('');

  const { data: comments } = useQuery({
    queryKey: ['comments', ticketId],
    queryFn: () => getComments(ticketId),
    enabled: !!ticketId,
  });

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
    <div>
      <h3 className="subsection-title">Kommentarer</h3>

      <div className="card-list">
        {!comments || comments.length === 0 ? (
          <p className="empty-state">Inga kommentarer ännu.</p>
        ) : (
          comments.map((comment: CommentResponse) => (
            <article key={comment.id} className="sub-card">
              <div className="sub-card-header">
                <span className="item-title">{comment.author}</span>
                <time className="item-meta" dateTime={comment.createdAt}>
                  {new Date(comment.createdAt).toLocaleString('sv-SE', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>
              <p className="sub-card-body">{comment.body}</p>
            </article>
          ))
        )}
      </div>

      {canComment && (
        <form onSubmit={handleCommentSubmit} className="form-stack form-box">
          <p className="helper-text">
            Håll en saklig och tydlig ton – beskriv relevanta detaljer för ärendet.
          </p>
          <label className="form-field">
            <textarea
              className="textarea-autogrow"
              rows={3}
              placeholder="Skriv en kommentar..."
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
            />
          </label>
          <div className="btn-row">
            <button
              type="submit"
              disabled={!commentBody.trim() || commentMutation.isPending}
              className="btn btn-primary"
            >
              {commentMutation.isPending ? 'Skickar …' : 'Skicka'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
