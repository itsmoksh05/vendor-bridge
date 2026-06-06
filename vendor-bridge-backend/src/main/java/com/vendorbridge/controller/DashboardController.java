package com.vendorbridge.controller;

import com.vendorbridge.dto.Responses;
import com.vendorbridge.model.Models;
import com.vendorbridge.service.DashboardService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class DashboardController {
    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping({"/api/dashboard/summary", "/api/reports/overview"})
    public Responses.DashboardSummaryResponse summary() {
        return dashboardService.summary();
    }

    @GetMapping("/api/dashboard/analytics/spending")
    public List<Responses.MonthlySpendResponse> monthlySpend(@RequestParam(required = false) Integer year) {
        return dashboardService.monthlySpend(year);
    }

    @GetMapping("/api/dashboard/analytics/vendors")
    public List<Models.Vendor> vendorPerformance() {
        return dashboardService.vendorPerformance();
    }
}
