package com.thebanmd.helpdesk.exceptions;

/** Status Löst sattes utan att det står vad som gjordes (TB-80). Ger svaret 400. */
public class ResolutionRequiredException extends RuntimeException {
    public ResolutionRequiredException() {
        super("Skriv vad som gjordes för att lösa ärendet.");
    }
}
