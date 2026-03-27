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

    // === Zmienne z Render.com ===
    @Value("${supabase.url:${SUPABASE_URL:}}")       
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

    // Twoje istniejące metody bez zmian
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
        // 1. Sprawdzenie czy wszystkie zmienne są ustawione
        if (supabaseUrl.isBlank() || serviceRoleKey.isBlank() ||
                adminLogin.isBlank() || adminPassword.isBlank()) {

            System.err.println("❌ Pomijam tworzenie admina – brakuje jednej lub więcej zmiennych środowiskowych:");
            System.err.println("   SUPABASE_URL / SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_LOGIN, ADMIN_PASSWORD");
            return;
        }

        // 2. Sprawdzenie czy admin już istnieje w Twojej lokalnej tabeli
        if (userRepository.findByUsername(adminLogin) != null) {
            System.out.println("✅ Admin już istnieje w lokalnej tabeli – pomijam tworzenie.");
            return;
        }

        // Czyszczenie URL (na wypadek gdyby SUPABASE_URL zawierało parametry JDBC)
        String baseUrl = supabaseUrl;
        if (baseUrl.contains("?")) {
            baseUrl = baseUrl.substring(0, baseUrl.indexOf("?"));
        }
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }
        // Usuwamy ewentualny /rest/v1 lub /postgres
        baseUrl = baseUrl.replace("/rest/v1", "").replace("/postgres", "");

        String url = baseUrl + "/auth/v1/admin/users";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("email", adminLogin);
        requestBody.put("password", adminPassword);
        requestBody.put("email_confirm", true);
        requestBody.put("user_metadata", Map.of("role", "admin"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("apikey", serviceRoleKey);
        headers.set("Authorization", "Bearer " + serviceRoleKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("✅ Admin został pomyślnie utworzony w Supabase Auth: " + adminLogin);

                // Opcjonalnie zapisujemy w Twojej tabeli User
                User admin = new User();
                admin.setUsername(adminLogin);
                // Nie zapisujemy hasła w plain text – jeśli potrzebujesz, zahashuj
                userRepository.save(admin);

            } else {
                System.err.println("❌ Błąd HTTP przy tworzeniu admina: " + response.getStatusCode());
                System.err.println("   Body: " + response.getBody());
            }
        } catch (Exception e) {
            System.err.println("❌ Wyjątek podczas tworzenia admina w Supabase:");
            System.err.println("   URL: " + url);
            System.err.println("   Message: " + e.getMessage());
            e.printStackTrace();
        }
    }
}