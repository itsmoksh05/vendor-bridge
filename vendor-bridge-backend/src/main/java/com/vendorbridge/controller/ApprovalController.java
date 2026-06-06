package com.vendorbridge.controller;

import com.vendorbridge.dto.Requests;
import com.vendorbridge.model.Models;
import com.vendorbridge.service.ApprovalService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/approvals")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ApprovalController {
    private final ApprovalService approvalService;

    public ApprovalController(ApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    @GetMapping
    public List<Models.Approval> all() {
        return approvalService.all();
    }

    @GetMapping("/pending")
    public List<Models.Approval> pending() {
        return approvalService.pending();
    }

    @PostMapping("/{quotationId}/request")
    public Models.Approval request(@PathVariable Long quotationId) {
        return approvalService.request(quotationId);
    }

    @PutMapping("/{id}")
    public Models.Approval action(@PathVariable Long id, @Valid @RequestBody Requests.ApprovalActionRequest request) {
        return approvalService.action(id, request);
    }

    @GetMapping("/{id}/approve")
    public Models.Approval approve(@PathVariable Long id) {
        return approvalService.action(id, "approved", "Approved from dashboard");
    }

    @GetMapping("/{id}/reject")
    public Models.Approval reject(@PathVariable Long id) {
        return approvalService.action(id, "rejected", "Rejected from dashboard");
    }
}
