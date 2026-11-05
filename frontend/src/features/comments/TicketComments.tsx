import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getComments,addComment } from './CommentsApi';
import type{ CommentResponse } from './CommentsApi';

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
    <div className="mt-8 border-t pt-6">
      <h3 className="text-xl font-bold mb-4">Kommentarer</h3>

      {/* Lista alla befintliga kommentarer */}
      <div className="space-y-4 mb-6">
        {!comments || comments.length === 0 ? (
          <p className="text-gray-500 italic">Inga kommentarer ännu.</p>
        ) : (
          comments.map((comment: CommentResponse) => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-md shadow-sm border">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span className="font-bold text-gray-700">{comment.author}</span>
                <span>
                  {new Date(comment.createdAt).toLocaleString('sv-SE', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{comment.body}</p>
            </div>
          ))
        )}
      </div>

      {/* Formulär - visas för IT-ansvariga och för den som anmält ärendet (TB-30) */}
      {canComment && (
        <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3">
          <textarea
            className="border border-gray-300 rounded-md p-3 w-full"
            rows={3}
            placeholder="Skriv en kommentar..."
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
          />
          <button
            type="submit"
            disabled={!commentBody.trim() || commentMutation.isPending}
            className="bg-blue-600 text-white py-2 px-4 rounded-md w-fit font-medium disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            {commentMutation.isPending ? 'Skickar...' : 'Skicka '}
          </button>
        </form>
      )}
    </div>
  );
}