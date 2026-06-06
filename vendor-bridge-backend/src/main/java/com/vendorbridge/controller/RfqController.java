package com.vendorbridge.controller;

import com.vendorbridge.dto.Requests;
import com.vendorbridge.model.Models;
import com.vendorbridge.service.RfqService;
import jakarta.validation.Valid;
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
@RequestMapping("/api/rfqs")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class RfqController {
    private final RfqService rfqService;

    public RfqController(RfqService rfqService) {
        this.rfqService = rfqService;
    }

    @GetMapping
    public List<Models.Rfq> all() {
        return rfqService.all();
    }

    @PostMapping
    public ResponseEntity<Models.Rfq> create(@Valid @RequestBody Requests.CreateRfqRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rfqService.create(request));
    }

    @GetMapping("/{id}")
    public Models.Rfq get(@PathVariable Long id) {
        return rfqService.get(id);
    }

    @PostMapping("/{id}/close")
    public Models.Rfq close(@PathVariable Long id) {
        return rfqService.close(id);
    }
}
