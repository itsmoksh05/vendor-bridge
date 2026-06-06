package com.vendorbridge.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public final class Models {
    private Models() {}

    public record User(Long id, String name, String email, String password, Role role, boolean active) {}
    public record Vendor(Long id, Long userId, String name, String companyName, String category, String gstNumber, String email, String phone, String address, String status, BigDecimal rating, LocalDateTime createdAt) {}
    public record RfqItem(Long id, String description, String productName, int quantity, String unit) {}
    public record Rfq(Long id, String rfqNumber, String title, String description, String category, String status, LocalDate deadline, Long createdById, LocalDateTime createdAt, List<RfqItem> items, List<Long> assignedVendorIds) {}
    public record QuotationItem(Long id, String description, Long rfqItemId, int quantity, String unit, BigDecimal unitPrice, BigDecimal total) {}
    public record Quotation(Long id, Long rfqId, String rfqNumber, Long vendorId, String vendorName, List<QuotationItem> items, BigDecimal subtotal, BigDecimal tax, BigDecimal totalAmount, int deliveryDays, LocalDate validUntil, String status, String notes, LocalDateTime createdAt) {}
    public record Approval(Long id, String title, Long rfqId, String rfqNumber, Long quotationId, Long vendorId, String vendorName, BigDecimal amount, String requestedBy, String status, String remarks, LocalDateTime createdAt, LocalDateTime actionedAt) {}
    public record PurchaseOrder(Long id, String poNumber, Long quotationId, Long rfqId, String rfqNumber, Long vendorId, String vendorName, BigDecimal amount, BigDecimal taxAmount, BigDecimal grandTotal, String status, LocalDate deliveryDate, LocalDateTime createdAt, List<QuotationItem> items) {}
    public record Invoice(Long id, String invoiceNumber, Long poId, String poNumber, Long vendorId, String vendorName, BigDecimal subtotal, BigDecimal taxRate, BigDecimal taxAmount, BigDecimal amount, String status, LocalDate dueDate, LocalDateTime emailSentAt, LocalDateTime createdAt, List<QuotationItem> items) {}
    public record ActivityLog(Long id, String user, String role, String entityType, Long entityId, String action, String description, LocalDateTime timestamp) {}

    public static <T> List<T> copy(List<T> list) {
        return list == null ? new ArrayList<>() : new ArrayList<>(list);
    }
}
