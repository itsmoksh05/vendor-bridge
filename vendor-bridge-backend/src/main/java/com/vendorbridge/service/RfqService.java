package com.vendorbridge.service;

import com.vendorbridge.dto.Requests;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.model.Models;
import com.vendorbridge.util.NumberGenerator;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Service;

@Service
public class RfqService {
    private final DataStore data; private final NumberGenerator numbers; private final ActivityLogService logs;
    public RfqService(DataStore data, NumberGenerator numbers, ActivityLogService logs) { this.data = data; this.numbers = numbers; this.logs = logs; }
    public List<Models.Rfq> all() { return data.rfqs.values().stream().sorted(Comparator.comparing(Models.Rfq::createdAt).reversed()).toList(); }
    public Models.Rfq get(Long id) { Models.Rfq rfq = data.rfqs.get(id); if (rfq == null) throw new ResourceNotFoundException("RFQ not found: " + id); return rfq; }
    public Models.Rfq create(Requests.CreateRfqRequest r) {
        Long id = data.rfqSeq.incrementAndGet(); AtomicLong itemSeq = new AtomicLong(id * 100);
        List<Models.RfqItem> items = r.items() == null ? List.of() : r.items().stream().map(i -> new Models.RfqItem(itemSeq.incrementAndGet(), value(i.description(), i.productName()), value(i.productName(), i.description()), i.quantity() == null ? 1 : i.quantity(), value(i.unit(), "pcs"))).toList();
        List<Long> vendorIds = r.assignedVendorIds() == null ? parseVendorIds(r.assignedVendors()) : r.assignedVendorIds();
        Models.Rfq rfq = new Models.Rfq(id, numbers.generateRfqNumber(), r.title(), r.description(), r.category(), "open", r.deadline(), 2L, LocalDateTime.now(), items, vendorIds);
        data.rfqs.put(id, rfq); logs.log("Sarah Jenkins", "PROCUREMENT_OFFICER", "RFQ", id, "RFQ_CREATED", "Created " + rfq.rfqNumber()); return rfq;
    }
    public Models.Rfq close(Long id) { Models.Rfq old = get(id); Models.Rfq rfq = new Models.Rfq(old.id(), old.rfqNumber(), old.title(), old.description(), old.category(), "closed", old.deadline(), old.createdById(), old.createdAt(), old.items(), old.assignedVendorIds()); data.rfqs.put(id, rfq); return rfq; }
    private String value(String v, String f) { return v == null || v.isBlank() ? f : v; }
    private List<Long> parseVendorIds(List<String> vendorIds) {
        if (vendorIds == null) return List.of();
        return vendorIds.stream().map(id -> {
            try {
                return Long.parseLong(id);
            } catch (NumberFormatException ex) {
                return null;
            }
        }).filter(java.util.Objects::nonNull).toList();
    }
}
