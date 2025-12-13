package bart.mieszkaniaj.service;

import bart.mieszkaniaj.model.Apartment;
import bart.mieszkaniaj.repository.ApartmentRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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
        if (apartmentRepository.count() == 0) {
            System.out.println("Tworzę przykładowe mieszkania...");

            Apartment a1 = new Apartment();
            a1.setCity("Warszawa");
            a1.setPostalCode("00-123");
            a1.setStreet("Marszałkowska");
            a1.setHouseNumber(15);
            a1.setApartmentNumber(7);
            a1.setArea(85.5);
            a1.setNumberOfRooms(4);
            a1.setStorageUnit(true);
            a1.setParkingSpotNumber(42);
            apartmentRepository.save(a1);

            Apartment a2 = new Apartment();
            a2.setCity("Kraków");
            a2.setPostalCode("31-234");
            a2.setStreet("Floriańska");
            a2.setHouseNumber(8);
            a2.setApartmentNumber(3);
            a2.setArea(62.0);
            a2.setNumberOfRooms(3);
            a2.setStorageUnit(false);
            a2.setParkingSpotNumber(null);
            apartmentRepository.save(a2);

            Apartment a3 = new Apartment();
            a3.setCity("Gdańsk");
            a3.setPostalCode("80-345");
            a3.setStreet("Długa");
            a3.setHouseNumber(22);
            a3.setApartmentNumber(12);
            a3.setArea(120.0);
            a3.setNumberOfRooms(5);
            a3.setStorageUnit(true);
            a3.setParkingSpotNumber(101);
            apartmentRepository.save(a3);

            Apartment a4 = new Apartment();
            a4.setCity("Wrocław");
            a4.setPostalCode("50-456");
            a4.setStreet("Rynek");
            a4.setHouseNumber(1);
            a4.setApartmentNumber(5);
            a4.setArea(48.5);
            a4.setNumberOfRooms(2);
            a4.setStorageUnit(false);
            a4.setParkingSpotNumber(null);
            apartmentRepository.save(a4);

            Apartment a5 = new Apartment();
            a5.setCity("Poznań");
            a5.setPostalCode("61-567");
            a5.setStreet("Stary Rynek");
            a5.setHouseNumber(10);
            a5.setApartmentNumber(2);
            a5.setArea(73.0);
            a5.setNumberOfRooms(3);
            a5.setStorageUnit(true);
            a5.setParkingSpotNumber(15);
            apartmentRepository.save(a5);

            System.out.println("Gotowe! Dodano 5 przykładowych mieszkań.");
        }
    }
}