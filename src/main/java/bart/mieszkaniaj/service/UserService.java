// bart.mieszkaniaj.service.UserService.java
package bart.mieszkaniaj.service;

import bart.mieszkaniaj.model.User;
import bart.mieszkaniaj.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(int id) {
        return userRepository.findById(id);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Metoda do inicjalizacji statycznych użytkowników (przy starcie aplikacji)
    public void initializeUsers() {
        if (userRepository.count() == 0) { // Tylko jeśli baza jest pusta
            String[] usernames = {"user1", "user2", "user3", "user4", "user5"};
            String password = "haslo123"; // To samo hasło dla wszystkich, hashowane
            for (String username : usernames) {
                User user = new User();
                user.setUsername(username);
                user.setPassword(passwordEncoder.encode(password)); // Hashuj hasło
                userRepository.save(user);
            }
        }
    }
}