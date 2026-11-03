package com.thebanmd.helpdesk.repositories;

import com.thebanmd.helpdesk.entities.Comment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Hämtar alla kommentarer för ett ärende, äldst först.
    // @EntityGraph gör att vi hämtar författarens (User) information i samma databasanrop.
    @EntityGraph(attributePaths = {"author"})
    List<Comment> findByTicketIdOrderByCreatedAtAscIdAsc(Long ticketId);
}
