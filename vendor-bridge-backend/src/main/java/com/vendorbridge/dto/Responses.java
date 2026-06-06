package com.vendorbridge.dto;

import com.vendorbridge.model.Models;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public final class Responses {
    private Responses() {}

    public record AuthResponse(String token, Long id, String name, String email, String role, Models.User user) {}
    public record ApiResponse<T>(boolean success, String message, T data, LocalDateTime timestamp) {
        public static <T> ApiResponse<T> success(T data) { return new ApiResponse<>(true, "Success", data, LocalDateTime.now()); }
        public static <T> ApiResponse<T> success(String message, T data) { return new ApiResponse<>(true, message, data, LocalDateTime.now()); }
        public static <T> ApiResponse<T> error(String message) { return new ApiResponse<>(false, message, null, LocalDateTime.now()); }
    }
    public record DashboardSummaryResponse(long pendingApprovals, long activeRfqs, long recentPoCount, long recentInvoiceCount, long totalVendors, long totalRfqs, long rfqCount, long pendingApprovalsCount, long vendorsCount, long invoicesThisMonth) {}
    public record MonthlySpendResponse(int month, String monthName, BigDecimal totalSpend) {}
    public record VendorQuoteSummary(Long quotationId, Long vendorId, String companyName, BigDecimal totalAmount, BigDecimal taxAmount, BigDecimal grandTotal, Integer deliveryDays, LocalDate validityDate, BigDecimal vendorRating, boolean isLowestPrice, boolean isHighestPrice, String status, List<Models.QuotationItem> items) {}
    public record QuotationComparisonResponse(Long rfqId, String rfqTitle, String rfqNumber, List<VendorQuoteSummary> vendors) {}
}
