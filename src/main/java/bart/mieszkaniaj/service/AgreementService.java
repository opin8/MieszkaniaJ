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
        if (agreementRepository.count() == 0) {
            System.out.println("Tworzę przykładowe umowy...");

            List<Apartment> apartments = apartmentRepository.findAll();
            List<Contractor> contractors = contractorRepository.findAll();

            if (apartments.isEmpty() || contractors.isEmpty()) {
                System.out.println("Brak mieszkań lub kontrahentów – pomijam tworzenie umów");
                return;
            }

            Agreement a1 = new Agreement();
            a1.setContractor(contractors.get(0));
            a1.setApartment(apartments.get(0));
            a1.setCategory("Czynsz najmu");
            a1.setDateFrom(LocalDate.of(2025, 1, 1));
            a1.setDateTo(LocalDate.of(2025, 12, 31));
            a1.setNetValue(2500.00);
            a1.setVatRate(23.00);
            a1.setDescription("Umowa najmu roczna");
            a1.setTaxOperation(true);
            a1.setPaid(true);
            agreementRepository.save(a1);

            Agreement a2 = new Agreement();
            a2.setContractor(contractors.get(1));
            a2.setApartment(apartments.get(1));
            a2.setCategory("Czynsz administracyjny");
            a2.setDateFrom(LocalDate.of(2025, 1, 1));
            a2.setNetValue(800.00);
            a2.setVatRate(8.00);
            a2.setDescription("Opłaty administracyjne");
            a2.setTaxOperation(false);
            a2.setPaid(true);
            agreementRepository.save(a2);

            Agreement a3 = new Agreement();
            a3.setContractor(contractors.get(0));
            a3.setApartment(apartments.get(2));
            a3.setCategory("Remont/naprawa");
            a3.setDateFrom(LocalDate.of(2025, 6, 15));
            a3.setNetValue(-1500.00);
            a3.setVatRate(23.00);
            a3.setDescription("Remont balkonu");
            a3.setTaxOperation(true);
            a3.setPaid(false);
            agreementRepository.save(a3);

            Agreement a4 = new Agreement();
            a4.setContractor(contractors.get(2));
            a4.setApartment(apartments.get(3));
            a4.setCategory("Prąd");
            a4.setDateFrom(LocalDate.of(2025, 11, 1));
            a4.setDateTo(LocalDate.of(2025, 11, 30));
            a4.setNetValue(320.50);
            a4.setVatRate(23.00);
            a4.setDescription("Rozliczenie energii");
            a4.setTaxOperation(false);
            a4.setPaid(true);
            agreementRepository.save(a4);

            Agreement a5 = new Agreement();
            a5.setContractor(contractors.get(3));
            a5.setApartment(apartments.get(4));
            a5.setCategory("Kaucja");
            a5.setDateFrom(LocalDate.of(2025, 1, 1));
            a5.setNetValue(5000.00);
            a5.setVatRate(0.00);
            a5.setDescription("Kaucja zwrotna");
            a5.setTaxOperation(false);
            a5.setPaid(true);
            agreementRepository.save(a5);

            System.out.println("Dodano 5 przykładowych umów!");
        }
    }
}