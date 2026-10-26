package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.dtos.UserResponse;
import com.thebanmd.helpdesk.entities.Role;
import com.thebanmd.helpdesk.entities.User;
import com.thebanmd.helpdesk.repositories.UserRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import org.junit.jupiter.api.Test;

/** Testar UserService utan databas. Repositoryt ersätts med en Mockito-mock. */
class UserServiceTest {

    @Test
    void listUsersGerNamnOchRollFranRepositoryt() {
        UserRepository repository = mock(UserRepository.class);
        when(repository.findAllByOrderByNameAsc())
                .thenReturn(List.of(new User("Anna Lind", Role.EMPLOYEE), new User("Erik Holm", Role.IT_ADMIN)));

        List<UserResponse> users = new UserService(repository).listUsers();

        assertThat(users).extracting(UserResponse::name).containsExactly("Anna Lind", "Erik Holm");
        assertThat(users).extracting(UserResponse::role).containsExactly(Role.EMPLOYEE, Role.IT_ADMIN);
    }
}
