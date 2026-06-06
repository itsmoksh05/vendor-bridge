package com.vendorbridge.service;

import com.vendorbridge.model.Models;
import com.vendorbridge.model.Role;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataStore {
    public final AtomicLong userSeq = new AtomicLong(4), vendorSeq = new AtomicLong(5), rfqSeq = new AtomicLong(3), quoteSeq = new AtomicLong(3), approvalSeq = new AtomicLong(1), poSeq = new AtomicLong(1), invoiceSeq = new AtomicLong(1), logSeq = new AtomicLong(2);
    public final Map<Long, Models.User> users = new ConcurrentHashMap<>();
    public final Map<Long, Models.Vendor> vendors = new ConcurrentHashMap<>();
    public final Map<Long, Models.Rfq> rfqs = new ConcurrentHashMap<>();
    public final Map<Long, Models.Quotation> quotations = new ConcurrentHashMap<>();
    public final Map<Long, Models.Approval> approvals = new ConcurrentHashMap<>();
    public final Map<Long, Models.PurchaseOrder> purchaseOrders = new ConcurrentHashMap<>();
    public final Map<Long, Models.Invoice> invoices = new ConcurrentHashMap<>();
    public final List<Models.ActivityLog> logs = new ArrayList<>();

    public DataStore(PasswordEncoder encoder) {
        users.put(1L, new Models.User(1L, "System Admin", "admin@vendorbridge.com", encoder.encode("admin123"), Role.ADMIN, true));
        users.put(2L, new Models.User(2L, "Sarah Jenkins", "procurement@vendorbridge.com", encoder.encode("procurement123"), Role.PROCUREMENT_OFFICER, true));
        users.put(3L, new Models.User(3L, "Robert Vance", "manager@vendorbridge.com", encoder.encode("manager123"), Role.MANAGER, true));
        users.put(4L, new Models.User(4L, "Acme Corp Admin", "vendor@vendorbridge.com", encoder.encode("vendor123"), Role.VENDOR, true));
        vendors.put(1L, new Models.Vendor(1L, 4L, "Acme Corp", "Acme Corp", "IT Hardware", "29ABCDE1234F1Z5", "vendor@vendorbridge.com", "+1 555-0199", "123 Acme Way", "active", BigDecimal.valueOf(4.8), LocalDateTime.now().minusDays(12)));
        vendors.put(2L, new Models.Vendor(2L, null, "Globex Corporation", "Globex Corporation", "Office Supplies", "27GLOBE1234F1Z5", "globex@vendorbridge.com", "+1 555-0144", "456 Globex Plaza", "active", BigDecimal.valueOf(4.2), LocalDateTime.now().minusDays(10)));
        vendors.put(3L, new Models.Vendor(3L, null, "Initech LLC", "Initech LLC", "Software Licensing", "07INITC1234F1Z5", "initech@vendorbridge.com", "+1 555-0188", "789 Initech Rd", "active", BigDecimal.valueOf(4.5), LocalDateTime.now().minusDays(8)));
        vendors.put(4L, new Models.Vendor(4L, null, "Umbrella Corp", "Umbrella Corp", "Lab Equipment", "19UMBRL1234F1Z5", "umbrella@vendorbridge.com", "+1 555-0166", "101 Hive City", "pending", BigDecimal.valueOf(3.9), LocalDateTime.now().minusDays(6)));
        vendors.put(5L, new Models.Vendor(5L, null, "Cyberdyne Systems", "Cyberdyne Systems", "Industrial Machinery", "33CYBER1234F1Z5", "cyberdyne@vendorbridge.com", "+1 555-0177", "2048 Future Way", "active", BigDecimal.valueOf(4.7), LocalDateTime.now().minusDays(4)));
        List<Models.RfqItem> laptopItems = List.of(new Models.RfqItem(1L, "Developer Laptops (32GB RAM, 16 inch Screen)", "Developer Laptops", 25, "pcs"));
        rfqs.put(1L, new Models.Rfq(1L, "RFQ-2026-001", "Developer Laptops Procurement", "Procuring high-end developer laptops.", "IT Hardware", "open", LocalDate.now().plusDays(14), 2L, LocalDateTime.now().minusDays(5), laptopItems, List.of(1L,2L,3L)));
        rfqs.put(2L, new Models.Rfq(2L, "RFQ-2026-002", "HQ Office Stationery Annual Supply", "Annual office stationery supply.", "Office Supplies", "closed", LocalDate.now().plusDays(8), 2L, LocalDateTime.now().minusDays(20), List.of(new Models.RfqItem(2L, "A4 Printing Paper Boxes", "A4 Paper", 100, "boxes")), List.of(2L)));
        rfqs.put(3L, new Models.Rfq(3L, "RFQ-2026-003", "Cloud Infrastructure Upgrade Services", "Migration services and optimization.", "Software Licensing", "awarded", LocalDate.now().minusDays(1), 2L, LocalDateTime.now().minusDays(15), List.of(new Models.RfqItem(3L, "Cloud Architect Consultation", "Cloud Consultation", 80, "hours")), List.of(1L,3L)));
        Models.Quotation q1 = new Models.Quotation(1L, 1L, "RFQ-2026-001", 1L, "Acme Corp", List.of(new Models.QuotationItem(1L, "Developer Laptops", 1L, 25, "pcs", BigDecimal.valueOf(1500), BigDecimal.valueOf(37500))), BigDecimal.valueOf(37500), BigDecimal.valueOf(3750), BigDecimal.valueOf(41250), 10, LocalDate.now().plusDays(25), "pending", "3-year warranty included", LocalDateTime.now().minusDays(3));
        Models.Quotation q2 = new Models.Quotation(2L, 1L, "RFQ-2026-001", 2L, "Globex Corporation", List.of(new Models.QuotationItem(2L, "Developer Laptops", 1L, 25, "pcs", BigDecimal.valueOf(1450), BigDecimal.valueOf(36250))), BigDecimal.valueOf(36250), BigDecimal.valueOf(3625), BigDecimal.valueOf(39875), 15, LocalDate.now().plusDays(20), "pending", "Standard warranty", LocalDateTime.now().minusDays(2));
        quotations.put(1L, q1); quotations.put(2L, q2);
        approvals.put(1L, new Models.Approval(1L, "Award RFQ-2026-003: Cloud Services", 3L, "RFQ-2026-003", 3L, 3L, "Initech LLC", BigDecimal.valueOf(12800), "Sarah Jenkins", "approved", "Best value", LocalDateTime.now().minusDays(1), LocalDateTime.now().minusHours(12)));
        purchaseOrders.put(1L, new Models.PurchaseOrder(1L, "PO-2026-001", 3L, 3L, "RFQ-2026-003", 3L, "Initech LLC", BigDecimal.valueOf(12800), BigDecimal.valueOf(2304), BigDecimal.valueOf(15104), "approved", LocalDate.now().plusDays(30), LocalDateTime.now().minusHours(10), List.of(new Models.QuotationItem(3L, "Cloud Architect Consultation", 3L, 80, "hours", BigDecimal.valueOf(160), BigDecimal.valueOf(12800)))));
        invoices.put(1L, new Models.Invoice(1L, "INV-2026-001", 1L, "PO-2026-001", 3L, "Initech LLC", BigDecimal.valueOf(12800), BigDecimal.valueOf(18), BigDecimal.valueOf(2304), BigDecimal.valueOf(15104), "pending", LocalDate.now().plusDays(30), null, LocalDateTime.now(), purchaseOrders.get(1L).items()));
        logs.add(new Models.ActivityLog(1L, "admin@vendorbridge.com", "ADMIN", "USER", 1L, "LOGIN", "User logged in", LocalDateTime.now().minusHours(2)));
        logs.add(new Models.ActivityLog(2L, "Sarah Jenkins", "PROCUREMENT_OFFICER", "RFQ", 1L, "RFQ_CREATED", "Created RFQ-2026-001", LocalDateTime.now().minusHours(1)));
    }
}
