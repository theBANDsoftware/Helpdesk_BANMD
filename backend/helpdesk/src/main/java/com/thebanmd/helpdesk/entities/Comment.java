package com.thebanmd.helpdesk.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

import java.time.Instant;

@Entity
@DynamicInsert
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor // Fixar den tomma konstruktorn som JPA kräver
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @NotBlank
    @Lob
    @Column(name = "body", nullable = false)
    private String body;

    @ColumnDefault("current_timestamp()")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    // Vi behåller en smidig konstruktor för när vi skapar den i koden (eftersom vi inte vill sätta id/createdAt manuellt)
    public Comment(Ticket ticket, User author, String body) {
        this.ticket = ticket;
        this.author = author;
        this.body = body;
    }
}
