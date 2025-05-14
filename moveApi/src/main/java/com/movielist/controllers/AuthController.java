package com.movielist.controllers;

import com.movielist.auth.service.AuthService;
import com.movielist.auth.service.JwtService;
import com.movielist.auth.service.RefreshTokenService;
import com.movielist.auth.utils.AuthResponse;
import com.movielist.auth.utils.LoginRequest;
import com.movielist.auth.utils.RefreshTokenRequest;
import com.movielist.auth.utils.RegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
@CrossOrigin(origins= "*")
public class AuthController {


    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final JwtService jwtService;

    public AuthController(AuthService authService, RefreshTokenService refreshTokenService, JwtService jwtService) {
        this.authService = authService;
        this.refreshTokenService = refreshTokenService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @RequestBody RegisterRequest registerRequest
            ){
return ResponseEntity.ok(authService.register(registerRequest));
    }


    @PostMapping("/login")
    public  ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest){
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest){
        return ResponseEntity.ok(authService.refreshToken(refreshTokenRequest));
    }
}
