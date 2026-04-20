package com.movie.recommendation.dto;

import java.util.List;

public record RecommendationDto(
        String recommendedMovie,
        Integer year,
        List<String> reasons,
        Double score
) {
}