package com.shruti.facultyManagement.dto;

import com.shruti.facultyManagement.entity.Employees;
import com.shruti.facultyManagement.payload.response.EmployeeResponse;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class EmployeeReqRes {

    private int statusCode;
    private String message;
    private String error;
    private String token;
    private String refreshToken;
    private String expirationTime;
    private int employeeId;
    private String firstName;
    private String lastName;
    private String email;
    private String title;
    private String photograph_path;
    private String department;
    private String password;
    private String role;
    private Employees employees;
    private List<EmployeeResponse> employeesList;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getExpirationTime() {
        return expirationTime;
    }

    public void setExpirationTime(String expirationTime) {
        this.expirationTime = expirationTime;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(int employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhotograph_path() {
        return photograph_path;
    }

    public void setPhotograph_path(String photograph_path) {
        this.photograph_path = photograph_path;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Employees getEmployees() {
        return employees;
    }

    public void setEmployees(Employees employees) {
        this.employees = employees;
    }
    
    public List<EmployeeResponse> getEmployeesList() {
        return employeesList;
    }
    
    public void setEmployeesList(List<EmployeeResponse> employeesList) {
        this.employeesList = employeesList;
    }


    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
