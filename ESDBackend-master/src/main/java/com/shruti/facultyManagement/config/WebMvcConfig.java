package com.shruti.facultyManagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Value("${cors.allowedOrigins}")
    private String[] allowedOrigins;

    @Value("${cors.allowedMethods}")
    private String[] allowedMethods;

    @Value("${cors.allowedHeaders}")
    private String allowedHeaders;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(allowedOrigins) // <-- changed from allowedOrigins
                .allowedMethods(allowedMethods)
                .allowedHeaders(allowedHeaders)
                .allowCredentials(true);
    }
}
