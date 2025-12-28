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
    private int id;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "postal_code", nullable = false, length = 6)
    private String postalCode;

    @Column(name = "street", nullable = false)
    private String street;

    @Column(name = "house_number", nullable = false)
    private int houseNumber;

    @Column(name = "apartment_number", nullable = false)
    private int apartmentNumber;

    @Column(name = "area", nullable = false)
    private double area;

    @Column(name = "number_of_rooms", nullable = false)
    private int numberOfRooms;

    @Column(name = "storage_unit", nullable = false)
    private boolean storageUnit;

    @Column(name = "parking_spot_number")
    private Integer parkingSpotNumber;

    @Column(name = "balcony_terrace_area")
    private Double balconyTerraceArea;

    @Column(name = "garage_number")
    private String garageNumber;

    // Konstruktor pusty
    public Apartment() {}

    // Gettery i settery (wszystkie istniejące + nowe listy)
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public int getHouseNumber() { return houseNumber; }
    public void setHouseNumber(int houseNumber) { this.houseNumber = houseNumber; }

    public int getApartmentNumber() { return apartmentNumber; }
    public void setApartmentNumber(int apartmentNumber) { this.apartmentNumber = apartmentNumber; }

    public double getArea() { return area; }
    public void setArea(double area) { this.area = area; }

    public int getNumberOfRooms() { return numberOfRooms; }
    public void setNumberOfRooms(int numberOfRooms) { this.numberOfRooms = numberOfRooms; }

    public boolean isStorageUnit() { return storageUnit; }
    public void setStorageUnit(boolean storageUnit) { this.storageUnit = storageUnit; }

    public Integer getParkingSpotNumber() { return parkingSpotNumber; }
    public void setParkingSpotNumber(Integer parkingSpotNumber) { this.parkingSpotNumber = parkingSpotNumber; }

    public Double getBalconyTerraceArea() { return balconyTerraceArea; }
    public void setBalconyTerraceArea(Double balconyTerraceArea) { this.balconyTerraceArea = balconyTerraceArea; }

    public String getGarageNumber() { return garageNumber; }
    public void setGarageNumber(String garageNumber) { this.garageNumber = garageNumber; }
}