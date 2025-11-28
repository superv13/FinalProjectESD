package com.shruti.facultyManagement.security.oauth2;

import com.shruti.facultyManagement.util.CookieUtils;
import jakarta.servlet.http.Cookie;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

import org.springframework.web.util.UriComponentsBuilder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import static com.shruti.facultyManagement.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepository.REDIRECT_URI_PARAM_COOKIE_NAME;

public class OAuth2AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;

    public OAuth2AuthenticationFailureHandler(
            HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository) {
        this.httpCookieOAuth2AuthorizationRequestRepository = httpCookieOAuth2AuthorizationRequestRepository;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException exception) throws IOException {

        // Get redirect URI from cookie or default "/"
        String targetUrl = CookieUtils.getCookie(request, REDIRECT_URI_PARAM_COOKIE_NAME)
                .orElse("/");

        // Encode error message to prevent Illegal character error in URL
        String encodedError = URLEncoder.encode(exception.getLocalizedMessage(), StandardCharsets.UTF_8);

        // Build final redirect URI
        targetUrl = UriComponentsBuilder.fromUriString(targetUrl)
                .queryParam("error", encodedError)
                .build()
                .toUriString();

        // Clean cookies
        httpCookieOAuth2AuthorizationRequestRepository.removeAuthorizationRequestCookies(request, response);

        // Redirect safely
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
