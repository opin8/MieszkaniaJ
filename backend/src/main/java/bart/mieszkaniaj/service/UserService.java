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

            System.err.println("❌ Brak wymaganych zmiennych środowiskowych.");
            return;
        }

        String login = adminLogin;

        // Jeśli użytkownik już istnieje w naszej tabeli — pomijamy
        if (userRepository.findByUsername(login) != null) {
            System.out.println("✅ Admin już istnieje w tabeli public.users.");
            return;
        }

        try {
            // Tworzymy rekord w naszej tabeli z zahashowanym hasłem
            User admin = new User();
            admin.setUsername(login);
            admin.setPassword(passwordEncoder.encode(adminPassword));   // <--- tutaj hashujemy

            userRepository.save(admin);

            System.out.println("✅ Admin pomyślnie zapisany w public.users z zahashowanym hasłem");
            System.out.println("   Login: " + login);

        } catch (Exception e) {
            System.err.println("❌ Błąd przy zapisie admina do tabeli users: " + e.getMessage());
            e.printStackTrace();
        }
    }
}