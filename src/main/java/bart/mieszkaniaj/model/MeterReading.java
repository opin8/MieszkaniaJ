package bart.mieszkaniaj.model;

import jakarta.persistence.Embeddable;
import java.time.LocalDate;

@Embeddable
public class MeterReading {
    private LocalDate dateFrom;
    private LocalDate dateTo;
    private Double reading;
    private Double cost;

    public MeterReading() {}
    // gettery i settery
    public LocalDate getDateFrom() { return dateFrom; }
    public void setDateFrom(LocalDate dateFrom) { this.dateFrom = dateFrom; }
    public LocalDate getDateTo() { return dateTo; }
    public void setDateTo(LocalDate dateTo) { this.dateTo = dateTo; }
    public Double getReading() { return reading; }
    public void setReading(Double reading) { this.reading = reading; }
    public Double getCost() { return cost; }
    public void setCost(Double cost) { this.cost = cost; }
}