package com.thebanmd.helpdesk.exceptions;

/**
 * Ärendet har fel status för den åtgärd anmälaren försöker göra, t.ex. för att
 * IT-ansvarig har hunnit ändra status medan anmälaren redigerade (TB-51),
 * eller för att ärendet varken är löst eller återkallat (TB-73). Svarar 409.
 */
public class TicketNotEditableException extends RuntimeException {
    public TicketNotEditableException() {
        super("Ärendet kan inte ändras längre, eftersom det inte har status Ny.");
    }

    public TicketNotEditableException(String message) {
        super(message);
    }
}
