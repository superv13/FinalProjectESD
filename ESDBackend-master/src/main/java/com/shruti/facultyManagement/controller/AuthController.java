package com.shruti.facultyManagement.controller;

import com.shruti.facultyManagement.entity.Employees;
import com.shruti.facultyManagement.payload.request.LoginRequest;
import com.shruti.facultyManagement.payload.response.JwtResponse;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.shruti.facultyManagement.repository.EmployeeRepo;
import com.shruti.facultyManagement.security.JwtUtils;
import com.shruti.facultyManagement.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private EmployeeRepo employeeRepo;
    
    @Autowired
    private PasswordEncoder encoder;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(), 
                loginRequest.getPassword()
            )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String jwt = jwtUtils.generateToken(userDetails);
        
        List<String> roles = userDetails.getAuthorities().stream()
            .map(item -> item.getAuthority())
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(new JwtResponse(
            jwt,
            userDetails.getId().longValue(),
            userDetails.getUsername(),
            userDetails.getEmail(),
            roles
        ));
    }
    
    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshtoken(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        if (jwtUtils.validateJwtToken(token)) {
            String username = jwtUtils.extractUsername(token);
            
            Employees employee = employeeRepo.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
                
            // Create a UserDetails object for token generation using the same method as in UserDetailsImpl
            String role = employee.getRole();
            if (!role.startsWith("ROLE_")) {
                role = "ROLE_" + role;
            }
            
            List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role));
            UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                employee.getEmail(),
                employee.getPassword(),
                authorities
            );
            
            String newToken = jwtUtils.generateToken(userDetails);
            
            // Return roles in the same format as in the signin endpoint
            List<String> roles = authorities.stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
                
            return ResponseEntity.ok(new JwtResponse(
                newToken,
                Long.valueOf(employee.getId()),
                employee.getEmail(),
                employee.getEmail(),
                roles
            ));
        }
        
        return ResponseEntity.badRequest().body("Invalid refresh token");
    }
}
