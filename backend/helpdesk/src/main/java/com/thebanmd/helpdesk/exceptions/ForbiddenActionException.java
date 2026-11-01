package com.thebanmd.helpdesk.exceptions;

/** Den valda användaren har inte rätt roll för att göra ändringen. Ger svaret 403. */
public class ForbiddenActionException extends RuntimeException {
    public ForbiddenActionException(String message) {
        super(message);
    }
}
