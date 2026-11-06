package com.thebanmd.helpdesk.exceptions;

/** Filen går inte att bifoga, t.ex. fel filtyp eller för stor (svarar 400). */
public class InvalidAttachmentException extends RuntimeException {
    public InvalidAttachmentException(String message) {
        super(message);
    }
}
