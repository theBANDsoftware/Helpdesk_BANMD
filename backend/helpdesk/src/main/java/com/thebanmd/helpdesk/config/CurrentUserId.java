package com.thebanmd.helpdesk.config;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Ger id:t på den inloggade användaren i en controller, t.ex.
 * {@code @CurrentUserId Long userId}. Id:t läses ur inloggningstoken
 * av CurrentUserIdResolver (TB-33). Ersätter headern X-User-Id från beslut 10.
 */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface CurrentUserId {
}
