package com.vendorbridge.controller;

import com.vendorbridge.model.Models;
import com.vendorbridge.service.ActivityLogService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ActivityController {
    private final ActivityLogService activityLogService;

    public ActivityController(ActivityLogService activityLogService) {
        this.activityLogService = activityLogService;
    }

    @GetMapping({"/api/activity", "/api/activity-logs"})
    public List<Models.ActivityLog> all() {
        return activityLogService.all();
    }
}
