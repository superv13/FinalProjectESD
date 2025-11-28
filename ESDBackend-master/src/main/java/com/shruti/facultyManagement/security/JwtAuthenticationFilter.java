package com.shruti.facultyManagement.security;

import com.shruti.facultyManagement.service.UserDetailsServiceImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtAuthenticationFilter(JwtUtils jwtUtils, UserDetailsServiceImpl userDetailsService) {
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            System.err.println("JwtAuthenticationFilter: ENTERING doFilterInternal for " + request.getMethod() + " "
                    + request.getRequestURI());
            String jwt = parseJwt(request);
            System.err.println("JwtAuthenticationFilter: Parsed JWT: " + jwt);

            if (jwt != null) {
                boolean isValid = jwtUtils.validateJwtToken(jwt);
                System.err.println("JwtAuthenticationFilter: Token validation result: " + isValid);

                if (isValid) {
                    String username = jwtUtils.extractUsername(jwt);
                    System.err.println("JwtAuthenticationFilter: Extracted username: " + username);

                    UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                    System.err.println("JwtAuthenticationFilter: User loaded: " + userDetails.getUsername());

                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    System.err.println("JwtAuthenticationFilter: Authentication set in context");
                }
            } else {
                System.err.println("JwtAuthenticationFilter: No token found in request");
            }
        } catch (Exception e) {
            System.err.println("JwtAuthenticationFilter Error: " + e.getMessage());
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
        System.err.println("JwtAuthenticationFilter: EXITING doFilterInternal");
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }

        return null;
    }
}
