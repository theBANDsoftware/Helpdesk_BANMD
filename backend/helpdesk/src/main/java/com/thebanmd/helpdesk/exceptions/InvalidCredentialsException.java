package com.thebanmd.helpdesk.exceptions;

/**
 * Fel e-post eller fel lösenord vid inloggning (TB-33). Ger svaret 401.
 * Meddelandet är detsamma i båda fallen, så att ingen kan ta reda på vilka
 * e-postadresser som finns genom att prova.
 */
public class InvalidCredentialsException extends RuntimeException {
    public InvalidCredentialsException() {
        super("Fel e-post eller lösenord.");
    }
}
