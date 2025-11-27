package com.shruti.facultyManagement.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "employee")
@Data
public class Employees implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // auto_increment primary key

    @Column(name = "employee_id", nullable = false, unique = true)
    private int employeeId;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "title")
    private String title; // can be ROLE_USER / ROLE_ADMIN etc.

    @Column(name = "photo_url")
    private String photographPath; // maps to photo_url column

    @Column(name = "department_ref_id")
    private int department;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "role", nullable = false)
    private String role;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("employee-courses")
    private List<FacultyCourses> facultyCourses;

    public enum AuthProvider {
        GOOGLE,
        LOCAL
    }

    @Enumerated(EnumType.STRING)
    private AuthProvider authProvider; // GOOGLE, LOCAL

    private String googleId; // sub from Google JWT

    // ---- UserDetails methods ----
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
