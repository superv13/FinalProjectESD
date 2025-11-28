package com.shruti.facultyManagement.security.oauth2;

import com.shruti.facultyManagement.security.JwtUtils;
import com.shruti.facultyManagement.security.UserPrincipal;
import com.shruti.facultyManagement.util.CookieUtils;
import jakarta.servlet.http.Cookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import java.util.Optional;

public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtils jwtUtils;
    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;

    public OAuth2AuthenticationSuccessHandler(JwtUtils jwtUtils,
            HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository) {
        this.jwtUtils = jwtUtils;
        this.httpCookieOAuth2AuthorizationRequestRepository = httpCookieOAuth2AuthorizationRequestRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        String targetUrl = determineTargetUrl(request, response, authentication);

        if (response.isCommitted()) {
            logger.debug("Response already committed. Cannot redirect to " + targetUrl);
            return;
        }

        clearAuthenticationAttributes(request, response);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    protected String determineTargetUrl(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) {

        // Always redirect to the frontend OAuth2 handler
        String targetUrl = "http://localhost:3000/oauth2/redirect";

        // Create JWT from UserPrincipal
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String token = jwtUtils.generateToken(userPrincipal);

        // Token must be URL encoded
        String encoded = URLEncoder.encode(token, StandardCharsets.UTF_8);

        // Add token in frontend redirect
        return UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("token", encoded)
                .build()
                .toUriString();
    }

    protected void clearAuthenticationAttributes(HttpServletRequest request,
            HttpServletResponse response) {
        super.clearAuthenticationAttributes(request);
        httpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);
    }
}
