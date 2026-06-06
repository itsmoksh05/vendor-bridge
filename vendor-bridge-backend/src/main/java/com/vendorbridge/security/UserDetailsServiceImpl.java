package com.vendorbridge.security;

import com.vendorbridge.model.Models;
import com.vendorbridge.service.DataStore;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final DataStore data;
    public UserDetailsServiceImpl(DataStore data) { this.data = data; }
    @Override public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Models.User user = data.users.values().stream().filter(u -> u.email().equalsIgnoreCase(email)).findFirst().orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return User.withUsername(user.email()).password(user.password()).authorities("ROLE_" + user.role().name()).disabled(!user.active()).build();
    }
}
