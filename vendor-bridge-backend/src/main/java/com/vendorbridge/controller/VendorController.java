package com.vendorbridge.controller;

import com.vendorbridge.dto.Requests;
import com.vendorbridge.model.Models;
import com.vendorbridge.service.VendorService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class VendorController {
    private final VendorService vendorService;

    public VendorController(VendorService vendorService) {
        this.vendorService = vendorService;
    }

    @GetMapping
    public List<Models.Vendor> all(@RequestParam(required = false) String search, @RequestParam(required = false) String status) {
        return vendorService.all(search, status);
    }

    @PostMapping
    public ResponseEntity<Models.Vendor> create(@Valid @RequestBody Requests.CreateVendorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vendorService.create(request));
    }

    @GetMapping("/{id}")
    public Models.Vendor get(@PathVariable Long id) {
        return vendorService.get(id);
    }

    @PutMapping("/{id}")
    public Models.Vendor update(@PathVariable Long id, @Valid @RequestBody Requests.CreateVendorRequest request) {
        return vendorService.update(id, request);
    }

    @PatchMapping("/{id}/status")
    public Models.Vendor status(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return vendorService.status(id, body.getOrDefault("status", "active"));
    }
}
