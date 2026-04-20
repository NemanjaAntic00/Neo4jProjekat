package com.movie.recommendation.dto;

public class MovieDto {

    private Long movieId;
    private String title;
    private Integer year;
    private boolean watched;
    private Integer userRating;

    public MovieDto() {
    }

    public MovieDto(Long movieId, String title, Integer year, boolean watched, Integer userRating) {
        this.movieId = movieId;
        this.title = title;
        this.year = year;
        this.watched = watched;
        this.userRating = userRating;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public String getTitle() {
        return title;
    }

    public Integer getYear() {
        return year;
    }

    public boolean isWatched() {
        return watched;
    }

    public Integer getUserRating() {
        return userRating;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public void setWatched(boolean watched) {
        this.watched = watched;
    }

    public void setUserRating(Integer userRating) {
        this.userRating = userRating;
    }
}