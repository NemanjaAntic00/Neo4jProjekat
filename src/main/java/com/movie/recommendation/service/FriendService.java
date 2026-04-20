package com.movie.recommendation.service;

import com.movie.recommendation.dto.UserSearchDto;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FriendService {

    private final Neo4jClient neo4jClient;

    public FriendService(Neo4jClient neo4jClient) {
        this.neo4jClient = neo4jClient;
    }

    public List<UserSearchDto> searchUsers(String currentUsername, String query) {
        String cypher = """
                MATCH (u:User)
                WHERE toLower(u.username) CONTAINS toLower($query)
                   OR toLower(u.fullName) CONTAINS toLower($query)
                AND u.username <> $currentUsername
                AND NOT EXISTS {
                    MATCH (:User {username: $currentUsername})-[:FRIEND_WITH]->(u)
                }
                OPTIONAL MATCH (u)-[:LIKES_GENRE]->(g:Genre)
                RETURN u.username AS username,
                       u.fullName AS fullName,
                       collect(DISTINCT g.name) AS favoriteGenres
                ORDER BY u.username
                """;

        return neo4jClient.query(cypher)
                .bind(currentUsername).to("currentUsername")
                .bind(query).to("query")
                .fetchAs(UserSearchDto.class)
                .mappedBy((typeSystem, record) -> new UserSearchDto(
                        record.get("username").asString(),
                        record.get("fullName").isNull() ? null : record.get("fullName").asString(),
                        record.get("favoriteGenres").asList(value -> value.isNull() ? null : value.asString())
                                .stream()
                                .filter(v -> v != null && !v.isBlank())
                                .toList()
                ))
                .all()
                .stream()
                .toList();
    }

    public List<UserSearchDto> getFriends(String currentUsername) {
        String cypher = """
                MATCH (:User {username: $currentUsername})-[:FRIEND_WITH]->(f:User)
                OPTIONAL MATCH (f)-[:LIKES_GENRE]->(g:Genre)
                RETURN f.username AS username,
                       f.fullName AS fullName,
                       collect(DISTINCT g.name) AS favoriteGenres
                ORDER BY f.username
                """;

        return neo4jClient.query(cypher)
                .bind(currentUsername).to("currentUsername")
                .fetchAs(UserSearchDto.class)
                .mappedBy((typeSystem, record) -> new UserSearchDto(
                        record.get("username").asString(),
                        record.get("fullName").isNull() ? null : record.get("fullName").asString(),
                        record.get("favoriteGenres").asList(value -> value.isNull() ? null : value.asString())
                                .stream()
                                .filter(v -> v != null && !v.isBlank())
                                .toList()
                ))
                .all()
                .stream()
                .toList();
    }

    public void addFriend(String currentUsername, String friendUsername) {
        String cypher = """
                MATCH (u1:User {username: $currentUsername}), (u2:User {username: $friendUsername})
                WHERE u1.username <> u2.username
                MERGE (u1)-[:FRIEND_WITH]->(u2)
                MERGE (u2)-[:FRIEND_WITH]->(u1)
                """;

        neo4jClient.query(cypher)
                .bind(currentUsername).to("currentUsername")
                .bind(friendUsername).to("friendUsername")
                .run();
    }
}
