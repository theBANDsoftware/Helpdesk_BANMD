package com.thebanmd.helpdesk.repositories;

import com.thebanmd.helpdesk.entities.Attachment;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    // Alla bilder i ett ärende, äldst först. Hämtar uppladdarens namn i samma anrop.
    @EntityGraph(attributePaths = {"uploadedBy"})
    List<Attachment> findByTicketIdOrderByCreatedAtAscIdAsc(Long ticketId);

    long countByTicketId(Long ticketId);

    // Kräver att bilden hör till rätt ärende, så att man inte kan hämta en bild via fel ärende.
    Optional<Attachment> findByIdAndTicketId(Long id, Long ticketId);
}
