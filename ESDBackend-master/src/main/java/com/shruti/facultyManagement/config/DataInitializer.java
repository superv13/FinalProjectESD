package com.shruti.facultyManagement.config;

import com.shruti.facultyManagement.entity.Departments;
import com.shruti.facultyManagement.repository.DepartmentsRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(DepartmentsRepo departmentsRepo) {
        return args -> {
            // Check if Administration department exists (ID 11)
            if (departmentsRepo.findByDepartmentId(11).isEmpty()) {
                Departments adminDept = new Departments();
                adminDept.setDepartmentId(11);
                adminDept.setDepartmentName("Administration");
                adminDept.setCapacity(20); // Default capacity
                departmentsRepo.save(adminDept);
                System.out.println("Seeded Administration department (ID 11)");
            }
        };
    }
}
