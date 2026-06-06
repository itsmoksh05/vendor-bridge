package com.vendorbridge.service;

import com.vendorbridge.dto.Requests;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.model.Models;
import com.vendorbridge.util.NumberGenerator;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ApprovalService {
    private final DataStore data; private final NumberGenerator numbers; private final ActivityLogService logs;
    public ApprovalService(DataStore data, NumberGenerator numbers, ActivityLogService logs) { this.data = data; this.numbers = numbers; this.logs = logs; }
    public List<Models.Approval> all() { return data.approvals.values().stream().sorted(Comparator.comparing(Models.Approval::createdAt).reversed()).toList(); }
    public List<Models.Approval> pending() { return all().stream().filter(a -> "pending".equalsIgnoreCase(a.status())).toList(); }
    public Models.Approval request(Long quotationId) { Models.Quotation q = data.quotations.get(quotationId); if (q == null) throw new ResourceNotFoundException("Quotation not found: " + quotationId); Long id = data.approvalSeq.incrementAndGet(); Models.Approval app = new Models.Approval(id, "Award " + q.rfqNumber() + ": " + q.vendorName(), q.rfqId(), q.rfqNumber(), q.id(), q.vendorId(), q.vendorName(), q.totalAmount(), "Sarah Jenkins", "pending", q.notes(), LocalDateTime.now(), null); data.approvals.put(id, app); return app; }
    public Models.Approval action(Long id, String action, String remarks) {
        Models.Approval old = data.approvals.get(id); if (old == null) throw new ResourceNotFoundException("Approval not found: " + id);
        String status = action == null ? "approved" : action.toLowerCase(); Models.Approval app = new Models.Approval(old.id(), old.title(), old.rfqId(), old.rfqNumber(), old.quotationId(), old.vendorId(), old.vendorName(), old.amount(), old.requestedBy(), status, remarks, old.createdAt(), LocalDateTime.now()); data.approvals.put(id, app);
        if ("approve".equals(status) || "approved".equals(status)) createPo(app);
        logs.log("Robert Vance", "MANAGER", "APPROVAL", id, status.toUpperCase(), "Approval " + status); return app;
    }
    public Models.Approval action(Long id, Requests.ApprovalActionRequest request) { return action(id, request.status(), request.remarks()); }
    private void createPo(Models.Approval app) {
        boolean exists = data.purchaseOrders.values().stream().anyMatch(p -> p.quotationId() != null && p.quotationId().equals(app.quotationId())); if (exists) return;
        Models.Quotation q = data.quotations.get(app.quotationId()); List<Models.QuotationItem> items = q == null ? List.of() : q.items(); BigDecimal amount = app.amount(); BigDecimal tax = amount.multiply(BigDecimal.valueOf(0.18)); Long poId = data.poSeq.incrementAndGet();
        Models.PurchaseOrder po = new Models.PurchaseOrder(poId, numbers.generatePoNumber(), app.quotationId(), app.rfqId(), app.rfqNumber(), app.vendorId(), app.vendorName(), amount, tax, amount.add(tax), "approved", LocalDate.now().plusDays(q == null ? 30 : q.deliveryDays()), LocalDateTime.now(), items);
        data.purchaseOrders.put(poId, po);
    }
}
