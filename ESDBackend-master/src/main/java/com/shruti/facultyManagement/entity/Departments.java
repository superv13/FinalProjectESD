package com.shruti.facultyManagement.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "department")
public class Departments {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "department_id")
    private int departmentId;

    @Column(name = "department_name")
    private String departmentName;

    private int capacity;

    public Departments() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(int departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    @Override
    public String toString() {
        return "Departments{" +
                "id=" + id +
                ", departmentId=" + departmentId +
                ", departmentName='" + departmentName + '\'' +
                ", capacity=" + capacity +
                '}';
    }
}
