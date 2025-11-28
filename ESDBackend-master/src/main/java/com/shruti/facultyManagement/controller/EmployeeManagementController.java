package com.shruti.facultyManagement.controller;

import com.shruti.facultyManagement.dto.CourseDisplay;
import com.shruti.facultyManagement.dto.CourseReqRes;
import com.shruti.facultyManagement.dto.EmployeeReqRes;
import com.shruti.facultyManagement.entity.Employees;
import com.shruti.facultyManagement.payload.response.EmployeeResponse;
import com.shruti.facultyManagement.service.EmployeeManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeManagementController {

    @Autowired
    private EmployeeManagementService employeeManagementService;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable Integer id) {
        return ResponseEntity.ok(employeeManagementService.getEmployeeById(id));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<EmployeeReqRes> getAllEmployees() {
        EmployeeReqRes response = employeeManagementService.getAllEmployees();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<EmployeeResponse> updateEmployee(
            @PathVariable Integer id,
            @RequestBody Employees employeeDetails) {
        try {
            return ResponseEntity.ok(employeeManagementService.updateEmployee(id, employeeDetails));
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Integer id) {
        employeeManagementService.deleteEmployee(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<EmployeeResponse> getMyProfile() {
        return ResponseEntity.ok(employeeManagementService.getMyProfile());
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<EmployeeResponse> getCurrentUser() {
        return ResponseEntity.ok(employeeManagementService.getMyProfile());
    }

    @GetMapping("/{employeeId}/courses")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<CourseDisplay>> getCourses(@PathVariable Integer employeeId) {
        return ResponseEntity.ok(employeeManagementService.getCoursesByEmployeeId(employeeId));
    }

    @GetMapping("/auth/courses")
    public ResponseEntity<CourseReqRes> getAllCourses() {
        List<CourseDisplay> courses = employeeManagementService.getAllCourses();// Ensure this returns all courses
        CourseReqRes response = new CourseReqRes();
        response.setCourseList(courses);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/auth/{employeeId}/course")
    public ResponseEntity<EmployeeReqRes> updateEmployeeCourse(
            @PathVariable Integer employeeId,
            @RequestBody CourseDisplay updateCourseRequest) {
        System.out.println("Request received: Employee ID = " + employeeId + ", Course Code = "
                + updateCourseRequest.getCourseCode());

        EmployeeReqRes response = employeeManagementService.updateCourseForEmployee(employeeId,
                updateCourseRequest.getCourseCode());
        return ResponseEntity.ok(response);
    }

    private static final String PHOTO_DIRECTORY = "src/main/resources/static/images/";

    @PutMapping("/auth/uploadPhoto/{userId}")
    public ResponseEntity<String> uploadPhoto(
            @PathVariable Integer userId,
            @RequestParam("file") MultipartFile file) {
        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            // Always ensure correct file path with "/"
            Path path = Paths.get(PHOTO_DIRECTORY + fileName);

            // Save file
            Files.write(path, file.getBytes());

            // Store ONLY the filename in DB (not the URL!)
            employeeManagementService.updateUserPhoto(userId, fileName);

            return ResponseEntity.ok("Photo uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading photo: " + e.getMessage());
        }
    }

}