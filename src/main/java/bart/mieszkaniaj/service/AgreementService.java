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

            // Umowa 1 – najem roczny
            Agreement a1 = new Agreement();
            a1.setContractor(contractors.get(0));
            a1.setApartment(apartments.get(0));
            a1.setCategory("Czynsz najmu");
            a1.setDateFrom(LocalDate.of(2024, 1, 1));
            a1.setDateTo(LocalDate.of(2026, 12, 31)); // DODANE
            a1.setMonthlyNetValue(2500.00);
            a1.setVatRate(23.00);
            a1.setDescription("Umowa najmu roczna");
            a1.setTaxOperation(true);
            agreementRepository.save(a1);

            // Umowa 2 – administracyjny (roczny)
            Agreement a2 = new Agreement();
            a2.setContractor(contractors.get(1));
            a2.setApartment(apartments.get(1));
            a2.setCategory("Czynsz administracyjny");
            a2.setDateFrom(LocalDate.of(2024, 1, 1));
            a2.setDateTo(LocalDate.of(2026, 12, 31)); // DODANE
            a2.setMonthlyNetValue(800.00);
            a2.setVatRate(8.00);
            a2.setDescription("Opłaty administracyjne cykliczne");
            a2.setTaxOperation(false);
            agreementRepository.save(a2);

            // Umowa 3 – remont (jednorazowy)
            Agreement a3 = new Agreement();
            a3.setContractor(contractors.get(0));
            a3.setApartment(apartments.get(2));
            a3.setCategory("Remont/naprawa");
            a3.setDateFrom(LocalDate.of(2024, 6, 15));
            a3.setDateTo(LocalDate.of(2026, 6, 15)); // DODANE – jednorazowy
            a3.setMonthlyNetValue(1500.00);
            a3.setVatRate(23.00);
            a3.setDescription("Remont balkonu");
            a3.setTaxOperation(true);
            agreementRepository.save(a3);

            // Umowa 4 – prąd (miesięczny)
            Agreement a4 = new Agreement();
            a4.setContractor(contractors.get(2));
            a4.setApartment(apartments.get(3));
            a4.setCategory("Prąd");
            a4.setDateFrom(LocalDate.of(2024, 11, 1));
            a4.setDateTo(LocalDate.of(2026, 11, 30)); // DODANE
            a4.setMonthlyNetValue(320.50);
            a4.setVatRate(23.00);
            a4.setDescription("Rozliczenie energii");
            a4.setTaxOperation(false);
            agreementRepository.save(a4);

            // Umowa 5 – kaucja (jednorazowa)
            Agreement a5 = new Agreement();
            a5.setContractor(contractors.get(3));
            a5.setApartment(apartments.get(4));
            a5.setCategory("Kaucja");
            a5.setDateFrom(LocalDate.of(2024, 1, 1));
            a5.setDateTo(LocalDate.of(2026, 1, 1)); // DODANE – jednorazowa
            a5.setMonthlyNetValue(5000.00);
            a5.setVatRate(0.00);
            a5.setDescription("Kaucja zwrotna");
            a5.setTaxOperation(false);
            agreementRepository.save(a5);

            Agreement a6 = new Agreement();
            a6.setContractor(contractors.get(3));
            a6.setApartment(apartments.get(4));
            a6.setCategory("Kaucja");
            a6.setDateFrom(LocalDate.of(2024, 1, 1));
            a6.setDateTo(LocalDate.of(2025, 1, 1)); // DODANE – jednorazowa
            a6.setMonthlyNetValue(5000.00);
            a6.setVatRate(0.00);
            a6.setDescription("Kaucja zwrotna");
            a6.setTaxOperation(false);
            agreementRepository.save(a6);

            System.out.println("Dodano 5 przykładowych umów!");
        }
    }
}