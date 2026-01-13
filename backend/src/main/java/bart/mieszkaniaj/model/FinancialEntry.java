package bart.mieszkaniaj.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "financial_entries")
public class FinancialEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "apartment_id")
    private Apartment apartment; // Powiązane mieszkanie (może być null jeśli ogólne)

    @Column(name = "category", nullable = false)
    private String category; // np. Czynsz administracyjny, Prąd, Remont/naprawa, Podatek, Inne...

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "net_amount", nullable = false)
    private double netAmount; // Kwota netto (może być ujemna – zwrot)

    @Column(name = "vat_rate", nullable = false)
    private double vatRate; // Stawka VAT w %

    @Column(name = "description")
    private String description;

    @Column(name = "paid", nullable = false)
    private boolean paid; // Opłacono

    // Konstruktor pusty (wymagany przez JPA)
    public FinancialEntry() {}

    // Gettery i settery
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public Apartment getApartment() { return apartment; }
    public void setApartment(Apartment apartment) { this.apartment = apartment; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public double getNetAmount() { return netAmount; }
    public void setNetAmount(double netAmount) { this.netAmount = netAmount; }

    public double getVatRate() { return vatRate; }
    public void setVatRate(double vatRate) { this.vatRate = vatRate; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public boolean isPaid() { return paid; }
    public void setPaid(boolean paid) { this.paid = paid; }
}