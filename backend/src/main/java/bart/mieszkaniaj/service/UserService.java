package bart.mieszkaniaj.service;

import bart.mieszkaniaj.model.User;
import bart.mieszkaniaj.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;


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

    public void createAdminIfNotExists() {
        if (userRepository.count() == 0) {
            System.out.println("Baza pusta – tworzę domyślnych użytkowników...");
        } else {
            System.out.println("Baza nie jest pusta – pomijam tworzenie użytkowników.");
        }
    }
}
