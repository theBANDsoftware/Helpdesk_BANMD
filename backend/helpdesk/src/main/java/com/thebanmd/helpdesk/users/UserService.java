package com.thebanmd.helpdesk.users;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /** Alla användare i namnordning, till listan i "Välja vem man är". */
    public List<UserResponse> listUsers() {
        return userRepository.findAllByOrderByNameAsc().stream()
                .map(UserResponse::from)
                .toList();
    }
}
