package com.thebanmd.helpdesk.users;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

/** Spring Data skapar implementationen utifrån metodnamnen. */
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findAllByOrderByNameAsc();
}
