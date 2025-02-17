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

    public boolean checkPassword(String username, String rawPassword) {
        User user = findByUsername(username);
        return user != null && user.checkPassword(rawPassword, passwordEncoder); // Teraz przekazujemy encoder
    }
}
