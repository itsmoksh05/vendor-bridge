package com.vendorbridge.controller;

import com.vendorbridge.dto.Requests;
import com.vendorbridge.model.Models;
import com.vendorbridge.service.PurchaseOrderService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class PurchaseOrderController {
    private final PurchaseOrderService purchaseOrderService;

    public PurchaseOrderController(PurchaseOrderService purchaseOrderService) {
        this.purchaseOrderService = purchaseOrderService;
    }

    @GetMapping
    public List<Models.PurchaseOrder> all() {
        return purchaseOrderService.all();
    }

    @GetMapping("/{id}")
    public Models.PurchaseOrder get(@PathVariable Long id) {
        return purchaseOrderService.get(id);
    }

    @PostMapping
    public ResponseEntity<Models.PurchaseOrder> generate(@RequestBody Requests.IdRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(purchaseOrderService.generate(request.quotationId()));
    }
}
