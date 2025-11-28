package com.shruti.facultyManagement.dto;

public class CourseDisplay {
    private Integer id;
    private String name;
    private String description;
    private Double credits;
    private String courseCode;

    public CourseDisplay() {
    }

    public CourseDisplay(Integer id, String courseCode) {
        this.id = id;
        this.courseCode = courseCode;
    }

    public CourseDisplay(Integer id, String name, String description, Double credits, String courseCode) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.credits = credits;
        this.courseCode = courseCode;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public String getCourseCode() {
        return courseCode;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }
}
