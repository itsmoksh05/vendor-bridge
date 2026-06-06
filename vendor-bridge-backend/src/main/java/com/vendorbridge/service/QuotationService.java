package com.vendorbridge.service;

import com.vendorbridge.dto.Requests;
import com.vendorbridge.dto.Responses;
import com.vendorbridge.exception.BusinessException;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.model.Models;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class QuotationService {
    private final DataStore data; private final ActivityLogService logs;
    public QuotationService(DataStore data, ActivityLogService logs) { this.data = data; this.logs = logs; }
    public List<Models.Quotation> all() { return data.quotations.values().stream().sorted(Comparator.comparing(Models.Quotation::createdAt).reversed()).toList(); }
    public List<Models.Quotation> byRfq(Long rfqId) { return all().stream().filter(q -> q.rfqId().equals(rfqId)).toList(); }
    public Models.Quotation submit(Long rfqId, Requests.SubmitQuotationRequest r) {
        Models.Rfq rfq = data.rfqs.get(rfqId); if (rfq == null) throw new ResourceNotFoundException("RFQ not found: " + rfqId);
        Long vendorId = r.vendorId() == null ? 1L : r.vendorId(); Models.Vendor vendor = data.vendors.get(vendorId); if (vendor == null) throw new ResourceNotFoundException("Vendor not found: " + vendorId);
        Long id = data.quoteSeq.incrementAndGet();
        List<Models.QuotationItem> items = r.items() == null ? List.of() : r.items().stream().map(i -> new Models.QuotationItem(id * 100 + r.items().indexOf(i), value(i.description(), "Quoted item"), i.rfqItemId(), i.quantity() == null ? 1 : i.quantity(), value(i.unit(), "pcs"), i.unitPrice(), i.total() == null ? i.unitPrice().multiply(BigDecimal.valueOf(i.quantity() == null ? 1 : i.quantity())) : i.total())).toList();
        BigDecimal subtotal = r.subtotal() != null ? r.subtotal() : items.stream().map(Models.QuotationItem::total).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal tax = r.tax() != null ? r.tax() : subtotal.multiply(BigDecimal.valueOf(0.10));
        BigDecimal total = r.totalAmount() != null ? r.totalAmount() : subtotal.add(tax);
        Models.Quotation q = new Models.Quotation(id, rfqId, rfq.rfqNumber(), vendorId, vendor.name(), items, subtotal, tax, total, r.deliveryDays() == null ? 7 : r.deliveryDays(), r.validUntil(), "pending", r.notes(), LocalDateTime.now());
        data.quotations.put(id, q); logs.log(vendor.name(), "VENDOR", "QUOTATION", id, "QUOTATION_SUBMITTED", "Submitted quote for " + rfq.rfqNumber()); return q;
    }
    public Models.Approval award(Long quoteId) {
        Models.Quotation q = data.quotations.get(quoteId); if (q == null) throw new ResourceNotFoundException("Quotation not found: " + quoteId);
        Long id = data.approvalSeq.incrementAndGet(); Models.Approval app = new Models.Approval(id, "Award " + q.rfqNumber() + ": " + q.vendorName(), q.rfqId(), q.rfqNumber(), q.id(), q.vendorId(), q.vendorName(), q.totalAmount(), "Sarah Jenkins", "pending", q.notes(), LocalDateTime.now(), null);
        data.approvals.put(id, app); logs.log("Sarah Jenkins", "PROCUREMENT_OFFICER", "APPROVAL", id, "APPROVAL_REQUESTED", app.title()); return app;
    }
    public Responses.QuotationComparisonResponse compare(Long rfqId) {
        Models.Rfq rfq = data.rfqs.get(rfqId); if (rfq == null) throw new ResourceNotFoundException("RFQ not found: " + rfqId);
        List<Models.Quotation> quotes = byRfq(rfqId); if (quotes.isEmpty()) return new Responses.QuotationComparisonResponse(rfqId, rfq.title(), rfq.rfqNumber(), List.of());
        BigDecimal min = quotes.stream().map(Models.Quotation::totalAmount).min(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
        BigDecimal max = quotes.stream().map(Models.Quotation::totalAmount).max(BigDecimal::compareTo).orElse(BigDecimal.ZERO);
        return new Responses.QuotationComparisonResponse(rfqId, rfq.title(), rfq.rfqNumber(), quotes.stream().sorted(Comparator.comparing(Models.Quotation::totalAmount)).map(q -> new Responses.VendorQuoteSummary(q.id(), q.vendorId(), q.vendorName(), q.subtotal(), q.tax(), q.totalAmount(), q.deliveryDays(), q.validUntil(), data.vendors.get(q.vendorId()).rating(), q.totalAmount().compareTo(min) == 0, q.totalAmount().compareTo(max) == 0, q.status(), q.items())).toList());
    }
    private String value(String v, String f) { return v == null || v.isBlank() ? f : v; }
}
