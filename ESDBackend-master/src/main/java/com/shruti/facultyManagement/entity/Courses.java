package com.shruti.facultyManagement.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Objects;

@Entity
@Table(name = "Course")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Courses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Integer id;

    @Column(name = "course_code", nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Integer year;
    private String term;
    
    @Column(nullable = false)
    private Double credits;
    
    private Integer capacity;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    private Employees faculty;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getCredits() {
        return credits;
    }

    public void setCredits(Double credits) {
        this.credits = credits;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Courses courses = (Courses) o;
        return Objects.equals(id, courses.id) && 
               Objects.equals(code, courses.code);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, code);
    }
}
