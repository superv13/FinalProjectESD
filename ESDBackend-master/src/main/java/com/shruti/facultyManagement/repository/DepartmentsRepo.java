package com.shruti.facultyManagement.repository;

import com.shruti.facultyManagement.entity.Departments;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentsRepo extends JpaRepository<Departments, Integer> {
    Optional<Departments> findByDepartmentId(int departmentId);
}
