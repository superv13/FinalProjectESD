package com.shruti.facultyManagement.repository;

import com.shruti.facultyManagement.entity.Courses;
import com.shruti.facultyManagement.entity.Employees;
import com.shruti.facultyManagement.entity.FacultyCourses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyCoursesRepository extends JpaRepository<FacultyCourses, Integer> {
    
    List<FacultyCourses> findByEmployee_EmployeeId(Integer employeeId);
    
    Optional<FacultyCourses> findByEmployeeAndCourse(Employees employee, Courses course);
    
    @Query("SELECT fc FROM FacultyCourses fc " +
           "JOIN fc.employee e " +
           "JOIN fc.course c " +
           "WHERE e.employeeId = :employeeId AND c.code = :courseCode")
    Optional<FacultyCourses> findByEmployeeIdAndCourseCode(
        @Param("employeeId") Integer employeeId, 
        @Param("courseCode") String courseCode
    );
}
