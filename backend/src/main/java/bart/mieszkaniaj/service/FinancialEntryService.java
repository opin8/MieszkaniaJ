package bart.mieszkaniaj.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import bart.mieszkaniaj.model.Agreement;
import bart.mieszkaniaj.model.FinancialEntry;
import bart.mieszkaniaj.repository.AgreementRepository;
import bart.mieszkaniaj.repository.ApartmentRepository;
import bart.mieszkaniaj.repository.FinancialEntryRepository;

@Service
public class FinancialEntryService {

    private final FinancialEntryRepository financialEntryRepository;
    private final AgreementRepository agreementRepository;

    public FinancialEntryService(FinancialEntryRepository financialEntryRepository, AgreementRepository agreementRepository) {
        this.financialEntryRepository = financialEntryRepository;
        this.agreementRepository = agreementRepository;
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

    public void generateFromAgreements() {
        LocalDate today = LocalDate.now();
        LocalDate firstOfMonth = today.withDayOfMonth(1);

        List<Agreement> activeAgreements = agreementRepository.findAll().stream()
                .filter(a -> a.getDateFrom() != null && !a.getDateFrom().isAfter(firstOfMonth))
                .filter(a -> a.getDateTo() == null || !a.getDateTo().isBefore(firstOfMonth))
                .toList();

        for (Agreement agreement : activeAgreements) {
            boolean exists = financialEntryRepository.findAll().stream()
                    .anyMatch(e -> e.getApartment() != null && e.getApartment().getId() == agreement.getApartment().getId()
                            && e.getCategory().equals(agreement.getCategory())
                            && e.getDate().equals(firstOfMonth));

            if (!exists) {
                FinancialEntry entry = new FinancialEntry();
                entry.setApartment(agreement.getApartment());
                entry.setCategory(agreement.getCategory());
                entry.setDate(firstOfMonth);
                entry.setNetAmount(agreement.getMonthlyNetValue());
                entry.setVatRate(agreement.getVatRate());
                entry.setDescription("Automatycznie z umowy #" + agreement.getId());
                entry.setPaid(false);
                financialEntryRepository.save(entry);
            }
        }
    }
}