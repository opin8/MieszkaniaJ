package bart.mieszkaniaj.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import bart.mieszkaniaj.model.User;
import bart.mieszkaniaj.repository.UserRepository;
import jakarta.annotation.PostConstruct;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${supabase.url:${SUPABASE_URL:${SUPABASE_DB_URL:}}}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key:${SUPABASE_SERVICE_ROLE_KEY:}}")
    private String serviceRoleKey;

    @Value("${admin.login:${ADMIN_LOGIN:}}")
    private String adminLogin;

    @Value("${admin.password:${ADMIN_PASSWORD:}}")
    private String adminPassword;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // === Twoje istniejące metody ===
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
        if (supabaseUrl.isBlank() || serviceRoleKey.isBlank() ||
                adminLogin.isBlank() || adminPassword.isBlank()) {

            System.err.println("❌ Pomijam tworzenie admina – brakuje zmiennych.");
            return;
        }

        if (userRepository.findByUsername(adminLogin) != null) {
            System.out.println("✅ Admin o loginie '" + adminLogin + "' już istnieje – pomijam.");
            return;
        }

        String baseUrl = supabaseUrl.trim();
        if (baseUrl.endsWith("/")) baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        baseUrl = baseUrl.replace("/rest/v1", "").replace("/postgres", "");

        String url = baseUrl + "/auth/v1/admin/users";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("email", adminLogin);
        requestBody.put("password", adminPassword);
        requestBody.put("email_confirm", true);
        requestBody.put("app_metadata", Map.of("role", "ADMIN"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", serviceRoleKey);
        headers.set("Authorization", "Bearer " + serviceRoleKey);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.POST, new HttpEntity<>(requestBody, headers), String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("✅ Admin utworzony pomyślnie w Supabase Auth");
                System.out.println("   Login: " + adminLogin);

                // Poprawny zapis do lokalnej tabeli
                User admin = new User();
                admin.setUsername(adminLogin);
                admin.setPassword("");           // ważne – pusty string
                // admin.setPassword(null);      // alternatywa – jeśli zmienisz encję na nullable = true

                userRepository.save(admin);
                System.out.println("✅ Admin zapisany w lokalnej tabeli users");

            } else {
                System.err.println("❌ Błąd tworzenia admina: " + response.getStatusCode());
                System.err.println("   Body: " + response.getBody());
            }
        } catch (Exception e) {
            System.err.println("❌ Wyjątek podczas tworzenia admina: " + e.getMessage());
        }
    }
}