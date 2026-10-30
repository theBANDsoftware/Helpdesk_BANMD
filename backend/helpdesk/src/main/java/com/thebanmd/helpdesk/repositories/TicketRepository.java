package com.thebanmd.helpdesk.repositories;

import com.thebanmd.helpdesk.entities.Ticket;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    @EntityGraph(attributePaths = {"createdBy", "assignedTo"})
    List<Ticket> findByCreatedByIdOrderByCreatedAtDescIdDesc(Long userId);
}
