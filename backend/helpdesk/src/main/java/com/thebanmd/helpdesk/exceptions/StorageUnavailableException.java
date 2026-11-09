package com.thebanmd.helpdesk.exceptions;

/** B2-bucketen svarar inte eller är inte inställd i .env (svarar 503). */
public class StorageUnavailableException extends RuntimeException {
    public StorageUnavailableException(String message, Throwable cause) {
        super(message, cause);
    }
}
