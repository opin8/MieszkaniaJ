package bart.mieszkaniaj.service;

import bart.mieszkaniaj.model.Contractor;
import bart.mieszkaniaj.repository.ContractorRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ContractorService {

    private final ContractorRepository contractorRepository;

    public ContractorService(ContractorRepository contractorRepository) {
        this.contractorRepository = contractorRepository;
    }

    // Pobranie wszystkich kontrahentów
    public List<Contractor> getAllContractors() {
        return contractorRepository.findAll();
    }

    // Pobranie kontrahenta po ID
    public Optional<Contractor> getContractorById(int id) {
        return contractorRepository.findById(id);
    }

    // Zapis (dodanie lub aktualizacja)
    public Contractor saveContractor(Contractor contractor) {
        return contractorRepository.save(contractor);
    }

    // Usunięcie kontrahenta
    public void deleteContractor(int id) {
        contractorRepository.deleteById(id);
    }

    @PostConstruct
    public void initSampleContractors() {
        if (contractorRepository.count() == 0) {
            System.out.println("Tworzę przykładowych kontrahentów...");

            Contractor c1 = new Contractor();
            c1.setName("Robert Bandrowski");
            c1.setPeselOrNip("90010109109");
            c1.setEmail("mail@gmail.com");
            c1.setPhone("48500000000");
            c1.setAddress("Marszałkowska 1, Warszawa");
            c1.setAdditionalInfo("Dodatkowe informacje");
            c1.setContractorType("Najemca");
            contractorRepository.save(c1);

            Contractor c2 = new Contractor();
            c2.setName("Tomasz Wieczorek");
            c2.setPeselOrNip("90010109109");
            c2.setEmail("mail@gmail.com");
            c2.setPhone("48500000000");
            c2.setAddress("Marszałkowska 1, Warszawa");
            c2.setAdditionalInfo("");
            c2.setContractorType("Najemca");
            contractorRepository.save(c2);

            Contractor c3 = new Contractor();
            c3.setName("Maria Kowalska");
            c3.setPeselOrNip("85050512345");
            c3.setEmail("maria@example.com");
            c3.setPhone("48600123456");
            c3.setAddress("Floriańska 8, Kraków");
            c3.setAdditionalInfo("Najemca długoterminowy");
            c3.setContractorType("Najemca");
            contractorRepository.save(c3);

            Contractor c4 = new Contractor();
            c4.setName("Spółdzielnia Mieszkaniowa Gdańsk");
            c4.setPeselOrNip("1234567890");
            c4.setEmail("spoldzielnia@gdansk.pl");
            c4.setPhone("48587654321");
            c4.setAddress("Długa 22, Gdańsk");
            c4.setAdditionalInfo("Zarządca budynku");
            c4.setContractorType("Spółdzielnia");
            contractorRepository.save(c4);

            Contractor c5 = new Contractor();
            c5.setName("Jan Nowak");
            c5.setPeselOrNip("78020345678");
            c5.setEmail("jan.nowak@wp.pl");
            c5.setPhone("48789123456");
            c5.setAddress("Rynek 1, Wrocław");
            c5.setAdditionalInfo("Właściciel");
            c5.setContractorType("Właściciel");
            contractorRepository.save(c5);

            // Dodaj jeszcze 3-5 kontrahentów dla testów

            System.out.println("Dodano przykładowych kontrahentów!");
        }
    }
}