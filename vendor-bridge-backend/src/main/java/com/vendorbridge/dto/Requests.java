package com.vendorbridge.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public final class Requests {
    private Requests() {}

    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}
    public record RegisterRequest(@NotBlank String name, @Email @NotBlank String email, @NotBlank String password, @NotBlank String role, String companyName, String phone, String category, String address) {}
    public record CreateVendorRequest(String name, String companyName, String category, String gstNumber, @Email String email, String phone, String address, String status) {}
    public record RfqItemRequest(String id, String description, String productName, @Positive Integer quantity, String unit) {}
    public record CreateRfqRequest(@NotBlank String title, String description, String category, @NotNull LocalDate deadline, List<RfqItemRequest> items, List<Long> assignedVendorIds, List<String> assignedVendors) {}
    public record QuotationItemRequest(String id, Long rfqItemId, String description, Integer quantity, String unit, @NotNull BigDecimal unitPrice, BigDecimal total) {}
    public record SubmitQuotationRequest(Long rfqId, String rfqNumber, Long vendorId, String vendorName, List<QuotationItemRequest> items, BigDecimal subtotal, BigDecimal tax, BigDecimal totalAmount, Integer deliveryDays, LocalDate validUntil, String notes) {}
    public record ApprovalActionRequest(@NotBlank String status, String remarks) {}
    public record IdRequest(Long quotationId, Long poId) {}
}
