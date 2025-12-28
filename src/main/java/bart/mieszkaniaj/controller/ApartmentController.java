package bart.mieszkaniaj.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import bart.mieszkaniaj.model.Apartment;
import bart.mieszkaniaj.service.ApartmentService;

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
        return apartmentService.getApartmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Apartment addApartment(@RequestBody Apartment apartment) {
        return apartmentService.saveApartment(apartment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Apartment> updateApartment(@PathVariable int id, @RequestBody Apartment apartmentDetails) {
        return apartmentService.getApartmentById(id)
                .map(existing -> {
                    // Podstawowe pola
                    existing.setCity(apartmentDetails.getCity());
                    existing.setPostalCode(apartmentDetails.getPostalCode());
                    existing.setStreet(apartmentDetails.getStreet());
                    existing.setHouseNumber(apartmentDetails.getHouseNumber());
                    existing.setApartmentNumber(apartmentDetails.getApartmentNumber());
                    existing.setArea(apartmentDetails.getArea());
                    existing.setNumberOfRooms(apartmentDetails.getNumberOfRooms());
                    existing.setStorageUnit(apartmentDetails.isStorageUnit());
                    existing.setParkingSpotNumber(apartmentDetails.getParkingSpotNumber());
                    existing.setBalconyTerraceArea(apartmentDetails.getBalconyTerraceArea());
                    existing.setGarageNumber(apartmentDetails.getGarageNumber());

                    Apartment updated = apartmentService.saveApartment(existing);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApartment(@PathVariable int id) {
        apartmentService.deleteApartment(id);
        return ResponseEntity.noContent().build();
    }
}