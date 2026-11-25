package com.thebanmd.helpdesk.services;

import com.thebanmd.helpdesk.dtos.LoginRequest;
import com.thebanmd.helpdesk.dtos.LoginResponse;
import com.thebanmd.helpdesk.entities.User;
import com.thebanmd.helpdesk.exceptions.InvalidCredentialsException;
import com.thebanmd.helpdesk.mappers.UserMapper;
import com.thebanmd.helpdesk.repositories.UserRepository;
import java.time.Duration;
import java.time.Instant;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Inloggning med e-post och lösenord (TB-33). Se docs/inloggning.md. */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;
    private final Duration tokenLifetime;

    public AuthService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder,
                       JwtEncoder jwtEncoder, @Value("${security.jwt.expires-in:8h}") Duration tokenLifetime) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
        this.tokenLifetime = tokenLifetime;
    }

    /**
     * Kontrollerar e-post och lösenord och skapar en token. Kastar InvalidCredentialsException
     * (401) om e-posten inte finns, lösenordet är fel eller användaren saknar lösenord.
     */
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String email = request.email().strip().toLowerCase(Locale.ROOT);
        User user = userRepository.findByEmail(email)
            .filter(found -> found.getPasswordHash() != null)
            .filter(found -> passwordEncoder.matches(request.password(), found.getPasswordHash()))
            .orElseThrow(InvalidCredentialsException::new);

        return new LoginResponse(createToken(user), userMapper.toResponse(user));
    }

    /**
     * Token innehåller användarens id som "subject". Det är det enda backend läser ur den.
     * Namn och roll står med så att token går att läsa på jwt.io när man felsöker,
     * men backend litar inte på dem. Rollen hämtas alltid från databasen.
     */
    private String createToken(User user) {
        Instant now = Instant.now();
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuer("helpdesk")
            .subject(String.valueOf(user.getId()))
            .issuedAt(now)
            .expiresAt(now.plus(tokenLifetime))
            .claim("name", user.getName())
            .claim("role", user.getRole().name())
            .build();
        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
