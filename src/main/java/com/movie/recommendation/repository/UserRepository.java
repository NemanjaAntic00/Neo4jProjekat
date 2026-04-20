package com.movie.recommendation.repository;

import com.movie.recommendation.model.User;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

import java.util.Optional;

public interface UserRepository extends Neo4jRepository<User, String> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Query("MATCH (u:User) RETURN coalesce(max(u.userId), 0)")
    Long findMaxUserId();
}
