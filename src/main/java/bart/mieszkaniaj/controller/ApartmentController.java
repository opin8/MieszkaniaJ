package bart.mieszkaniaj.controller;

import bart.mieszkaniaj.model.Apartment;
import bart.mieszkaniaj.service.ApartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/apartments")
@CrossOrigin(origins = "*")
public class ApartmentController {

    private final ApartmentService apartmentService;

    public ApartmentController(ApartmentService apartmentService) {
        this.apartmentService = apartmentService;
    }

    @GetMapping
    public List<Apartment> getAllApartments() {
        return apartmentService.getAllApartments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Apartment> getApartmentById(@PathVariable int id) {
        Optional<Apartment> apartment = apartmentService.getApartmentById(id);
        return apartment.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Apartment addApartment(@RequestBody Apartment apartment) {
        return apartmentService.saveApartment(apartment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Apartment> updateApartment(@PathVariable int id, @RequestBody Apartment apartmentDetails) {
        Optional<Apartment> existing = apartmentService.getApartmentById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Apartment apartment = existing.get();

        apartment.setCity(apartmentDetails.getCity());
        apartment.setPostalCode(apartmentDetails.getPostalCode());
        apartment.setStreet(apartmentDetails.getStreet());
        apartment.setHouseNumber(apartmentDetails.getHouseNumber());
        apartment.setApartmentNumber(apartmentDetails.getApartmentNumber());
        apartment.setArea(apartmentDetails.getArea());
        apartment.setNumberOfRooms(apartmentDetails.getNumberOfRooms());
        apartment.setStorageUnit(apartmentDetails.getStorageUnit());
        apartment.setParkingSpotNumber(apartmentDetails.getParkingSpotNumber());

        apartment.setRentPayments(apartmentDetails.getRentPayments());
        apartment.setMeterReadings(apartmentDetails.getMeterReadings());
        apartment.setExpenses(apartmentDetails.getExpenses());

        Apartment updated = apartmentService.saveApartment(apartment);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApartment(@PathVariable int id) {
        apartmentService.deleteApartment(id);
        return ResponseEntity.noContent().build();
    }
}