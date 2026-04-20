package com.movie.recommendation.dto;

import java.util.List;

public class AuthResponse {

    private String token;
    private String username;
    private String fullName;
    private List<String> roles;

    public AuthResponse() {
    }

    public AuthResponse(String token, String username, String fullName, List<String> roles) {
        this.token = token;
        this.username = username;
        this.fullName = fullName;
        this.roles = roles;
    }

    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }

    public String getFullName() {
        return fullName;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
}
