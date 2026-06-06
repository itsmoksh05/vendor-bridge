package com.vendorbridge.service;

import com.vendorbridge.model.Models;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ActivityLogService {
    private final DataStore data;
    public ActivityLogService(DataStore data) { this.data = data; }
    public void log(String user, String role, String entityType, Long entityId, String action, String description) {
        data.logs.add(0, new Models.ActivityLog(data.logSeq.incrementAndGet(), user, role, entityType, entityId, action, description, LocalDateTime.now()));
    }
    public List<Models.ActivityLog> all() { return data.logs; }
}
