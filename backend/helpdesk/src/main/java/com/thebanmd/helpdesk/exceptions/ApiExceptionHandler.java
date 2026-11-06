package com.thebanmd.helpdesk.exceptions;

import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

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

    /** Ogiltig data från @Valid. Svarar 400 med ett felmeddelande per fält, t.ex. {"title": "..."}. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationError(MethodArgumentNotValidException e) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        for (FieldError error : e.getBindingResult().getFieldErrors()) {
            fieldErrors.putIfAbsent(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity.badRequest().body(fieldErrors);
    }

    /** Användaren i X-User-Id finns inte (beslut 10). */
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFound(UserNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
    }

    /** Headern X-User-Id saknas, alltså är ingen användare vald (beslut 10). */
    @ExceptionHandler(MissingRequestHeaderException.class)
    public ResponseEntity<Map<String, String>> handleMissingHeader(MissingRequestHeaderException e) {
        return ResponseEntity.badRequest()
                .body(Map.of("error", "Ingen användare är vald. Headern " + e.getHeaderName() + " saknas."));
    }

    /** Ärendet finns inte. Svarar 404. */
    @ExceptionHandler(TicketNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleTicketNotFound(TicketNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
    }

    /** Användaren har fel roll, t.ex. En anställd som försöker ändra status (TB-27). */
    @ExceptionHandler(ForbiddenActionException.class)
    public ResponseEntity<Map<String, String>> handleForbiddenAction(ForbiddenActionException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", e.getMessage()));
    }

    /** Bilden finns inte (TB-35). */
    @ExceptionHandler(AttachmentNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleAttachmentNotFound(AttachmentNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
    }

    /** Fel filtyp, för stor fil eller för många bilder (TB-35). */
    @ExceptionHandler(InvalidAttachmentException.class)
    public ResponseEntity<Map<String, String>> handleInvalidAttachment(InvalidAttachmentException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }

    /** Anropet saknar fältet "file" (TB-35). */
    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<Map<String, String>> handleMissingFile(MissingServletRequestPartException e) {
        return ResponseEntity.badRequest().body(Map.of("error", "Ingen fil skickades."));
    }

    /** Filen är större än spring.servlet.multipart.max-file-size (TB-35). */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String, String>> handleTooLarge(MaxUploadSizeExceededException e) {
        return ResponseEntity.status(HttpStatus.CONTENT_TOO_LARGE).body(Map.of("error", "Filen är för stor. Max 5 MB."));
    }

    /** B2-bucketen svarar inte eller saknas i .env (TB-35, beslut 11). */
    @ExceptionHandler(StorageUnavailableException.class)
    public ResponseEntity<Map<String, String>> handleStorageUnavailable(StorageUnavailableException e) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of("error", e.getMessage()));
    }
}
