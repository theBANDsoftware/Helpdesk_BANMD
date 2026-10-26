package com.thebanmd.helpdesk.controllers;

import com.thebanmd.helpdesk.dtos.UserResponse;
import com.thebanmd.helpdesk.entities.Ticket;
import com.thebanmd.helpdesk.services.UserService;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



/** Tar bara emot anropet och lämnar över till service (DoD punkt 7). */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserResponse> listUsers() {
        return userService.listUsers();
    }
}
