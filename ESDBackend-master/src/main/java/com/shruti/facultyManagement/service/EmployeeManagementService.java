package com.shruti.facultyManagement.service;

import com.shruti.facultyManagement.dto.CourseDisplay;
import com.shruti.facultyManagement.dto.EmployeeReqRes;
import com.shruti.facultyManagement.entity.Courses;
import com.shruti.facultyManagement.entity.Employees;
import com.shruti.facultyManagement.entity.FacultyCourses;
import com.shruti.facultyManagement.exception.ResourceNotFoundException;
import com.shruti.facultyManagement.payload.response.EmployeeResponse;
import com.shruti.facultyManagement.repository.CoursesRepo;
import com.shruti.facultyManagement.repository.EmployeeRepo;
import com.shruti.facultyManagement.repository.FacultyCoursesRepository;
import com.shruti.facultyManagement.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class EmployeeManagementService {

    private final EmployeeRepo employeeRepo;
    private final CoursesRepo coursesRepo;
    private final FacultyCoursesRepository facultyCoursesRepository;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    @PersistenceContext
    private EntityManager entityManager;

    @Value("${app.image.base-url}")
    private String imageBaseUrl;

    @Autowired
    public EmployeeManagementService(EmployeeRepo employeeRepo,
                                     CoursesRepo coursesRepo,
                                     FacultyCoursesRepository facultyCoursesRepository,
                                     JwtUtils jwtUtils,
                                     AuthenticationManager authenticationManager,
                                     PasswordEncoder passwordEncoder) {
        this.employeeRepo = employeeRepo;
        this.coursesRepo = coursesRepo;
        this.facultyCoursesRepository = facultyCoursesRepository;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }

    // Employee Management
    @Transactional(readOnly = true)
    public EmployeeResponse getEmployeeById(Integer id) {
        Employees employee = employeeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        EmployeeResponse response = EmployeeResponse.fromEmployee(employee);
        response.setDepartmentName(getDepartmentName(employee.getDepartment()));
        return response;
    }
    
    private String getDepartmentName(int departmentId) {
        // Map department IDs to names
        return switch (departmentId) {
            case 1 -> "Computer Science";
            case 2 -> "Electronics";
            case 3 -> "Mechanical";
            case 4 -> "Civil";
            case 5 -> "Electrical";
            case 6 -> "Information Technology";
            case 7 -> "Artificial Intelligence";
            case 8 -> "Data Science";
            case 9 -> "Cyber Security";
            case 10 -> "Robotics";
            default -> "Department " + departmentId;
        };
    }

    public EmployeeReqRes getAllEmployees() {
        EmployeeReqRes response = new EmployeeReqRes();
        try {
            List<Employees> employees = employeeRepo.findAll();
            
            // Convert employees to EmployeeResponse to handle photo URLs properly
            List<EmployeeResponse> employeeResponses = employees.stream()
                .map(employee -> {
                    EmployeeResponse empResponse = EmployeeResponse.fromEmployee(employee);
                    empResponse.setDepartmentName(getDepartmentName(employee.getDepartment()));
                    return empResponse;
                })
                .collect(Collectors.toList());
            
            response.setEmployeesList(employeeResponses);
            response.setStatusCode(200);
            response.setMessage("Success");
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error fetching employees: " + e.getMessage());
        }
        return response;
    }

    public EmployeeResponse updateEmployee(Integer id, Employees employeeDetails) {
        Employees employee = employeeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        // Update employee details
        employee.setFirstName(employeeDetails.getFirstName());
        employee.setLastName(employeeDetails.getLastName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setTitle(employeeDetails.getTitle());
        employee.setDepartment(employeeDetails.getDepartment());
        employee.setRole(employeeDetails.getRole());

        if (employeeDetails.getPassword() != null && !employeeDetails.getPassword().isEmpty()) {
            employee.setPassword(passwordEncoder.encode(employeeDetails.getPassword()));
        }

        Employees updatedEmployee = employeeRepo.save(employee);
        return EmployeeResponse.fromEmployee(updatedEmployee);
    }

    public void deleteEmployee(Integer id) {
        Employees employee = employeeRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        employeeRepo.delete(employee);
    }

    public EmployeeResponse getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        Employees employee = employeeRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with email: " + email));
                
        EmployeeResponse response = EmployeeResponse.fromEmployee(employee);
        response.setDepartmentName(getDepartmentName(employee.getDepartment()));
        return response;
    }

    // Authentication
    public EmployeeReqRes login(EmployeeReqRes loginRequest) {
        EmployeeReqRes response = new EmployeeReqRes();
        try {
            // Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Get user details
            Employees user = employeeRepo.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Generate JWT token
            String username = authentication.getName();
            String jwt = jwtUtils.generateToken(username);

            // Set response
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setExpirationTime("24Hr");
            response.setMessage("Login successful");
            response.setEmployeeId(user.getEmployeeId());
            response.setEmail(user.getEmail());
            response.setRole(user.getRole());
            response.setTitle(user.getTitle());

        } catch (Exception e) {
            response.setStatusCode(401);
            response.setMessage("Invalid email or password");
        }
        return response;
    }

    public EmployeeReqRes refreshToken(EmployeeReqRes refreshTokenRequest) {
        EmployeeReqRes response = new EmployeeReqRes();
        try {
            String userEmail = jwtUtils.extractUsername(refreshTokenRequest.getToken());

            // Validate token and fetch user
            Employees user = employeeRepo.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            if (jwtUtils.isTokenValid(refreshTokenRequest.getToken(), user)) {
                String jwt = jwtUtils.generateToken(user);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenRequest.getToken());
                response.setExpirationTime("24Hr");
                response.setMessage("Successfully Refreshed Token");
                response.setEmployeeId(user.getEmployeeId());
                response.setEmail(user.getEmail());
                response.setRole(user.getRole());
                response.setTitle(user.getTitle());
            } else {
                response.setStatusCode(401);
                response.setMessage("Invalid refresh token");
            }
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error refreshing token: " + e.getMessage());
        }
        return response;
    }

    // Course Management
    public List<CourseDisplay> getCoursesByEmployeeId(Integer employeeId) {
        return facultyCoursesRepository.findByEmployee_EmployeeId(employeeId).stream()
                .map(fc -> {
                    CourseDisplay cd = new CourseDisplay();
                    cd.setId(fc.getCourse().getId());
                    cd.setName(fc.getCourse().getName());
                    cd.setDescription(fc.getCourse().getDescription());
                    cd.setCredits(fc.getCourse().getCredits());
                    return cd;
                })
                .collect(Collectors.toList());
    }

    public List<CourseDisplay> getAllCourses() {
        return coursesRepo.findAll().stream()
                .map(course -> {
                    CourseDisplay cd = new CourseDisplay();
                    cd.setId(course.getId());
                    cd.setName(course.getName());
                    cd.setDescription(course.getDescription());
                    cd.setCredits(course.getCredits());
                    return cd;
                })
                .collect(Collectors.toList());
    }

    public EmployeeReqRes updateCourseForEmployee(Integer employeeId, String courseCode) {
        EmployeeReqRes response = new EmployeeReqRes();
        try {
            // Find employee by employeeId
            Employees employee = employeeRepo.findByEmployeeId(employeeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));
            
            // Find course by course code
            Courses course = coursesRepo.findByCode(courseCode)
                    .orElseThrow(() -> new ResourceNotFoundException("Course not found with code: " + courseCode));
            
            // Check if the course is already assigned
            Optional<FacultyCourses> existingAssignment = facultyCoursesRepository
                    .findByEmployeeIdAndCourseCode(employeeId, courseCode);
            
            if (existingAssignment.isPresent()) {
                response.setStatusCode(400);
                response.setMessage("Course already assigned to this employee");
                return response;
            }
            
            // Create new assignment
            FacultyCourses facultyCourse = new FacultyCourses();
            facultyCourse.setEmployee(employee);
            facultyCourse.setCourse(course);
            facultyCoursesRepository.save(facultyCourse);
            
            response.setStatusCode(200);
            response.setMessage("Course assigned successfully");
            
        } catch (ResourceNotFoundException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error assigning course: " + e.getMessage());
        }
        return response;
    }

    public EmployeeReqRes updateUserPhoto(Integer userId, String fileName) {
        EmployeeReqRes response = new EmployeeReqRes();
        try {
            Employees employee = employeeRepo.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            // Ensure we only store the filename, not the full path or URL
            String cleanFileName = fileName;
            if (fileName != null) {
                // Remove any path information
                cleanFileName = Paths.get(fileName).getFileName().toString();
                
                // If it's a URL, extract just the filename
                if (cleanFileName.contains("/")) {
                    cleanFileName = cleanFileName.substring(cleanFileName.lastIndexOf('/') + 1);
                }
            }
            
            employee.setPhotographPath(cleanFileName);
            employeeRepo.save(employee);

            response.setStatusCode(200);
            response.setMessage("Profile photo updated successfully");

        } catch (ResourceNotFoundException e) {
            response.setStatusCode(404);
            response.setMessage(e.getMessage());
        } catch (Exception e) {
            response.setStatusCode(500);
            response.setMessage("Error updating profile photo: " + e.getMessage());
        }
        return response;
    }
}