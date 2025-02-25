// bart.mieszkaniaj.MieszkaniaJApplication.java
package bart.mieszkaniaj;

import bart.mieszkaniaj.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MieszkaniaJApplication implements CommandLineRunner {

    @Autowired
    private UserService userService;

    public static void main(String[] args) {
        SpringApplication.run(MieszkaniaJApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        userService.initializeUsers(); // Inicjalizuj statycznych użytkowników
    }
}