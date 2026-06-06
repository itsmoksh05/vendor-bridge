package com.vendorbridge.service;

import com.vendorbridge.dto.Requests;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.model.Models;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class VendorService {
    private final DataStore data; private final ActivityLogService logs;
    public VendorService(DataStore data, ActivityLogService logs) { this.data = data; this.logs = logs; }
    public List<Models.Vendor> all(String search, String status) {
        return data.vendors.values().stream()
            .filter(v -> search == null || search.isBlank() || v.name().toLowerCase().contains(search.toLowerCase()) || (v.category()!=null && v.category().toLowerCase().contains(search.toLowerCase())))
            .filter(v -> status == null || status.isBlank() || v.status().equalsIgnoreCase(status))
            .sorted(Comparator.comparing(Models.Vendor::id)).toList();
    }
    public Models.Vendor get(Long id) { return data.vendors.getOrDefault(id, null) == null ? notFound(id) : data.vendors.get(id); }
    private Models.Vendor notFound(Long id) { throw new ResourceNotFoundException("Vendor not found: " + id); }
    public Models.Vendor create(Requests.CreateVendorRequest r) {
        Long id = data.vendorSeq.incrementAndGet(); String name = value(r.name(), value(r.companyName(), "Vendor " + id));
        Models.Vendor v = new Models.Vendor(id, null, name, name, r.category(), r.gstNumber(), r.email(), r.phone(), r.address(), value(r.status(), "active"), BigDecimal.valueOf(5), LocalDateTime.now());
        data.vendors.put(id, v); logs.log("Current User", "PROCUREMENT_OFFICER", "VENDOR", id, "VENDOR_CREATED", "Created vendor " + name); return v;
    }
    public Models.Vendor update(Long id, Requests.CreateVendorRequest r) {
        Models.Vendor old = get(id); Models.Vendor v = new Models.Vendor(id, old.userId(), value(r.name(), old.name()), value(r.companyName(), old.companyName()), value(r.category(), old.category()), value(r.gstNumber(), old.gstNumber()), value(r.email(), old.email()), value(r.phone(), old.phone()), value(r.address(), old.address()), value(r.status(), old.status()), old.rating(), old.createdAt());
        data.vendors.put(id, v); logs.log("Current User", "PROCUREMENT_OFFICER", "VENDOR", id, "VENDOR_UPDATED", "Updated vendor " + v.name()); return v;
    }
    public Models.Vendor status(Long id, String status) { Models.Vendor old = get(id); Models.Vendor v = new Models.Vendor(old.id(), old.userId(), old.name(), old.companyName(), old.category(), old.gstNumber(), old.email(), old.phone(), old.address(), status, old.rating(), old.createdAt()); data.vendors.put(id, v); return v; }
    private String value(String value, String fallback) { return value == null || value.isBlank() ? fallback : value; }
}
