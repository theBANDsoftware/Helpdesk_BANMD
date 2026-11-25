package com.thebanmd.helpdesk.repositories;

import com.thebanmd.helpdesk.entities.Comment;
import com.thebanmd.helpdesk.enums.Status;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Set;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    /** Kommentarer på ett ärende, äldst först. Författaren hämtas i samma SQL-fråga (EntityGraph). */
    @EntityGraph(attributePaths = {"author"})
    List<Comment> findByTicketIdOrderByCreatedAtAscIdAsc(Long ticketId);

    /**
     * Id på ärenden där den senaste kommentaren är skriven av anmälaren (TB-79).
     * Allt räknas i en enda SQL-fråga, så att det inte blir en fråga per ärende (N+1).
     */
    @Query("""
        select c.ticket.id from Comment c
        where c.id = (select max(c2.id) from Comment c2 where c2.ticket = c.ticket)
          and c.author = c.ticket.createdBy
          and c.ticket.status in :statuses
        """)
    Set<Long> findTicketIdsWhereLatestCommentIsByReporter(@Param("statuses") Collection<Status> statuses);
}
