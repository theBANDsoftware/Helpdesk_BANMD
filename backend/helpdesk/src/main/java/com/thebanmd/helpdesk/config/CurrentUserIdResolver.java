package com.thebanmd.helpdesk.config;

import org.springframework.core.MethodParameter;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * Fyller i parametrar med @CurrentUserId (TB-33). När anropet når controllern har
 * Spring Security redan kontrollerat token och lagt den i SecurityContext.
 * Användarens id står i token som "subject", eftersom AuthService lägger det där.
 */
public class CurrentUserIdResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUserId.class)
            && parameter.getParameterType().equals(Long.class);
    }

    @Override
    public Long resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof JwtAuthenticationToken token)) {
            // Ska inte hända, eftersom SecurityConfig bara släpper igenom anrop med giltig token
            throw new AuthenticationCredentialsNotFoundException("Du är inte inloggad.");
        }
        return Long.valueOf(token.getToken().getSubject());
    }
}
