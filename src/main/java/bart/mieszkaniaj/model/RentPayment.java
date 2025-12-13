package bart.mieszkaniaj.model;

import jakarta.persistence.Embeddable;
import java.time.LocalDate;

@Embeddable
public class RentPayment {
    private LocalDate validFrom;
    private LocalDate validTo;  // może być null jeśli aktualne
    private Double amount;

    public RentPayment() {}
    // gettery i settery
    public LocalDate getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDate validFrom) { this.validFrom = validFrom; }
    public LocalDate getValidTo() { return validTo; }
    public void setValidTo(LocalDate validTo) { this.validTo = validTo; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
}