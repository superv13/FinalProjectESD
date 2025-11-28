package com.shruti.facultyManagement.security.oauth2;

import com.shruti.facultyManagement.entity.Employees.AuthProvider;
import com.shruti.facultyManagement.entity.Employees;
import com.shruti.facultyManagement.exception.OAuth2AuthenticationProcessingException;
import com.shruti.facultyManagement.repository.EmployeeRepo;
import com.shruti.facultyManagement.repository.EmployeeRepo;
import com.shruti.facultyManagement.security.UserPrincipal;
import com.shruti.facultyManagement.security.oauth2.user.OAuth2UserInfo;
import com.shruti.facultyManagement.security.oauth2.user.OAuth2UserInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private EmployeeRepo employeeRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            // Throwing an instance of AuthenticationException will trigger the
            // OAuth2AuthenticationFailureHandler
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(
                oAuth2UserRequest.getClientRegistration().getRegistrationId(),
                oAuth2User.getAttributes());

        if (!StringUtils.hasText(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }

        Optional<Employees> userOptional = employeeRepository.findByEmail(oAuth2UserInfo.getEmail());
        Employees user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (!user.getAuthProvider().equals(AuthProvider
                    .valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId().toUpperCase()))) {
                throw new OAuth2AuthenticationProcessingException("Looks like you're signed up with " +
                        user.getAuthProvider() + " account. Please use your " + user.getAuthProvider() +
                        " account to login.");
            }
            user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
        }

        return UserPrincipal.create(user, oAuth2User.getAttributes());
    }

    private Employees registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        Employees user = new Employees();
        user.setAuthProvider(
                AuthProvider.valueOf(oAuth2UserRequest.getClientRegistration().getRegistrationId().toUpperCase()));
        if (oAuth2UserRequest.getClientRegistration().getRegistrationId().equalsIgnoreCase("google")) {
            user.setGoogleId(oAuth2UserInfo.getId());
        }
        user.setFirstName(oAuth2UserInfo.getName().split(" ")[0]);
        user.setLastName(oAuth2UserInfo.getName().split(" ").length > 1 ? oAuth2UserInfo.getName().split(" ")[1] : "");
        user.setEmail(oAuth2UserInfo.getEmail());
        user.setPhotographPath(oAuth2UserInfo.getImageUrl());
        // Set default role or any other default values
        return employeeRepository.save(user);
    }

    private Employees updateExistingUser(Employees existingUser, OAuth2UserInfo oAuth2UserInfo) {
        existingUser.setFirstName(oAuth2UserInfo.getName().split(" ")[0]);
        existingUser.setLastName(
                oAuth2UserInfo.getName().split(" ").length > 1 ? oAuth2UserInfo.getName().split(" ")[1] : "");
        existingUser.setPhotographPath(oAuth2UserInfo.getImageUrl());
        return employeeRepository.save(existingUser);
    }
}
