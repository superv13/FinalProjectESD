package com.shruti.facultyManagement.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "faculty_course")
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

    public FacultyCourses() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

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

    public Timestamp getAssignedOn() {
        return assignedOn;
    }

    public void setAssignedOn(Timestamp assignedOn) {
        this.assignedOn = assignedOn;
    }

    @PrePersist
    @PreUpdate
    protected void prePersist() {
        if (this.assignedOn == null) {
            this.assignedOn = new Timestamp(System.currentTimeMillis());
        }
    }

    @Override
    public String toString() {
        return "FacultyCourses{" +
                "id=" + id +
                ", employee=" + employee +
                ", course=" + course +
                ", assignedOn=" + assignedOn +
                '}';
    }
}
