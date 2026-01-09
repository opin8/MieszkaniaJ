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

    }
}