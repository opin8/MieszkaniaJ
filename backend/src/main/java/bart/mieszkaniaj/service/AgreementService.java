package bart.mieszkaniaj.service;

import bart.mieszkaniaj.model.Agreement;
import bart.mieszkaniaj.model.Apartment;
import bart.mieszkaniaj.model.Contractor;
import bart.mieszkaniaj.repository.AgreementRepository;
import bart.mieszkaniaj.repository.ApartmentRepository;
import bart.mieszkaniaj.repository.ContractorRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AgreementService {

    private final AgreementRepository agreementRepository;
    private final ApartmentRepository apartmentRepository;   // DODANE
    private final ContractorRepository contractorRepository; // DODANE

    public AgreementService(AgreementRepository agreementRepository,
                            ApartmentRepository apartmentRepository,
                            ContractorRepository contractorRepository) {
        this.agreementRepository = agreementRepository;
        this.apartmentRepository = apartmentRepository;
        this.contractorRepository = contractorRepository;
    }

    public List<Agreement> getAllAgreements() {
        return agreementRepository.findAll();
    }

    public Agreement getAgreementById(int id) {
        return agreementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Umowa nie znaleziona"));
    }

    public Agreement saveAgreement(Agreement agreement) {
        return agreementRepository.save(agreement);
    }

    public void deleteAgreement(int id) {
        agreementRepository.deleteById(id);
    }

    @PostConstruct
    public void initSampleAgreements() {

    }
}