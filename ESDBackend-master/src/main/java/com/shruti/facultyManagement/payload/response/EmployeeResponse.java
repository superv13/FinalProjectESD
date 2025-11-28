package com.shruti.facultyManagement.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.shruti.facultyManagement.entity.Employees;
import lombok.Data;

import java.util.List;
import java.util.stream.Collectors;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeResponse {
    private int id;
    private int employeeId;
    private String firstName;
    private String lastName;
    private String email;
    private String title;
    private String photographPath;
    private int department;
    private String departmentName;
    private String role;
    private List<String> roles;

    public static EmployeeResponse fromEmployee(Employees employee) {
        if (employee == null) {
            return null;
        }
        
        EmployeeResponse response = new EmployeeResponse();
        response.setId(employee.getId());
        response.setEmployeeId(employee.getEmployeeId());
        response.setFirstName(employee.getFirstName());
        response.setLastName(employee.getLastName());
        response.setEmail(employee.getEmail());
        response.setTitle(employee.getTitle());
        String photo = employee.getPhotographPath();
        if (photo != null && !photo.trim().isEmpty()) {
            // Clean up the photo path - remove any existing base URL
            String baseUrl = "http://localhost:8081/images/";
            if (photo.startsWith(baseUrl)) {
                photo = photo.substring(baseUrl.length());
            } else if (photo.startsWith("http")) {
                // If it's a different URL, use it as is
                response.setPhotographPath(photo);
                return response;
            }
            // Add the base URL only once
            response.setPhotographPath(baseUrl + photo);
        } else {
            response.setPhotographPath(null);
        }
        // Department ID
        if (employee.getDepartment() != null) {
            response.setDepartment(employee.getDepartment().getDepartmentId());
            response.setDepartmentName(employee.getDepartment().getDepartmentName());
        }
        response.setRole(employee.getRole());

        response.setRoles(employee.getRole() != null ? List.of(employee.getRole().split(",")) : null);
        // Department name will be set by the service layer
        return response;
    }

    public static List<EmployeeResponse> fromEmployees(List<Employees> employees) {
        if (employees == null) {
            return List.of();
        }
        return employees.stream()
                .map(EmployeeResponse::fromEmployee)
                .collect(Collectors.toList());
    }
}
