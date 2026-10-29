package com.thebanmd.helpdesk.exceptions;

public class TicketNotFoundException  extends RuntimeException {
    public TicketNotFoundException(Long id) {
        super("Ärendet med id " + id + " finns inte");
    }
}
