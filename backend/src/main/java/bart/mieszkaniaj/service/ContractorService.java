package bart.mieszkaniaj.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import bart.mieszkaniaj.model.Contractor;
import bart.mieszkaniaj.repository.ContractorRepository;

@Service
public class ContractorService {

    private final ContractorRepository contractorRepository;

    public ContractorService(ContractorRepository contractorRepository) {
        this.contractorRepository = contractorRepository;
    }

    public List<Contractor> getAllContractors() {
        return contractorRepository.findAll();
    }

    public Optional<Contractor> getContractorById(int id) {
        return contractorRepository.findById(id);
    }

    public Contractor saveContractor(Contractor contractor) {
        return contractorRepository.save(contractor);
    }

    public void deleteContractor(int id) {
        contractorRepository.deleteById(id);
    }
}