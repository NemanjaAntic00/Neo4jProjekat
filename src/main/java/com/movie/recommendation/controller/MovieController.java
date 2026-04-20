package com.movie.recommendation.controller;

import com.movie.recommendation.dto.MovieDto;
import com.movie.recommendation.dto.RateMovieRequest;
import com.movie.recommendation.service.MovieService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:5173")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    @GetMapping("/all")
    public List<MovieDto> getAllMovies(Authentication authentication) {
        String username = authentication.getName();
        return movieService.getAllMoviesForUser(username);
    }

    @PostMapping("/watch/{movieId}")
    public String markAsWatched(@PathVariable Long movieId, Authentication authentication) {
        String username = authentication.getName();
        movieService.markAsWatched(username, movieId);
        return "Film je označen kao gledan.";
    }

    @PostMapping("/rate")
    public String rateMovie(@RequestBody RateMovieRequest request, Authentication authentication) {
        String username = authentication.getName();
        movieService.rateMovie(username, request);
        return "Film je uspešno ocenjen.";
    }
}
