package com.vendorbridge.service;

import com.vendorbridge.dto.Requests;
import com.vendorbridge.dto.Responses;
import com.vendorbridge.exception.BusinessException;
import com.vendorbridge.model.Models;
import com.vendorbridge.model.Role;
import com.vendorbridge.security.JwtTokenProvider;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final DataStore data;
    private final PasswordEncoder encoder;
    private final JwtTokenProvider jwt;
    private final ActivityLogService logs;
    public AuthService(DataStore data, PasswordEncoder encoder, JwtTokenProvider jwt, ActivityLogService logs) { this.data = data; this.encoder = encoder; this.jwt = jwt; this.logs = logs; }
    public Responses.AuthResponse login(Requests.LoginRequest request) {
        Models.User user = data.users.values().stream().filter(u -> u.email().equalsIgnoreCase(request.email())).findFirst().orElseThrow(() -> new BusinessException("Invalid email or password"));
        if (!encoder.matches(request.password(), user.password())) throw new BusinessException("Invalid email or password");
        String token = jwt.generateToken(User.withUsername(user.email()).password(user.password()).authorities("ROLE_" + user.role().name()).build());
        logs.log(user.email(), user.role().name(), "USER", user.id(), "LOGIN", "User logged in");
        return new Responses.AuthResponse(token, user.id(), user.name(), user.email(), user.role().name(), safeUser(user));
    }
    public Responses.AuthResponse register(Requests.RegisterRequest request) {
        if (data.users.values().stream().anyMatch(u -> u.email().equalsIgnoreCase(request.email()))) throw new BusinessException("Email already exists");
        Role role = Role.valueOf(request.role().toUpperCase());
        Long id = data.userSeq.incrementAndGet();
        Models.User user = new Models.User(id, request.name(), request.email(), encoder.encode(request.password()), role, true);
        data.users.put(id, user);
        if (role == Role.VENDOR) {
            Long vendorId = data.vendorSeq.incrementAndGet();
            String company = request.companyName() == null || request.companyName().isBlank() ? request.name() : request.companyName();
            data.vendors.put(vendorId, new Models.Vendor(vendorId, id, company, company, request.category(), null, request.email(), request.phone(), request.address(), "active", BigDecimal.valueOf(5), LocalDateTime.now()));
        }
        String token = jwt.generateToken(User.withUsername(user.email()).password(user.password()).authorities("ROLE_" + role.name()).build());
        logs.log(user.email(), role.name(), "USER", id, "REGISTER", "New user registered");
        return new Responses.AuthResponse(token, user.id(), user.name(), user.email(), role.name(), safeUser(user));
    }
    private Models.User safeUser(Models.User user) {
        return new Models.User(user.id(), user.name(), user.email(), "", user.role(), user.active());
    }
}
