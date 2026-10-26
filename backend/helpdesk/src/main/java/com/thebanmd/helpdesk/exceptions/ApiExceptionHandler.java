package com.thebanmd.helpdesk.exceptions;

import java.util.Map;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Gemensam felhantering för alla controllers. Når backend inte databasen
 * svarar alla endpoints 503 med ett begripligt meddelande, i stället för
 * ett generellt 500-fel.
 */
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Map<String, String>> handleDatabaseError(DataAccessException e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("error", "Databasen svarar inte: " + e.getMostSpecificCause().getMessage()));
    }
}
