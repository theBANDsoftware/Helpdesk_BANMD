package com.thebanmd.helpdesk.exceptions;

/** Bilden finns inte, varken i databasen eller i fillagringen (svarar 404). */
public class AttachmentNotFoundException extends RuntimeException {
    public AttachmentNotFoundException(Long id) {
        super("Bilden med id " + id + " finns inte i ärendet");
    }

    public AttachmentNotFoundException(String message) {
        super(message);
    }
}
