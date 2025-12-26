package bart.mieszkaniaj.controller;

import bart.mieszkaniaj.service.AnalyticsService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public AnalyticsService.AnalyticsSummary getAnalytics(
            @RequestParam(required = false) List<Integer> apartmentIds,
            @RequestParam(required = false) List<String> categories,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) Boolean onlyPaid
    ) {
        return analyticsService.getAnalytics(apartmentIds, categories, dateFrom, dateTo, onlyPaid);
    }
}