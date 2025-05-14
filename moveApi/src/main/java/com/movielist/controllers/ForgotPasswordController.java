package com.movielist.controllers;

import com.movielist.auth.repositories.ForgotPasswordRepository;
import com.movielist.auth.repositories.UserRepository;
import com.movielist.auth.service.ForgotPasswordService;
import com.movielist.auth.utils.ChangePassword;
import com.movielist.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/forgotPassword")
@CrossOrigin(origins = "*")
public class ForgotPasswordController {

    private final ForgotPasswordService forgotPasswordService;

    // Constructor injection
    public ForgotPasswordController(ForgotPasswordService forgotPasswordService) {
        this.forgotPasswordService = forgotPasswordService;
    }

    @PostMapping("/verifyMail/{email}")
    public ResponseEntity<String> verifyEmail(@PathVariable String email) {
        forgotPasswordService.verifyEmail(email);
        return ResponseEntity.ok("Email sent for verification!");
    }

    @PostMapping("/verifyOtp/{otp}/{email}")
    public ResponseEntity<String> verifyOtp(@PathVariable Integer otp, @PathVariable String email) {
        forgotPasswordService.verifyOtp(otp, email);
        return ResponseEntity.ok("OTP verified!");
    }

    @PostMapping("/changePassword/{email}")
    public ResponseEntity<String> changePassword(@RequestBody ChangePassword changePassword, @PathVariable String email) {
        forgotPasswordService.changePassword(email, changePassword);
        return ResponseEntity.ok("Password has been changed!");
    }
}