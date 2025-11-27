package com.shruti.facultyManagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan({
    "com.shruti.facultyManagement.config",
    "com.shruti.facultyManagement.controller",
    "com.shruti.facultyManagement.service",
    "com.shruti.facultyManagement.security",
    "com.shruti.facultyManagement.repository"
})
public class EsdMiniProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(EsdMiniProjectApplication.class, args);
    }
}
