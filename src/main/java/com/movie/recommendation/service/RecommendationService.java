package com.movie.recommendation.service;

import com.movie.recommendation.dto.RecommendationDto;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
public class RecommendationService {

    private final Neo4jClient neo4jClient;

    public RecommendationService(Neo4jClient neo4jClient) {
        this.neo4jClient = neo4jClient;
    }

    public List<RecommendationDto> getGenreRecommendations(String username) {
        String query = """
                MATCH (u:User {username: $username})-[:LIKES_GENRE]->(g:Genre)<-[:HAS_GENRE]-(m:Movie)
                WHERE NOT (u)-[:WATCHED]->(m)
                RETURN m.title AS recommendedMovie,
                       m.year AS year,
                       collect(DISTINCT g.name) AS reasons,
                       toFloat(count(DISTINCT g)) AS score
                ORDER BY score DESC, year DESC
                """;

        Collection<RecommendationDto> results = neo4jClient.query(query)
                .bind(username).to("username")
                .fetchAs(RecommendationDto.class)
                .mappedBy((typeSystem, record) -> new RecommendationDto(
                        record.get("recommendedMovie").asString(),
                        record.get("year").isNull() ? null : record.get("year").asInt(),
                        record.get("reasons").asList(value -> value.asString()),
                        record.get("score").isNull() ? 0.0 : record.get("score").asDouble()
                ))
                .all();

        return List.copyOf(results);
    }

    public List<RecommendationDto> getSocialRecommendations(String username) {
        String query = """
                MATCH (u:User {username: $username})-[:FRIEND_WITH]->(friend:User)-[:WATCHED]->(m:Movie)
                WHERE NOT (u)-[:WATCHED]->(m)
                RETURN m.title AS recommendedMovie,
                       m.year AS year,
                       collect(DISTINCT friend.username) AS reasons,
                       toFloat(count(DISTINCT friend)) AS score
                ORDER BY score DESC, year DESC
                """;

        Collection<RecommendationDto> results = neo4jClient.query(query)
                .bind(username).to("username")
                .fetchAs(RecommendationDto.class)
                .mappedBy((typeSystem, record) -> new RecommendationDto(
                        record.get("recommendedMovie").asString(),
                        record.get("year").isNull() ? null : record.get("year").asInt(),
                        record.get("reasons").asList(value -> value.asString()),
                        record.get("score").isNull() ? 0.0 : record.get("score").asDouble()
                ))
                .all();

        return List.copyOf(results);
    }

    public List<RecommendationDto> getCollaborativeRecommendations(String username) {
        String query = """
            MATCH (u:User {username: $username})-[r1:RATED]->(common:Movie)<-[r2:RATED]-(similar:User)
            WHERE u <> similar
              AND r1.score >= 4
              AND r2.score >= 4
            WITH u, similar, count(common) AS similarityScore
            WHERE similarityScore >= 2

            MATCH (similar)-[r:RATED]->(m:Movie)
            WHERE r.score >= 4
              AND NOT (u)-[:WATCHED]->(m)
              AND NOT (u)-[:RATED]->(m)

            RETURN m.title AS recommendedMovie,
                   m.year AS year,
                   collect(DISTINCT similar.username) AS reasons,
                   toFloat(max(similarityScore)) AS score
            ORDER BY score DESC, year DESC
            """;

        return neo4jClient.query(query)
                .bind(username).to("username")
                .fetchAs(RecommendationDto.class)
                .mappedBy((typeSystem, record) -> new RecommendationDto(
                        record.get("recommendedMovie").asString(),
                        record.get("year").isNull() ? null : record.get("year").asInt(),
                        record.get("reasons").asList(value -> value.asString()),
                        record.get("score").isNull() ? 0.0 : record.get("score").asDouble()
                ))
                .all()
                .stream()
                .toList();
    }
}