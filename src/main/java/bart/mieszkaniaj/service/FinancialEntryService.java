package bart.mieszkaniaj.service;

import bart.mieszkaniaj.model.Apartment;
import bart.mieszkaniaj.model.FinancialEntry;
import bart.mieszkaniaj.repository.ApartmentRepository;
import bart.mieszkaniaj.repository.FinancialEntryRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class FinancialEntryService {

    private final FinancialEntryRepository financialEntryRepository;
    private final ApartmentRepository apartmentRepository;

    public FinancialEntryService(FinancialEntryRepository financialEntryRepository, ApartmentRepository apartmentRepository) {
        this.financialEntryRepository = financialEntryRepository;
        this.apartmentRepository = apartmentRepository;
    }

    public List<FinancialEntry> getAllFinancialEntries() {
        return financialEntryRepository.findAll();
    }

    public Optional<FinancialEntry> getFinancialEntryById(int id) {
        return financialEntryRepository.findById(id);
    }

    public FinancialEntry saveFinancialEntry(FinancialEntry entry) {
        return financialEntryRepository.save(entry);
    }

    public void deleteFinancialEntry(int id) {
        financialEntryRepository.deleteById(id);
    }

    @PostConstruct
    public void initSampleFinancialEntries() {
        if (financialEntryRepository.count() == 0) {
            System.out.println("Tworzę przykładowe wydatki...");

            List<Apartment> apartments = apartmentRepository.findAll();

            if (apartments.isEmpty()) {
                System.out.println("Brak mieszkań – pomijam tworzenie wydatków");
                return;
            }

            FinancialEntry f1 = new FinancialEntry();
            f1.setApartment(apartments.get(0));
            f1.setCategory("Czynsz administracyjny");
            f1.setDate(LocalDate.of(2025, 1, 1));
            f1.setNetAmount(-800.00);
            f1.setVatRate(8.00);
            f1.setDescription("Opłata za styczeń");
            f1.setTaxOperation(true);
            f1.setPaid(true);
            financialEntryRepository.save(f1);

            FinancialEntry f2 = new FinancialEntry();
            f2.setApartment(apartments.get(1));
            f2.setCategory("Prąd");
            f2.setDate(LocalDate.of(2025, 2, 15));
            f2.setNetAmount(-450.00);
            f2.setVatRate(23.00);
            f2.setDescription("Rozliczenie energii");
            f2.setTaxOperation(false);
            f2.setPaid(true);
            financialEntryRepository.save(f2);

            FinancialEntry f3 = new FinancialEntry();
            f3.setApartment(apartments.get(2));
            f3.setCategory("Remont/naprawa");
            f3.setDate(LocalDate.of(2025, 6, 20));
            f3.setNetAmount(-2000.00);
            f3.setVatRate(23.00);
            f3.setDescription("Malowanie klatki");
            f3.setTaxOperation(true);
            f3.setPaid(false);
            financialEntryRepository.save(f3);

            FinancialEntry f4 = new FinancialEntry();
            f4.setApartment(apartments.get(3));
            f4.setCategory("Podatek");
            f4.setDate(LocalDate.of(2025, 3, 1));
            f4.setNetAmount(-1200.00);
            f4.setVatRate(0.00);
            f4.setDescription("Podatek od nieruchomości");
            f4.setTaxOperation(false);
            f4.setPaid(true);
            financialEntryRepository.save(f4);

            FinancialEntry f5 = new FinancialEntry();
            f5.setApartment(apartments.get(4));
            f5.setCategory("Ubezpieczenie");
            f5.setDate(LocalDate.of(2025, 1, 1));
            f5.setNetAmount(-600.00);
            f5.setVatRate(0.00);
            f5.setDescription("Ubezpieczenie mieszkania");
            f5.setTaxOperation(false);
            f5.setPaid(true);
            financialEntryRepository.save(f5);

            System.out.println("Dodano 5 przykładowych wydatków!");
        }
    }
}