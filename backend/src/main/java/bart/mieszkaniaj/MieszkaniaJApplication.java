package bart.mieszkaniaj;

import bart.mieszkaniaj.service.ApartmentService;
import bart.mieszkaniaj.service.ContractorService;
import bart.mieszkaniaj.service.AgreementService;
import bart.mieszkaniaj.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MieszkaniaJApplication implements CommandLineRunner {

    @Autowired
    private UserService userService;

    @Autowired
    private ApartmentService apartmentService;

    @Autowired
    private ContractorService contractorService;

    @Autowired
    private AgreementService agreementService;

    public static void main(String[] args) {
        SpringApplication.run(MieszkaniaJApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        userService.createAdminIfNotExists();  // lub createDefaultUsers()
        apartmentService.initSampleApartments();
        contractorService.initSampleContractors();
        agreementService.initSampleAgreements();
    }
}