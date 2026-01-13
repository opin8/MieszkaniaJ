package bart.mieszkaniaj.controller;

import bart.mieszkaniaj.service.AnalyticsService;
import bart.mieszkaniaj.service.AnalyticsService.AnalyticsSummary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @Autowired
    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public AnalyticsSummary getAnalytics(
            @RequestParam(value = "apartmentIds", required = false) List<Integer> apartmentIds,
            @RequestParam(value = "categories", required = false) List<String> categories,
            @RequestParam(value = "dateFrom", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(value = "dateTo", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(value = "onlyPaid", defaultValue = "false") boolean onlyPaid) {

        List<Integer> safeApartmentIds = apartmentIds != null ? apartmentIds : new ArrayList<>();
        List<String> safeCategories = categories != null ? categories : new ArrayList<>();

        return analyticsService.getAnalytics(safeApartmentIds, safeCategories, dateFrom, dateTo, onlyPaid);
    }
}