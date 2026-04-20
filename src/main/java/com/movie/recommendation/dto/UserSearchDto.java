package com.movie.recommendation.dto;

import java.util.List;

public class UserSearchDto {

    private String username;
    private String fullName;
    private List<String> favoriteGenres;

    public UserSearchDto() {
    }

    public UserSearchDto(String username, String fullName, List<String> favoriteGenres) {
        this.username = username;
        this.fullName = fullName;
        this.favoriteGenres = favoriteGenres;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public List<String> getFavoriteGenres() {
        return favoriteGenres;
    }

    public void setFavoriteGenres(List<String> favoriteGenres) {
        this.favoriteGenres = favoriteGenres;
    }
}
