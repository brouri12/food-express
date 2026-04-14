package com.foodexpress.order.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Service
public class QRCodeService {

    public String generateQRCode(String data) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix bitMatrix = writer.encode(data, BarcodeFormat.QR_CODE, 300, 300);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", out);
            return Base64.getEncoder().encodeToString(out.toByteArray());
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Erreur génération QR code", e);
        }
    }

    public String generateOrderQRCode(Long orderId, String clientName, String restaurantName,
                                       Double totalAmount, String status) {
        String data = String.format(
            "FOODEXPRESS ORDER\nID: %d\nClient: %s\nRestaurant: %s\nTotal: %.2f EUR\nStatus: %s",
            orderId, clientName, restaurantName, totalAmount, status
        );
        return generateQRCode(data);
    }
}
