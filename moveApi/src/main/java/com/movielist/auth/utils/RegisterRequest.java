package com.movielist.auth.utils;

import com.movielist.auth.entity.UserRole;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String name;
    private String email;
    private String username;
    private String password;
    private UserRole role;


}
