package com.thebanmd.helpdesk.repositories;

import com.thebanmd.helpdesk.entities.Comment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    /** Kommentarer på ett ärende, äldst först. Författaren hämtas i samma SQL-fråga (EntityGraph). */
    @EntityGraph(attributePaths = {"author"})
    List<Comment> findByTicketIdOrderByCreatedAtAscIdAsc(Long ticketId);
}
