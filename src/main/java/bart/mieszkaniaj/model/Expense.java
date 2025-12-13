package bart.mieszkaniaj.model;

import jakarta.persistence.Embeddable;
import java.time.LocalDate;

@Embeddable
public class Expense {
    private LocalDate date;
    private String category;     // "Podatek", "Naprawa", "Ubezpieczenie", "Inne"
    private String description;  // tylko gdy "Inne"
    private Double amount;

    public Expense() {}
    // gettery i settery
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
}