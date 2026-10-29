package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.dtos.UserResponse;
import com.thebanmd.helpdesk.exceptions.UserNotFoundException;
import com.thebanmd.helpdesk.mappers.UserMapper;
import com.thebanmd.helpdesk.repositories.UserRepository;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    /** Alla användare i namnordning, till listan i "Välja vem man är". */
    public List<UserResponse> listUsers() {
        return userMapper.toResponseList(userRepository.findAllByOrderByNameAsc());
    }
    public UserResponse findById(Long id) {
        return userMapper.toResponse(userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id)));
    }
}
