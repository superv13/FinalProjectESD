package com.shruti.facultyManagement.repository;



import com.shruti.facultyManagement.entity.Courses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CoursesRepo extends JpaRepository<Courses, Integer> {
    Optional<Courses> findByCode(String code);
}
