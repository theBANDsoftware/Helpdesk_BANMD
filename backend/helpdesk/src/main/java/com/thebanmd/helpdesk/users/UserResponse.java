package com.thebanmd.helpdesk.users;

/**
 * Det som skickas till frontend. Entiteten skickas aldrig direkt, så att
 * databasens struktur kan ändras utan att API:t ändras.
 */
public record UserResponse(Long id, String name, Role role) {

    static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getRole());
    }
}
