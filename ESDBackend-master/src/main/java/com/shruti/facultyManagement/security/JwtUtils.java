package com.shruti.facultyManagement.security;

import com.shruti.facultyManagement.entity.Employees;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expirationMs}")
    private int jwtExpirationMs;

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        // Add user roles to claims
        claims.put("roles", userDetails.getAuthorities().stream()
                .map(grantedAuthority -> grantedAuthority.getAuthority())
                .collect(java.util.stream.Collectors.toList()));
        return createToken(claims, userDetails.getUsername());
    }
    
    public String generateToken(String username) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        JwtBuilder builder = Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256);
                
        // Add roles claim if available in the claims map
        if (claims.containsKey("roles")) {
            builder.claim("roles", claims.get("roles"));
        }
        
        return builder.compact();
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            logger.error("JWT token validation error: {}", e.getMessage());
            return false;
        }
    }

    public boolean isTokenValid(String token, Employees user) {
        try {
            // Extract username from the token
            String username = extractUsername(token);
            
            // Check if the token is expired
            if (isTokenExpired(token)) {
                return false;
            }
            
            // Check if the username in the token matches the user's email
            // and the token is not expired
            return (username.equals(user.getEmail()));
        } catch (Exception e) {
            logger.error("Token validation error: {}", e.getMessage());
            return false;
        }
    }
}
