package bart.mieszkaniaj.service;

import bart.mieszkaniaj.model.FinancialEntry;
import bart.mieszkaniaj.repository.FinancialEntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AnalyticsService {

    private final FinancialEntryRepository financialEntryRepository;

    public AnalyticsService(FinancialEntryRepository financialEntryRepository) {
        this.financialEntryRepository = financialEntryRepository;
    }

    public record AnalyticsSummary(
            double totalExpensesNet,
            double totalIncomeNet,
            double netProfitNet,
            List<FinancialEntry> allEntries
    ) {}

    public AnalyticsSummary getAnalytics(
            List<Integer> apartmentIds,
            List<String> categories,
            LocalDate dateFrom,
            LocalDate dateTo,
            Boolean onlyPaid
    ) {
        List<FinancialEntry> allEntries = financialEntryRepository.findAll();

        // Filtry z bezpiecznymi null checkami
        if (apartmentIds != null && !apartmentIds.isEmpty()) {
            allEntries = allEntries.stream()
                    .filter(e -> e.getApartment() != null && apartmentIds.contains(e.getApartment().getId()))
                    .toList();
        }

        if (categories != null && !categories.isEmpty()) {
            allEntries = allEntries.stream()
                    .filter(e -> categories.contains(e.getCategory()))
                    .toList();
        }

        if (dateFrom != null) {
            allEntries = allEntries.stream()
                    .filter(e -> e.getDate() != null && !e.getDate().isBefore(dateFrom))
                    .toList();
        }

        if (dateTo != null) {
            allEntries = allEntries.stream()
                    .filter(e -> e.getDate() != null && !e.getDate().isAfter(dateTo))
                    .toList();
        }

        if (onlyPaid != null) {
            allEntries = allEntries.stream()
                    .filter(e -> e.isPaid() == onlyPaid)
                    .toList();
        }

        // Obliczenia netto
        double totalExpensesNet = allEntries.stream()
                .filter(e -> e.getNetAmount() < 0)
                .mapToDouble(e -> e.getNetAmount() / (1 + e.getVatRate() / 100))
                .sum();

        double totalIncomeNet = allEntries.stream()
                .filter(e -> e.getNetAmount() > 0)
                .mapToDouble(e -> e.getNetAmount() / (1 + e.getVatRate() / 100))
                .sum();

        double netProfitNet = totalIncomeNet + totalExpensesNet;

        return new AnalyticsSummary(totalExpensesNet, totalIncomeNet, netProfitNet, allEntries);
    }
}