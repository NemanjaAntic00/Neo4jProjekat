package com.movie.recommendation.controller;

import com.movie.recommendation.dto.RecommendationDto;
import com.movie.recommendation.service.RecommendationService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:5173")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/genre")
    public List<RecommendationDto> getGenreRecommendations(Authentication authentication) {
        String username = authentication.getName();
        return recommendationService.getGenreRecommendations(username);
    }

    @GetMapping("/social")
    public List<RecommendationDto> getSocialRecommendations(Authentication authentication) {
        String username = authentication.getName();
        return recommendationService.getSocialRecommendations(username);
    }

    @GetMapping("/collaborative")
    public List<RecommendationDto> getCollaborativeRecommendations(Authentication authentication) {
        String username = authentication.getName();
        return recommendationService.getCollaborativeRecommendations(username);
    }
}
