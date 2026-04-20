package com.movie.recommendation.dto;

public class RateMovieRequest {

    private Long movieId;
    private Integer score;

    public RateMovieRequest() {
    }

    public Long getMovieId() {
        return movieId;
    }

    public Integer getScore() {
        return score;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}
