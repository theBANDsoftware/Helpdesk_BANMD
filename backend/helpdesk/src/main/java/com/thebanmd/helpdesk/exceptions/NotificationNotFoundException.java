package com.thebanmd.helpdesk.exceptions;

/**
 * Kastas när notisen inte finns, eller inte är användarens egen.
 * ApiExceptionHandler gör om den till 404.
 */
public class NotificationNotFoundException extends RuntimeException {
	public NotificationNotFoundException(Long id) {
		super("Notisen med id " + id + " finns inte");
	}
}
