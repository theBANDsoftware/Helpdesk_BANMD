package com.thebanmd.helpdesk.repositories;

import com.thebanmd.helpdesk.entities.User;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/** Spring Data skapar implementationen utifrån metodnamnen. */
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findAllByOrderByNameAsc();

    /** Användaren som loggar in med den här e-postadressen (TB-33). */
    Optional<User> findByEmail(String email);
}
