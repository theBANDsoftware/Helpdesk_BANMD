package com.thebanmd.helpdesk.dtos;

import com.thebanmd.helpdesk.enums.Role;

/**
 * Det som skickas till frontend. Entiteten skickas aldrig direkt, så att
 * databasens struktur kan ändras utan att API:t ändras.
 */
public record UserResponse(Long id, String name, Role role) {}
