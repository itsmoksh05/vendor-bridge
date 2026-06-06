package com.vendorbridge.controller;

import com.vendorbridge.dto.Requests;
import com.vendorbridge.dto.Responses;
import com.vendorbridge.model.Models;
import com.vendorbridge.service.QuotationService;
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
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class QuotationController {
    private final QuotationService quotationService;

    public QuotationController(QuotationService quotationService) {
        this.quotationService = quotationService;
    }

    @GetMapping("/api/quotations")
    public List<Models.Quotation> all() {
        return quotationService.all();
    }

    @PostMapping("/api/quotations")
    public ResponseEntity<Models.Quotation> submit(@Valid @RequestBody Requests.SubmitQuotationRequest request) {
        Long rfqId = request.rfqId() == null ? 1L : request.rfqId();
        return ResponseEntity.status(HttpStatus.CREATED).body(quotationService.submit(rfqId, request));
    }

    @GetMapping("/api/quotations/rfq/{rfqId}")
    public List<Models.Quotation> byRfq(@PathVariable Long rfqId) {
        return quotationService.byRfq(rfqId);
    }

    @PostMapping("/api/rfqs/{rfqId}/quotations")
    public ResponseEntity<Models.Quotation> submitForRfq(@PathVariable Long rfqId, @Valid @RequestBody Requests.SubmitQuotationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(quotationService.submit(rfqId, request));
    }

    @GetMapping("/api/rfqs/{rfqId}/compare")
    public Responses.QuotationComparisonResponse compare(@PathVariable Long rfqId) {
        return quotationService.compare(rfqId);
    }

    @GetMapping("/api/quotations/award/{quoteId}")
    public Models.Approval award(@PathVariable Long quoteId) {
        return quotationService.award(quoteId);
    }
}
