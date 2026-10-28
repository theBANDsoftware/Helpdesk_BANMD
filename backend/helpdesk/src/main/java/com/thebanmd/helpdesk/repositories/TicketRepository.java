package com.thebanmd.helpdesk.repositories;

import com.thebanmd.helpdesk.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

}
