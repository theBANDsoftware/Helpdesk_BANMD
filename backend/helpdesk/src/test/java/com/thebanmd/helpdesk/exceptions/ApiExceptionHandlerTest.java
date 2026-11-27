package com.thebanmd.helpdesk.exceptions;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Testar att frontend kan skilja ett 404 för användaren från andra 404 (TB-60).
 * Handlern anropas direkt, så testet behöver varken databas eller server.
 */
class ApiExceptionHandlerTest {

    private final ApiExceptionHandler handler = new ApiExceptionHandler();

    @Test
    void anvandareSomInteFinnsGer404MedCodeUserNotFound() {
        ResponseEntity<Map<String, String>> response =
            handler.handleUserNotFound(new UserNotFoundException(7L));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).containsEntry("code", "USER_NOT_FOUND");
        assertThat(response.getBody()).containsEntry("error", "Användaren med id 7 finns inte");
    }

    /** Ett ärende som inte finns får inte logga ut användaren (AK 3). */
    @Test
    void arendeSomInteFinnsGer404UtanCode() {
        ResponseEntity<Map<String, String>> response =
            handler.handleTicketNotFound(new TicketNotFoundException(7L));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).doesNotContainKey("code");
        assertThat(response.getBody()).containsEntry("error", "Ärendet med id 7 finns inte");
    }

    /** Samma sak för bilder och notiser, som också svarar 404. */
    @Test
    void bildOchNotisSomInteFinnsGer404UtanCode() {
        ResponseEntity<Map<String, String>> bild =
            handler.handleAttachmentNotFound(new AttachmentNotFoundException(7L));
        ResponseEntity<Map<String, String>> notis =
            handler.handleNotificationNotFound(new NotificationNotFoundException(7L));

        assertThat(bild.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(bild.getBody()).doesNotContainKey("code");
        assertThat(notis.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(notis.getBody()).doesNotContainKey("code");
    }
}
