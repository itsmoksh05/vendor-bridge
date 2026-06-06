package com.vendorbridge.service;

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
public class PurchaseOrderService {
    private final DataStore data; private final NumberGenerator numbers; private final ActivityLogService logs;
    public PurchaseOrderService(DataStore data, NumberGenerator numbers, ActivityLogService logs) { this.data = data; this.numbers = numbers; this.logs = logs; }
    public List<Models.PurchaseOrder> all() { return data.purchaseOrders.values().stream().sorted(Comparator.comparing(Models.PurchaseOrder::createdAt).reversed()).toList(); }
    public Models.PurchaseOrder get(Long id) { Models.PurchaseOrder po = data.purchaseOrders.get(id); if (po == null) throw new ResourceNotFoundException("Purchase order not found: " + id); return po; }
    public Models.PurchaseOrder generate(Long quotationId) {
        Models.Quotation q = data.quotations.get(quotationId); if (q == null) throw new ResourceNotFoundException("Quotation not found: " + quotationId);
        BigDecimal tax = q.totalAmount().multiply(BigDecimal.valueOf(0.18)); Long id = data.poSeq.incrementAndGet(); Models.PurchaseOrder po = new Models.PurchaseOrder(id, numbers.generatePoNumber(), quotationId, q.rfqId(), q.rfqNumber(), q.vendorId(), q.vendorName(), q.totalAmount(), tax, q.totalAmount().add(tax), "created", LocalDate.now().plusDays(q.deliveryDays()), LocalDateTime.now(), q.items()); data.purchaseOrders.put(id, po); logs.log("Sarah Jenkins", "PROCUREMENT_OFFICER", "PO", id, "PO_GENERATED", "Generated " + po.poNumber()); return po;
    }
}
