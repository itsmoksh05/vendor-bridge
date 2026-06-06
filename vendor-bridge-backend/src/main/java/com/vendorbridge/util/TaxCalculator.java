package com.vendorbridge.util;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class TaxCalculator {
    private TaxCalculator() {}
    public static BigDecimal calculateGst(BigDecimal amount, BigDecimal rate) {
        return amount.multiply(rate).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
    }
    public static BigDecimal calculateGrandTotal(BigDecimal subtotal, BigDecimal taxRate) {
        return subtotal.add(calculateGst(subtotal, taxRate)).setScale(2, RoundingMode.HALF_UP);
    }
}
