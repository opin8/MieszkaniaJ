package bart.mieszkaniaj.controller;

import bart.mieszkaniaj.model.Apartment;
import bart.mieszkaniaj.service.ApartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/apartments")
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
    public Optional<Apartment> getApartmentById(@PathVariable int id) {
        return apartmentService.getApartmentById(id);
    }

    @PostMapping
    public Apartment addApartment(@RequestBody Apartment apartment) {
        return apartmentService.saveApartment(apartment);
    }

    @DeleteMapping("/{id}")
    public void deleteApartment(@PathVariable int id) {
        apartmentService.deleteApartment(id);
    }
}