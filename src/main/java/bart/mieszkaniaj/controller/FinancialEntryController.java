package bart.mieszkaniaj.controller;

import bart.mieszkaniaj.model.FinancialEntry;
import bart.mieszkaniaj.service.FinancialEntryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/financial-entries")
@CrossOrigin(origins = "*")
public class FinancialEntryController {

    private final FinancialEntryService financialEntryService;

    public FinancialEntryController(FinancialEntryService financialEntryService) {
        this.financialEntryService = financialEntryService;
    }

    @GetMapping
    public List<FinancialEntry> getAllFinancialEntries() {
        return financialEntryService.getAllFinancialEntries();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FinancialEntry> getFinancialEntryById(@PathVariable int id) {
        return financialEntryService.getFinancialEntryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public FinancialEntry addFinancialEntry(@RequestBody FinancialEntry entry) {
        return financialEntryService.saveFinancialEntry(entry);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FinancialEntry> updateFinancialEntry(@PathVariable int id, @RequestBody FinancialEntry entryDetails) {
        return financialEntryService.getFinancialEntryById(id)
                .map(existing -> {
                    existing.setApartment(entryDetails.getApartment());
                    existing.setCategory(entryDetails.getCategory());
                    existing.setDate(entryDetails.getDate());
                    existing.setNetAmount(entryDetails.getNetAmount());
                    existing.setVatRate(entryDetails.getVatRate());
                    existing.setDescription(entryDetails.getDescription());
                    existing.setTaxOperation(entryDetails.isTaxOperation());
                    existing.setPaid(entryDetails.isPaid());

                    FinancialEntry updated = financialEntryService.saveFinancialEntry(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFinancialEntry(@PathVariable int id) {
        financialEntryService.deleteFinancialEntry(id);
        return ResponseEntity.noContent().build();
    }
}