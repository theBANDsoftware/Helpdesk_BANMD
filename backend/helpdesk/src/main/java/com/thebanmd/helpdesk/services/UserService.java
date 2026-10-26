package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.dtos.UserResponse;
import com.thebanmd.helpdesk.repositories.UserRepository;

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
