package com.money.management.auth.controller;

import com.money.management.auth.domain.User;
import com.money.management.auth.service.UserService;
import com.money.management.auth.service.VerificationTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;

@RestController
@RequestMapping("/users")
public class UserController {

    private UserService userService;
    private VerificationTokenService verificationTokenService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "/current", method = RequestMethod.GET)
    public Principal getUser(Principal principal) {
        return principal;
    }

    @RequestMapping(value = "/verification", method = RequestMethod.GET)
    public String mailVerification(@RequestParam("token") String token) {
        return verificationTokenService.enableUser(token);
    }


    @PreAuthorize("#oauth2.hasScope('server')")
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public void createUser(@Valid @RequestBody User user) {
        userService.create(user);
    }
}
