package com.shruti.facultyManagement.service;

import com.shruti.facultyManagement.entity.Employees;
import com.shruti.facultyManagement.repository.EmployeeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Autowired
    EmployeeRepo employeeRepo;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Employees employee = employeeRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));

        return UserDetailsImpl.build(employee);
    }
}
