package bart.mieszkaniaj.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import bart.mieszkaniaj.model.Contractor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import bart.mieszkaniaj.model.Apartment;
import bart.mieszkaniaj.repository.ApartmentRepository;
import jakarta.annotation.PostConstruct;

@Service
public class ApartmentService {

    private ApartmentRepository apartmentRepository;

    @Autowired
    public ApartmentService(ApartmentRepository apartmentRepository) {
        this.apartmentRepository = apartmentRepository;
    }

    public List<Apartment> getAllApartments() {
        return apartmentRepository.findAll();
    }

    public Optional<Apartment> getApartmentById(int id) {
        return apartmentRepository.findById(id);
    }

    public Apartment saveApartment(Apartment apartment) {
        return apartmentRepository.save(apartment);
    }

    public void deleteApartment(int id) {
        apartmentRepository.deleteById(id);
    }

    @PostConstruct
    public void initSampleApartments() {

    }
}