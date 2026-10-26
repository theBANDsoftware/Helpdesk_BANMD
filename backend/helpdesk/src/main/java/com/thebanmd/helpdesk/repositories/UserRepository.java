package com.thebanmd.helpdesk.repositories;

import com.thebanmd.helpdesk.entities.User;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/** Spring Data skapar implementationen utifrån metodnamnen. */
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findAllByOrderByNameAsc();
}
