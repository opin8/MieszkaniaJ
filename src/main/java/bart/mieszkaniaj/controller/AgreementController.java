package bart.mieszkaniaj.controller;

import bart.mieszkaniaj.model.Agreement;
import bart.mieszkaniaj.service.AgreementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agreements")
@CrossOrigin(origins = "*")
public class AgreementController {

    private final AgreementService agreementService;

    public AgreementController(AgreementService agreementService) {
        this.agreementService = agreementService;
    }

    @GetMapping
    public List<Agreement> getAllAgreements() {
        return agreementService.getAllAgreements();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agreement> getAgreementById(@PathVariable int id) {
        Agreement agreement = agreementService.getAgreementById(id);
        return ResponseEntity.ok(agreement);
    }

    @PostMapping
    public Agreement addAgreement(@RequestBody Agreement agreement) {
        return agreementService.saveAgreement(agreement);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Agreement> updateAgreement(@PathVariable int id, @RequestBody Agreement agreementDetails) {
        Agreement existing = agreementService.getAgreementById(id);

        existing.setContractor(agreementDetails.getContractor());
        existing.setApartment(agreementDetails.getApartment());
        existing.setCategory(agreementDetails.getCategory());
        existing.setDateFrom(agreementDetails.getDateFrom());
        existing.setDateTo(agreementDetails.getDateTo());
        existing.setNetValue(agreementDetails.getNetValue());
        existing.setVatRate(agreementDetails.getVatRate());
        existing.setDescription(agreementDetails.getDescription());
        existing.setTaxOperation(agreementDetails.isTaxOperation());
        existing.setPaid(agreementDetails.isPaid());

        Agreement updated = agreementService.saveAgreement(existing);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgreement(@PathVariable int id) {
        agreementService.deleteAgreement(id);
        return ResponseEntity.noContent().build();
    }
}