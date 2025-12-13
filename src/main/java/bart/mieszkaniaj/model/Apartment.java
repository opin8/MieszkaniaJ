package bart.mieszkaniaj.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "apartments")
public class Apartment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String postalCode;

    @Column(nullable = false)
    private String street;

    @Column(nullable = false)
    private Integer houseNumber;

    @Column(nullable = false)
    private Integer apartmentNumber;

    @Column(nullable = false)
    private Double area;

    @Column(nullable = false)
    private Integer numberOfRooms;

    @Column(nullable = false)
    private Boolean storageUnit;

    private Integer parkingSpotNumber;

    // ================= NOWE FUNKCJE =================

    // 1. Lista opłat czynszowych z datami ważności
    @ElementCollection
    @CollectionTable(name = "rent_payments", joinColumns = @JoinColumn(name = "apartment_id"))
    private List<RentPayment> rentPayments = new ArrayList<>();

    // 2. Historia stanu licznika (prąd/woda/gaz)
    @ElementCollection
    @CollectionTable(name = "meter_readings", joinColumns = @JoinColumn(name = "apartment_id"))
    private List<MeterReading> meterReadings = new ArrayList<>();

    // 3. Dowolne wydatki związane z mieszkaniem
    @ElementCollection
    @CollectionTable(name = "expenses", joinColumns = @JoinColumn(name = "apartment_id"))
    private List<Expense> expenses = new ArrayList<>();

    // ================= KONSTRUKTORY =================
    public Apartment() {}

    // ================= GETTERY I SETTERY =================
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public Integer getHouseNumber() { return houseNumber; }
    public void setHouseNumber(Integer houseNumber) { this.houseNumber = houseNumber; }

    public Integer getApartmentNumber() { return apartmentNumber; }
    public void setApartmentNumber(Integer apartmentNumber) { this.apartmentNumber = apartmentNumber; }

    public Double getArea() { return area; }
    public void setArea(Double area) { this.area = area; }

    public Integer getNumberOfRooms() { return numberOfRooms; }
    public void setNumberOfRooms(Integer numberOfRooms) { this.numberOfRooms = numberOfRooms; }

    public Boolean getStorageUnit() { return storageUnit; }
    public void setStorageUnit(Boolean storageUnit) { this.storageUnit = storageUnit; }

    public Integer getParkingSpotNumber() { return parkingSpotNumber; }
    public void setParkingSpotNumber(Integer parkingSpotNumber) { this.parkingSpotNumber = parkingSpotNumber; }

    // Nowe listy
    public List<RentPayment> getRentPayments() { return rentPayments; }
    public void setRentPayments(List<RentPayment> rentPayments) { this.rentPayments = rentPayments; }

    public List<MeterReading> getMeterReadings() { return meterReadings; }
    public void setMeterReadings(List<MeterReading> meterReadings) { this.meterReadings = meterReadings; }

    public List<Expense> getExpenses() { return expenses; }
    public void setExpenses(List<Expense> expenses) { this.expenses = expenses; }
}