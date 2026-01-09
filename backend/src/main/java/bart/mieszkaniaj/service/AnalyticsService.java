package bart.mieszkaniaj.service;

import bart.mieszkaniaj.model.FinancialEntry;
import bart.mieszkaniaj.repository.FinancialEntryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

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
            List<Integer> apartmentIds,  // <-- tu już było Integer – OK
            List<String> categories,
            LocalDate dateFrom,
            LocalDate dateTo,
            Boolean onlyPaid
    ) {
        List<FinancialEntry> entries = financialEntryRepository.findAll();

        System.out.println("Before filters: " + entries.size() + " entries");

        // Filtr po mieszkaniach
        if (apartmentIds != null && !apartmentIds.isEmpty()) {
            entries = entries.stream()
                    .filter(e -> e.getApartment() != null && apartmentIds.contains(e.getApartment().getId()))
                    .collect(Collectors.toList());
        }

        // Filtr po kategoriach
        if (categories != null && !categories.isEmpty()) {
            System.out.println("Filtering by categories: " + categories);
            entries = entries.stream()
                    .filter(e -> categories.contains(e.getCategory()))
                    .collect(Collectors.toList());
        }

        // Filtr po dacie
        if (dateFrom != null) {
            entries = entries.stream()
                    .filter(e -> e.getDate() != null && !e.getDate().isBefore(dateFrom))
                    .collect(Collectors.toList());
        }

        if (dateTo != null) {
            entries = entries.stream()
                    .filter(e -> e.getDate() != null && !e.getDate().isAfter(dateTo))
                    .collect(Collectors.toList());
        }

        // Filtr opłacone
        if (onlyPaid != null && onlyPaid) {
            entries = entries.stream()
                    .filter(FinancialEntry::isPaid)
                    .collect(Collectors.toList());
        }

        System.out.println("After filters: " + entries.size() + " entries");

        // Obliczenia netto
        double totalExpensesNet = entries.stream()
                .filter(e -> e.getNetAmount() < 0)
                .mapToDouble(e -> e.getNetAmount() / (1 + e.getVatRate() / 100))
                .sum();

        double totalIncomeNet = entries.stream()
                .filter(e -> e.getNetAmount() > 0)
                .mapToDouble(e -> e.getNetAmount() / (1 + e.getVatRate() / 100))
                .sum();

        double netProfitNet = totalIncomeNet + totalExpensesNet;

        return new AnalyticsSummary(totalExpensesNet, totalIncomeNet, netProfitNet, entries);
    }
}