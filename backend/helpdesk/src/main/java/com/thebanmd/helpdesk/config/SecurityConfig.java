package com.thebanmd.helpdesk.config;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Inloggning med JWT (TB-33). Hela flödet förklaras i docs/inloggning.md.
 *
 * Man loggar in med e-post och lösenord på /api/auth/login och får en token tillbaka.
 * Alla andra anrop måste skicka den i headern "Authorization: Bearer <token>".
 * Spring Security kontrollerar att token är signerad med vår nyckel och inte har
 * gått ut, innan anropet når en controller. Annars svarar backend 401.
 */
@Configuration
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Token skickas i en header och inte i en cookie, så webbläsaren skickar den
            // aldrig av sig själv. Därför behövs inget CSRF-skydd.
            .csrf(csrf -> csrf.disable())
            // Backend kommer inte ihåg någon inloggning mellan anropen. Varje anrop har sin token.
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                // Bilderna visas med <img src="...">, och en bild kan inte skicka med någon token
                .requestMatchers(HttpMethod.GET, "/api/tickets/*/attachments/*").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));
        return http.build();
    }

    /** Lösenorden jämförs med BCrypt-hashen i users.password_hash. */
    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Nyckeln som signerar och kontrollerar token. Läses från JWT_SECRET i .env.
     * Saknas den skapas en slumpad nyckel vid start. Då fungerar inloggningen ändå,
     * men alla blir utloggade när backend startas om.
     */
    @Bean
    SecretKey jwtKey(@Value("${security.jwt.secret:}") String secret) {
        if (secret.isBlank()) {
            log.warn("JWT_SECRET saknas i .env. En tillfällig nyckel används, så alla loggas ut vid omstart.");
            byte[] random = new byte[32];
            new SecureRandom().nextBytes(random);
            return new SecretKeySpec(random, "HmacSHA256");
        }
        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            throw new IllegalStateException("JWT_SECRET måste vara minst 32 tecken lång.");
        }
        return new SecretKeySpec(bytes, "HmacSHA256");
    }

    @Bean
    JwtEncoder jwtEncoder(SecretKey jwtKey) {
        return new NimbusJwtEncoder(new ImmutableSecret<>(jwtKey));
    }

    @Bean
    JwtDecoder jwtDecoder(SecretKey jwtKey) {
        return NimbusJwtDecoder.withSecretKey(jwtKey).macAlgorithm(MacAlgorithm.HS256).build();
    }
}
