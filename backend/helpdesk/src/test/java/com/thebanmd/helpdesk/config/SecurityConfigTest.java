package com.thebanmd.helpdesk.config;

import com.thebanmd.helpdesk.controllers.AuthController;
import com.thebanmd.helpdesk.controllers.TicketController;
import com.thebanmd.helpdesk.dtos.LoginRequest;
import com.thebanmd.helpdesk.dtos.LoginResponse;
import com.thebanmd.helpdesk.dtos.UserResponse;
import com.thebanmd.helpdesk.enums.Role;
import com.thebanmd.helpdesk.exceptions.InvalidCredentialsException;
import com.thebanmd.helpdesk.services.AuthService;
import com.thebanmd.helpdesk.services.TicketService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Testar att SecurityConfig släpper igenom och stoppar rätt anrop (TB-33).
 * Startar bara webblagret med två controllers, utan databas. Servicarna är mockar,
 * så testet handlar bara om token och inte om reglerna i TicketService.
 */
@WebMvcTest(controllers = {TicketController.class, AuthController.class})
@Import({SecurityConfig.class, WebConfig.class})
@TestPropertySource(properties = "security.jwt.secret=en-testnyckel-som-ar-minst-32-tecken-lang")
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    /** Den riktiga JwtEncoder från SecurityConfig, så att testets token signeras med samma nyckel. */
    @Autowired
    private JwtEncoder jwtEncoder;

    @MockitoBean
    private TicketService ticketService;

    @MockitoBean
    private AuthService authService;

    @Test
    void anropUtanTokenSvarar401() throws Exception {
        mockMvc.perform(get("/api/tickets"))
                .andExpect(status().isUnauthorized());
        verify(ticketService, never()).getAllTickets(anyLong());
    }

    @Test
    void anropMedTokenGerControllernAnvandarensId() throws Exception {
        when(ticketService.getAllTickets(5L)).thenReturn(List.of());

        mockMvc.perform(get("/api/tickets").header("Authorization", "Bearer " + token("5", Instant.now())))
                .andExpect(status().isOk());
        verify(ticketService).getAllTickets(5L);
    }

    @Test
    void felaktigTokenSvarar401() throws Exception {
        mockMvc.perform(get("/api/tickets").header("Authorization", "Bearer inte.en.token"))
                .andExpect(status().isUnauthorized());
        verify(ticketService, never()).getAllTickets(anyLong());
    }

    @Test
    void utgangenTokenSvarar401() throws Exception {
        String expired = token("5", Instant.now().minus(Duration.ofHours(9)));

        mockMvc.perform(get("/api/tickets").header("Authorization", "Bearer " + expired))
                .andExpect(status().isUnauthorized());
        verify(ticketService, never()).getAllTickets(anyLong());
    }

    @Test
    void headernXUserIdGerIngenAtkomstLangre() throws Exception {
        mockMvc.perform(get("/api/tickets").header("X-User-Id", "5"))
                .andExpect(status().isUnauthorized());
        verify(ticketService, never()).getAllTickets(anyLong());
    }

    @Test
    void inloggningKraverIngenToken() throws Exception {
        when(authService.login(any(LoginRequest.class)))
                .thenReturn(new LoginResponse("token", new UserResponse(5L, "Maria Nordin", Role.IT_ADMIN)));

        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\": \"maria.nordin@helpdesk.test\", \"password\": \"testlosenord\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("token"))
                .andExpect(jsonPath("$.user.name").value("Maria Nordin"));
    }

    @Test
    void felLosenordSvarar401MedMeddelande() throws Exception {
        when(authService.login(any(LoginRequest.class))).thenThrow(new InvalidCredentialsException());

        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\": \"maria.nordin@helpdesk.test\", \"password\": \"fel\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Fel e-post eller lösenord."));
    }

    @Test
    void tomtLosenordSvarar400() throws Exception {
        mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\": \"maria.nordin@helpdesk.test\", \"password\": \"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.password").value("Lösenord krävs"));
    }

    /** En token som AuthService hade skapat, utfärdad vid issuedAt och giltig i 8 timmar. */
    private String token(String userId, Instant issuedAt) {
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(userId)
                .issuedAt(issuedAt)
                .expiresAt(issuedAt.plus(Duration.ofHours(8)))
                .build();
        return jwtEncoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
                .getTokenValue();
    }
}
