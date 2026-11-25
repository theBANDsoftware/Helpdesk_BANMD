package com.thebanmd.helpdesk.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.utils.SpringDocUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Swagger med inloggning (TB-33). Logga in med POST /api/auth/login, kopiera token,
 * tryck på "Authorize" och klistra in den. Då skickas den med på alla anrop.
 */
@Configuration
public class OpenApiConfig {

    static {
        // @CurrentUserId fylls i från token och ska inte visas som en parameter i Swagger
        SpringDocUtils.getConfig().addAnnotationsToIgnore(CurrentUserId.class);
    }

    @Bean
    OpenAPI openApi() {
        return new OpenAPI()
            .components(new Components().addSecuritySchemes("token",
                new SecurityScheme().type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")))
            .addSecurityItem(new SecurityRequirement().addList("token"));
    }
}
