package com.thebanmd.helpdesk.dtos;

/**
 * Svaret när inloggningen lyckas (TB-33). Frontend skickar token i headern
 * Authorization på alla anrop efter det, och visar namn och roll från user.
 */
public record LoginResponse(String token, UserResponse user) {
}
