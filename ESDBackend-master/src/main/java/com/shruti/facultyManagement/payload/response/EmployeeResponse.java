package com.shruti.facultyManagement.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.shruti.facultyManagement.entity.Employees;

import java.util.List;
import java.util.stream.Collectors;

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

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(int employeeId) {
        this.employeeId = employeeId;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPhotographPath() {
        return photographPath;
    }

    public void setPhotographPath(String photographPath) {
        this.photographPath = photographPath;
    }

    public int getDepartment() {
        return department;
    }

    public void setDepartment(int department) {
        this.department = department;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

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
