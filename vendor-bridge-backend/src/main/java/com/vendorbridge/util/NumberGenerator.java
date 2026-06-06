package com.vendorbridge.util;

import java.time.Year;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.stereotype.Component;

@Component
public class NumberGenerator {
    private final AtomicInteger rfq = new AtomicInteger(3);
    private final AtomicInteger po = new AtomicInteger(1);
    private final AtomicInteger inv = new AtomicInteger(1);
    public synchronized String generateRfqNumber() { return number("RFQ", rfq.incrementAndGet()); }
    public synchronized String generatePoNumber() { return number("PO", po.incrementAndGet()); }
    public synchronized String generateInvoiceNumber() { return number("INV", inv.incrementAndGet()); }
    private String number(String prefix, int value) { return "%s-%s-%03d".formatted(prefix, Year.now().getValue(), value); }
}
