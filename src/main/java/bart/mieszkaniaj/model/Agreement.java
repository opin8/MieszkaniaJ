package bart.mieszkaniaj.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "agreements")
public class Agreement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "contractor_id", nullable = false)
    private Contractor contractor;

    @ManyToOne
    @JoinColumn(name = "apartment_id", nullable = false)
    private Apartment apartment;

    @Column(name = "category", nullable = false)
    private String category; // Czynsz najmu, Czynsz administracyjny itd.

    @Column(name = "date_from", nullable = false)
    private LocalDate dateFrom;

    @Column(name = "date_to")
    private LocalDate dateTo;

    @Column(name = "net_value", nullable = false)
    private double netValue;

    @Column(name = "vat_rate", nullable = false)
    private double vatRate;

    @Column(name = "description")
    private String description;

    @Column(name = "tax_operation", nullable = false)
    private boolean taxOperation;

    @Column(name = "paid", nullable = false)
    private boolean paid;

    public Agreement() {}

    // Gettery i settery
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public Contractor getContractor() { return contractor; }
    public void setContractor(Contractor contractor) { this.contractor = contractor; }

    public Apartment getApartment() { return apartment; }
    public void setApartment(Apartment apartment) { this.apartment = apartment; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getDateFrom() { return dateFrom; }
    public void setDateFrom(LocalDate dateFrom) { this.dateFrom = dateFrom; }

    public LocalDate getDateTo() { return dateTo; }
    public void setDateTo(LocalDate dateTo) { this.dateTo = dateTo; }

    public double getNetValue() { return netValue; }
    public void setNetValue(double netValue) { this.netValue = netValue; }

    public double getVatRate() { return vatRate; }
    public void setVatRate(double vatRate) { this.vatRate = vatRate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isTaxOperation() { return taxOperation; }
    public void setTaxOperation(boolean taxOperation) { this.taxOperation = taxOperation; }

    public boolean isPaid() { return paid; }
    public void setPaid(boolean paid) { this.paid = paid; }
}