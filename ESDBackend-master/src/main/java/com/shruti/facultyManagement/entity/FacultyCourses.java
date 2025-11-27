package com.shruti.facultyManagement.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "faculty_course")
@Data
@NoArgsConstructor
public class FacultyCourses {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "emp_id", referencedColumnName = "employee_id", nullable = false)
    @JsonBackReference("employee-courses")
    private Employees employee;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Courses course;

    @Column(name = "assigned_on")
    private Timestamp assignedOn = new Timestamp(System.currentTimeMillis());

    // Getter for employee
    public Employees getEmployee() {
        return this.employee;
    }
    
    // Setter for employee
    public void setEmployee(Employees employee) {
        this.employee = employee;
    }
    
    // Getter for course
    public Courses getCourse() {
        return this.course;
    }
    
    // Setter for course
    public void setCourse(Courses course) {
        this.course = course;
    }

    @PrePersist
    @PreUpdate
    protected void prePersist() {
        if (this.assignedOn == null) {
            this.assignedOn = new Timestamp(System.currentTimeMillis());
        }
    }
}
