package com.movie.recommendation.service;

import com.movie.recommendation.dto.MovieDto;
import com.movie.recommendation.dto.RateMovieRequest;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieService {

    private final Neo4jClient neo4jClient;

    public MovieService(Neo4jClient neo4jClient) {
        this.neo4jClient = neo4jClient;
    }

    public List<MovieDto> getAllMoviesForUser(String username) {
        String query = """
                MATCH (m:Movie)
                OPTIONAL MATCH (u:User {username: $username})-[w:WATCHED]->(m)
                OPTIONAL MATCH (u)-[r:RATED]->(m)
                RETURN m.movieId AS movieId,
                       m.title AS title,
                       m.year AS year,
                       CASE WHEN w IS NULL THEN false ELSE true END AS watched,
                       r.score AS userRating
                ORDER BY m.title
                """;

        return neo4jClient.query(query)
                .bind(username).to("username")
                .fetchAs(MovieDto.class)
                .mappedBy((typeSystem, record) -> new MovieDto(
                        record.get("movieId").asLong(),
                        record.get("title").asString(),
                        record.get("year").isNull() ? null : record.get("year").asInt(),
                        record.get("watched").asBoolean(),
                        record.get("userRating").isNull() ? null : record.get("userRating").asInt()
                ))
                .all()
                .stream()
                .toList();
    }

    public void markAsWatched(String username, Long movieId) {
        String query = """
                MATCH (u:User {username: $username}), (m:Movie {movieId: $movieId})
                MERGE (u)-[:WATCHED]->(m)
                """;

        neo4jClient.query(query)
                .bind(username).to("username")
                .bind(movieId).to("movieId")
                .run();
    }

    public void rateMovie(String username, RateMovieRequest request) {
        String query = """
                MATCH (u:User {username: $username}), (m:Movie {movieId: $movieId})
                MERGE (u)-[:WATCHED]->(m)
                MERGE (u)-[r:RATED]->(m)
                SET r.score = $score
                """;

        neo4jClient.query(query)
                .bind(username).to("username")
                .bind(request.getMovieId()).to("movieId")
                .bind(request.getScore()).to("score")
                .run();
    }
}
