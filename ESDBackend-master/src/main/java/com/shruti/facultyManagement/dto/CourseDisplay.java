package com.shruti.facultyManagement.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CourseDisplay {
    private Integer id;
    private String name;
    private String description;
    private Double credits;
    private String courseCode;

    public CourseDisplay(Integer id, String courseCode) {
        this.id = id;
        this.courseCode = courseCode;
    }
}
