package com.vendorbridge.service;

import com.vendorbridge.dto.Responses;
import com.vendorbridge.model.Models;
import java.math.BigDecimal;
import java.time.Month;
import java.time.Year;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    private final DataStore data;
    public DashboardService(DataStore data) { this.data = data; }
    public Responses.DashboardSummaryResponse summary() {
        long pending = data.approvals.values().stream().filter(a -> "pending".equalsIgnoreCase(a.status())).count(); long open = data.rfqs.values().stream().filter(r -> "open".equalsIgnoreCase(r.status())).count(); long vendors = data.vendors.size(); long invoices = data.invoices.size();
        return new Responses.DashboardSummaryResponse(pending, open, data.purchaseOrders.size(), invoices, vendors, data.rfqs.size(), open, pending, vendors, invoices);
    }
    public List<Responses.MonthlySpendResponse> monthlySpend(Integer year) { int y = year == null ? Year.now().getValue() : year; return java.util.stream.IntStream.rangeClosed(1, 12).mapToObj(m -> new Responses.MonthlySpendResponse(m, Month.of(m).name(), data.invoices.values().stream().filter(i -> i.createdAt().getYear() == y && i.createdAt().getMonthValue() == m).map(Models.Invoice::amount).reduce(BigDecimal.ZERO, BigDecimal::add))).toList(); }
    public List<Models.Vendor> vendorPerformance() { return data.vendors.values().stream().limit(10).toList(); }
}
