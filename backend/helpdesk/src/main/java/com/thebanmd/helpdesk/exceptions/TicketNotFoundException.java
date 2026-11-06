package com.thebanmd.helpdesk.exceptions;

/**
 * Kastas när ett ärende med ett visst id inte finns i databasen.
 * ApiExceptionHandler gör om den till 404.
 */
public class TicketNotFoundException extends RuntimeException {
    public TicketNotFoundException(Long id) {
        super("Ärendet med id " + id + " finns inte");
    }
}
