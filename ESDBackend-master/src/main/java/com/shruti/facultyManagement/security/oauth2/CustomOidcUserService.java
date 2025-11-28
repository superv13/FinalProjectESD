package com.shruti.facultyManagement.security.oauth2;

import com.shruti.facultyManagement.entity.Employees;
import com.shruti.facultyManagement.entity.Employees.AuthProvider;
import com.shruti.facultyManagement.exception.OAuth2AuthenticationProcessingException;
import com.shruti.facultyManagement.repository.EmployeeRepo;
import com.shruti.facultyManagement.security.UserPrincipal;
import com.shruti.facultyManagement.security.oauth2.user.OAuth2UserInfo;
import com.shruti.facultyManagement.security.oauth2.user.OAuth2UserInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
public class CustomOidcUserService extends OidcUserService {

    @Autowired
    private EmployeeRepo employeeRepository;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) throws OAuth2AuthenticationException {
        OidcUser oidcUser = super.loadUser(userRequest);

        try {
            return processOidcUser(userRequest, oidcUser);
        } catch (AuthenticationException ex) {
            throw ex;
        } catch (Exception ex) {
            // Throwing an instance of AuthenticationException will trigger the
            // OAuth2AuthenticationFailureHandler
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OidcUser processOidcUser(OidcUserRequest userRequest, OidcUser oidcUser) {
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(
                userRequest.getClientRegistration().getRegistrationId(),
                oidcUser.getAttributes());

        if (!StringUtils.hasText(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationProcessingException("Email not found from OAuth2 provider");
        }

        Optional<Employees> userOptional = employeeRepository.findByEmail(oAuth2UserInfo.getEmail());
        Employees user;
        if (userOptional.isPresent()) {
            user = userOptional.get();
            if (!user.getAuthProvider().equals(
                    AuthProvider.valueOf(userRequest.getClientRegistration().getRegistrationId().toUpperCase()))) {
                throw new OAuth2AuthenticationProcessingException("Looks like you're signed up with " +
                        user.getAuthProvider() + " account. Please use your " + user.getAuthProvider() +
                        " account to login.");
            }
            user = updateExistingUser(user, oAuth2UserInfo);
        } else {
            user = registerNewUser(userRequest, oAuth2UserInfo);
        }

        return UserPrincipal.create(user, oidcUser.getAttributes(), oidcUser.getIdToken(), oidcUser.getUserInfo());
    }

    private Employees registerNewUser(OidcUserRequest userRequest, OAuth2UserInfo oAuth2UserInfo) {
        Employees user = new Employees();
        user.setAuthProvider(
                AuthProvider.valueOf(userRequest.getClientRegistration().getRegistrationId().toUpperCase()));
        if (userRequest.getClientRegistration().getRegistrationId().equalsIgnoreCase("google")) {
            user.setGoogleId(oAuth2UserInfo.getId());
        }
        user.setFirstName(oAuth2UserInfo.getName().split(" ")[0]);
        user.setLastName(oAuth2UserInfo.getName().split(" ").length > 1 ? oAuth2UserInfo.getName().split(" ")[1] : "");
        user.setEmail(oAuth2UserInfo.getEmail());
        user.setPhotographPath(oAuth2UserInfo.getImageUrl());
        user.setRole("USER"); // Default role
        user.setPassword(java.util.UUID.randomUUID().toString()); // Set dummy password
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
