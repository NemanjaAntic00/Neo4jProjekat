package com.movie.recommendation.service;

import com.movie.recommendation.dto.AuthResponse;
import com.movie.recommendation.dto.LoginRequest;
import com.movie.recommendation.dto.RegisterRequest;
import com.movie.recommendation.model.User;
import com.movie.recommendation.repository.UserRepository;
import com.movie.recommendation.security.JwtService;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final Neo4jClient neo4jClient;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       Neo4jClient neo4jClient) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.neo4jClient = neo4jClient;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new RuntimeException("Username već postoji.");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email već postoji.");
        }

        Long maxUserId = userRepository.findMaxUserId();
        Long newUserId = (maxUserId == null ? 1L : maxUserId + 1);

        User user = new User();
        user.setUserId(newUserId);
        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(List.of("ROLE_USER"));

        userRepository.save(user);

        if (request.getFavoriteGenres() != null && !request.getFavoriteGenres().isEmpty()) {
            for (String genreName : request.getFavoriteGenres()) {
                String query = """
                        MATCH (u:User {username: $username}), (g:Genre {name: $genreName})
                        MERGE (u)-[:LIKES_GENRE]->(g)
                        """;

                neo4jClient.query(query)
                        .bind(user.getUsername()).to("username")
                        .bind(genreName).to("genreName")
                        .run();
            }
        }

        String token = jwtService.generateToken(user.getUsername(), user.getRoles());

        return new AuthResponse(token, user.getUsername(), user.getFullName(), user.getRoles());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Pogrešan username ili password."));

        if (user.getPassword() == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Pogrešan username ili password.");
        }

        String token = jwtService.generateToken(user.getUsername(), user.getRoles());

        return new AuthResponse(token, user.getUsername(), user.getFullName(), user.getRoles());
    }
}
