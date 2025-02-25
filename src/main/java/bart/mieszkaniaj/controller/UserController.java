// bart.mieszkaniaj.controller.UserController.java
package bart.mieszkaniaj.controller;

import bart.mieszkaniaj.DTO.LoginRequest;
import bart.mieszkaniaj.DTO.LoginResponse;
import bart.mieszkaniaj.config.JwtUtil;
import bart.mieszkaniaj.model.User;
import bart.mieszkaniaj.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder; // Dodaj, jeśli jeszcze nie ma

    private static final Logger logger = LoggerFactory.getLogger(UserController.class); // Poprawione na .class

    @GetMapping
    public List<User> getAllUsers() {
        logger.info("Fetching all users");
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable int id) {
        logger.info("Fetching user by ID: {}", id);
        return userService.getUserById(id);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        logger.info("Attempting login for user: {}", loginRequest.getUsername());
        User user = userService.findByUsername(loginRequest.getUsername());

        if (user != null && user.checkPassword(loginRequest.getPassword(), passwordEncoder)) {
            String token = jwtUtil.generateToken(user.getUsername());
            logger.info("User {} logged in successfully. Token generated.", loginRequest.getUsername());
            return ResponseEntity.ok(new LoginResponse(true, "Login successful", token));
        } else {
            logger.warn("Failed login attempt for user: {}", loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new LoginResponse(false, "Invalid credentials", null));
        }
    }
}