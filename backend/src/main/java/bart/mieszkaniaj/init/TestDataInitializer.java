package bart.mieszkaniaj.init;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import bart.mieszkaniaj.repository.AgreementRepository;
import bart.mieszkaniaj.repository.ApartmentRepository;
import bart.mieszkaniaj.repository.ContractorRepository;
import jakarta.annotation.PostConstruct;

@Component
@Profile("local") // działa tylko lokalnie
public class TestDataInitializer {

    @Autowired
    private ApartmentRepository apartmentRepository;

    @Autowired
    private ContractorRepository contractorRepository;

    @Autowired
    private AgreementRepository agreementRepository;

    @PostConstruct
    public void init() {
    }
}