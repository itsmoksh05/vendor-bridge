package com.vendorbridge.controller;

import com.vendorbridge.dto.Requests;
import com.vendorbridge.model.Models;
import com.vendorbridge.service.InvoiceService;
import java.util.List;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class InvoiceController {
    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    public List<Models.Invoice> all() {
        return invoiceService.all();
    }

    @PostMapping
    public ResponseEntity<Models.Invoice> generate(@RequestBody Requests.IdRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invoiceService.generate(request.poId()));
    }

    @GetMapping("/generate-from-po/{poId}")
    public ResponseEntity<Models.Invoice> generateFromPo(@PathVariable Long poId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invoiceService.generate(poId));
    }

    @GetMapping("/{id}")
    public Models.Invoice get(@PathVariable Long id) {
        return invoiceService.get(id);
    }

    @PostMapping("/{id}/send-email")
    public Models.Invoice sendEmail(@PathVariable Long id) {
        return invoiceService.sendEmail(id);
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> pdf(@PathVariable Long id) {
        Models.Invoice invoice = invoiceService.get(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment().filename("Invoice-" + invoice.invoiceNumber() + ".pdf").build());
        return new ResponseEntity<>(invoiceService.pdf(id), headers, HttpStatus.OK);
    }
}
