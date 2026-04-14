package tn.esprit.user.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.esprit.user.dto.RegisterRequest;
import tn.esprit.user.entity.User;
import tn.esprit.user.service.UserService;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
        log.info("Registering user: {}", request.getUsername());
        User user = userService.registerUser(request);
        return ResponseEntity.ok(user);
    }
}
