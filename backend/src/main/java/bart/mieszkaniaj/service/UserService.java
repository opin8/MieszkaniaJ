package bart.mieszkaniaj.service;

import bart.mieszkaniaj.model.User;
import bart.mieszkaniaj.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    @Value("${admin.login}")
    private String adminLogin;

    @Value("${admin.password}")
    private String adminPassword;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(int id) {
        return userRepository.findById(id);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @PostConstruct
    @SuppressWarnings("unused")
    public void initAdmin() {
        createAdminIfNotExists();
    }

    public void createAdminIfNotExists() {
        // Najpierw sprawdź, czy admin już istnieje w twojej tabeli (lub w Supabase)
        if (userRepository.findByUsername(adminLogin) != null) {
            System.out.println("Admin już istnieje – pomijam tworzenie.");
            return;
        }

        String url = supabaseUrl + "/auth/v1/admin/users";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("email", adminLogin);
        requestBody.put("password", adminPassword);
        requestBody.put("email_confirm", true);           // od razu potwierdzony
        requestBody.put("user_metadata", Map.of("role", "admin"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", serviceRoleKey);
        headers.set("Authorization", "Bearer " + serviceRoleKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("✅ Admin utworzony w Supabase Auth: " + adminLogin);

                User admin = new User();
                admin.setUsername(adminLogin);
                userRepository.save(admin);
            } else {
                System.err.println("Błąd tworzenia admina: " + response.getBody());
            }
        } catch (Exception e) {
            System.err.println("Wyjątek przy tworzeniu admina w Supabase: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
