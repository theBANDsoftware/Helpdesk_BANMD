package com.thebanmd.helpdesk.controllers;

import com.thebanmd.helpdesk.dtos.LoginRequest;
import com.thebanmd.helpdesk.dtos.LoginResponse;
import com.thebanmd.helpdesk.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Inloggning (TB-33). Den enda endpoint som går att anropa utan token, se SecurityConfig. */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /** Svarar 200 med token och användaren, eller 401 vid fel e-post eller lösenord. */
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
