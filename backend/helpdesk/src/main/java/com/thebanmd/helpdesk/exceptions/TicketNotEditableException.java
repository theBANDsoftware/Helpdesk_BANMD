package com.thebanmd.helpdesk.exceptions;

/**
 * Ärendet har inte längre status NEW, t.ex. för att IT-ansvarig har hunnit
 * ändra status medan anmälaren redigerade (TB-51). Svarar 409.
 */
public class TicketNotEditableException extends RuntimeException {
    public TicketNotEditableException() {
        super("Ärendet kan inte ändras längre, eftersom det inte har status Ny.");
    }
}
