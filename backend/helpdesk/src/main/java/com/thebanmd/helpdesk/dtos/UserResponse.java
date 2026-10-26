package com.thebanmd.helpdesk.dtos;

import com.thebanmd.helpdesk.enums.Role;
import com.thebanmd.helpdesk.entities.User;

/**
 * Det som skickas till frontend. Entiteten skickas aldrig direkt, så att
 * databasens struktur kan ändras utan att API:t ändras.
 */
public record UserResponse(Long id, String name, Role role) {

    public static UserResponse from(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getRole());
    }
}
