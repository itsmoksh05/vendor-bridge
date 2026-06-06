package com.vendorbridge.service;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.vendorbridge.exception.ResourceNotFoundException;
import com.vendorbridge.model.Models;
import com.vendorbridge.util.NumberGenerator;
import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class InvoiceService {
    private static final Logger log = LoggerFactory.getLogger(InvoiceService.class);
    private final DataStore data; private final NumberGenerator numbers; private final ActivityLogService logs; private final JavaMailSender mailSender;
    public InvoiceService(DataStore data, NumberGenerator numbers, ActivityLogService logs, JavaMailSender mailSender) { this.data = data; this.numbers = numbers; this.logs = logs; this.mailSender = mailSender; }
    public List<Models.Invoice> all() { return data.invoices.values().stream().sorted(Comparator.comparing(Models.Invoice::createdAt).reversed()).toList(); }
    public Models.Invoice get(Long id) { Models.Invoice inv = data.invoices.get(id); if (inv == null) throw new ResourceNotFoundException("Invoice not found: " + id); return inv; }
    public Models.Invoice generate(Long poId) { Models.PurchaseOrder po = data.purchaseOrders.get(poId); if (po == null) throw new ResourceNotFoundException("PO not found: " + poId); BigDecimal rate = BigDecimal.valueOf(18); BigDecimal tax = po.amount().multiply(rate).divide(BigDecimal.valueOf(100)); Long id = data.invoiceSeq.incrementAndGet(); Models.Invoice inv = new Models.Invoice(id, numbers.generateInvoiceNumber(), poId, po.poNumber(), po.vendorId(), po.vendorName(), po.amount(), rate, tax, po.amount().add(tax), "pending", LocalDate.now().plusDays(30), null, LocalDateTime.now(), po.items()); data.invoices.put(id, inv); logs.log("Sarah Jenkins", "PROCUREMENT_OFFICER", "INVOICE", id, "INVOICE_GENERATED", "Generated " + inv.invoiceNumber()); return inv; }
    public Models.Invoice sendEmail(Long id) { Models.Invoice old = get(id); try { log.info("Demo email prepared for invoice {}", old.invoiceNumber()); } catch (MailException ex) { log.warn("Email failed for invoice {}", old.invoiceNumber(), ex); } Models.Invoice inv = new Models.Invoice(old.id(), old.invoiceNumber(), old.poId(), old.poNumber(), old.vendorId(), old.vendorName(), old.subtotal(), old.taxRate(), old.taxAmount(), old.amount(), "sent", old.dueDate(), LocalDateTime.now(), old.createdAt(), old.items()); data.invoices.put(id, inv); return inv; }
    public byte[] pdf(Long id) { Models.Invoice inv = get(id); try { ByteArrayOutputStream out = new ByteArrayOutputStream(); Document document = new Document(PageSize.A4); PdfWriter.getInstance(document, out); document.open(); Font title = new Font(Font.HELVETICA, 20, Font.BOLD, Color.WHITE); PdfPTable header = new PdfPTable(2); header.setWidthPercentage(100); PdfPCell left = new PdfPCell(new Phrase("VendorBridge ERP", title)); left.setBackgroundColor(new Color(30,58,95)); left.setPadding(12); PdfPCell right = new PdfPCell(new Phrase("INVOICE\n" + inv.invoiceNumber(), title)); right.setHorizontalAlignment(Element.ALIGN_RIGHT); right.setBackgroundColor(new Color(30,58,95)); right.setPadding(12); header.addCell(left); header.addCell(right); document.add(header); document.add(new Paragraph("\nBill To: " + inv.vendorName() + "\nPO: " + inv.poNumber() + "\nDue: " + inv.dueDate() + "\n")); PdfPTable table = new PdfPTable(5); table.setWidthPercentage(100); for (String h : List.of("#", "Product", "Qty", "Unit Price", "Total")) table.addCell(h); int i=1; for (Models.QuotationItem item : inv.items()) { table.addCell(String.valueOf(i++)); table.addCell(item.description()); table.addCell(String.valueOf(item.quantity())); table.addCell(item.unitPrice().toPlainString()); table.addCell(item.total().toPlainString()); } document.add(table); document.add(new Paragraph("\nSubtotal: " + inv.subtotal() + "\nGST(" + inv.taxRate() + "%): " + inv.taxAmount() + "\nTOTAL: " + inv.amount())); document.close(); return out.toByteArray(); } catch (Exception ex) { throw new IllegalStateException("Unable to generate PDF", ex); } }
}
