package com.thebanmd.helpdesk.services;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import com.thebanmd.helpdesk.dtos.LoginRequest;
import com.thebanmd.helpdesk.dtos.LoginResponse;
import com.thebanmd.helpdesk.entities.User;
import com.thebanmd.helpdesk.enums.Role;
import com.thebanmd.helpdesk.exceptions.InvalidCredentialsException;
import com.thebanmd.helpdesk.mappers.UserMapper;
import com.thebanmd.helpdesk.repositories.UserRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.test.util.ReflectionTestUtils;

/**
 * Testar inloggningen (TB-33) utan databas. UserRepository är en Mockito-mock, men
 * BCrypt och JWT är de riktiga, så att testet visar att ett lösenord verkligen
 * kontrolleras och att token verkligen går att läsa.
 */
class AuthServiceTest {

    private static final SecretKey KEY = new SecretKeySpec(
            "en-testnyckel-som-ar-minst-32-tecken-lang".getBytes(StandardCharsets.UTF_8), "HmacSHA256");

    private final UserRepository userRepository = mock(UserRepository.class);
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final JwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(KEY).macAlgorithm(MacAlgorithm.HS256).build();
    private final AuthService service = new AuthService(userRepository, Mappers.getMapper(UserMapper.class),
            passwordEncoder, new NimbusJwtEncoder(new ImmutableSecret<>(KEY)), Duration.ofHours(8));

    /** Maria (id 5) med ett lösenord som bara finns i testet. */
    private final User maria = user(5L, "Maria Nordin", Role.IT_ADMIN, "maria.nordin@helpdesk.test",
            passwordEncoder.encode("testlosenord"));

    @Test
    void loginGerTokenMedAnvandarensId() {
        when(userRepository.findByEmail("maria.nordin@helpdesk.test")).thenReturn(Optional.of(maria));

        LoginResponse response = service.login(new LoginRequest("maria.nordin@helpdesk.test", "testlosenord"));

        Jwt token = jwtDecoder.decode(response.token());
        assertThat(token.getSubject()).isEqualTo("5");
        assertThat(token.getClaimAsString("role")).isEqualTo("IT_ADMIN");
        assertThat(token.getExpiresAt()).isCloseTo(Instant.now().plus(Duration.ofHours(8)), within1Minute());
        assertThat(response.user().name()).isEqualTo("Maria Nordin");
        assertThat(response.user().role()).isEqualTo(Role.IT_ADMIN);
    }

    @Test
    void loginGodtarStoraBokstaverOchMellanslagIEposten() {
        when(userRepository.findByEmail("maria.nordin@helpdesk.test")).thenReturn(Optional.of(maria));

        LoginResponse response = service.login(new LoginRequest("  Maria.Nordin@Helpdesk.test ", "testlosenord"));

        assertThat(response.user().id()).isEqualTo(5L);
    }

    @Test
    void loginKastarInvalidCredentialsVidFelLosenord() {
        when(userRepository.findByEmail("maria.nordin@helpdesk.test")).thenReturn(Optional.of(maria));

        assertThatThrownBy(() -> service.login(new LoginRequest("maria.nordin@helpdesk.test", "fel")))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Fel e-post eller lösenord.");
    }

    @Test
    void loginKastarSammaFelForEpostSomInteFinns() {
        when(userRepository.findByEmail("finns.inte@helpdesk.test")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.login(new LoginRequest("finns.inte@helpdesk.test", "testlosenord")))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessage("Fel e-post eller lösenord.");
    }

    @Test
    void loginKastarInvalidCredentialsOmAnvandarenSaknarLosenord() {
        User utanLosenord = user(7L, "Ny Anställd", Role.EMPLOYEE, "ny@helpdesk.test", null);
        when(userRepository.findByEmail("ny@helpdesk.test")).thenReturn(Optional.of(utanLosenord));

        assertThatThrownBy(() -> service.login(new LoginRequest("ny@helpdesk.test", "")))
                .isInstanceOf(InvalidCredentialsException.class);
    }

    private static org.assertj.core.data.TemporalUnitOffset within1Minute() {
        return org.assertj.core.api.Assertions.within(1, ChronoUnit.MINUTES);
    }

    /** User har inga setters, eftersom användarna skapas med SQL. I testet sätts fälten direkt. */
    private static User user(Long id, String name, Role role, String email, String passwordHash) {
        User user = new User(name, role);
        ReflectionTestUtils.setField(user, "id", id);
        ReflectionTestUtils.setField(user, "email", email);
        ReflectionTestUtils.setField(user, "passwordHash", passwordHash);
        return user;
    }
}
