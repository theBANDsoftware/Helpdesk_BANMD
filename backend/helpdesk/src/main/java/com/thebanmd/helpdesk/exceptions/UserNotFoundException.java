package com.thebanmd.helpdesk.exceptions;

/**
 * Kastas när en användare med ett visst id inte finns i databasen.
 * ApiExceptionHandler gör om den till 404, så att frontend kan skicka
 * tillbaka till användarlistan.
 */
public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(Long id) {
        super("Användaren med id " + id + " finns inte");
    }
}
