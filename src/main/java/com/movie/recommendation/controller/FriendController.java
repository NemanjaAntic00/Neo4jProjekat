package com.movie.recommendation.controller;

import com.movie.recommendation.dto.UserSearchDto;
import com.movie.recommendation.service.FriendService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@CrossOrigin(origins = "http://localhost:5173")
public class FriendController {

    private final FriendService friendService;

    public FriendController(FriendService friendService) {
        this.friendService = friendService;
    }

    @GetMapping
    public List<UserSearchDto> getFriends(Authentication authentication) {
        String username = authentication.getName();
        return friendService.getFriends(username);
    }

    @GetMapping("/search")
    public List<UserSearchDto> searchUsers(@RequestParam String query, Authentication authentication) {
        String username = authentication.getName();
        return friendService.searchUsers(username, query);
    }

    @PostMapping("/add/{friendUsername}")
    public String addFriend(@PathVariable String friendUsername, Authentication authentication) {
        String username = authentication.getName();
        friendService.addFriend(username, friendUsername);
        return "Prijatelj je uspešno dodat.";
    }
}