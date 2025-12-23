package bart.mieszkaniaj.controller;

import bart.mieszkaniaj.model.Contractor;
import bart.mieszkaniaj.service.ContractorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contractors")
@CrossOrigin(origins = "*")
public class ContractorController {

    private final ContractorService contractorService;

    public ContractorController(ContractorService contractorService) {
        this.contractorService = contractorService;
    }

    // Pobranie wszystkich kontrahentów
    @GetMapping
    public List<Contractor> getAllContractors() {
        return contractorService.getAllContractors();
    }

    // Pobranie kontrahenta po ID
    @GetMapping("/{id}")
    public ResponseEntity<Contractor> getContractorById(@PathVariable int id) {
        return contractorService.getContractorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Dodanie nowego kontrahenta
    @PostMapping
    public Contractor addContractor(@RequestBody Contractor contractor) {
        return contractorService.saveContractor(contractor);
    }

    // Aktualizacja kontrahenta
    @PutMapping("/{id}")
    public ResponseEntity<Contractor> updateContractor(@PathVariable int id, @RequestBody Contractor contractorDetails) {
        return contractorService.getContractorById(id)
                .map(existing -> {
                    existing.setName(contractorDetails.getName());
                    existing.setPeselOrNip(contractorDetails.getPeselOrNip());
                    existing.setEmail(contractorDetails.getEmail());
                    existing.setPhone(contractorDetails.getPhone());
                    existing.setAddress(contractorDetails.getAddress());
                    existing.setAdditionalInfo(contractorDetails.getAdditionalInfo());
                    existing.setContractorType(contractorDetails.getContractorType());

                    Contractor updated = contractorService.saveContractor(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Usunięcie kontrahenta
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContractor(@PathVariable int id) {
        contractorService.deleteContractor(id);
        return ResponseEntity.noContent().build();
    }
}