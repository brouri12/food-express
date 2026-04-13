package com.example.commandes.controller;

import com.example.commandes.dto.CommandeDTO;
import com.example.commandes.service.CommandeService;
import com.example.commandes.service.QRCodeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/commandes")
@CrossOrigin(origins = "*")
public class CommandeController {
    
    private static final Logger logger = LoggerFactory.getLogger(CommandeController.class);
    
    @Autowired
    private CommandeService commandeService;
    
    @Autowired
    private QRCodeService qrCodeService;
    
    @GetMapping
    public ResponseEntity<List<CommandeDTO>> getAllCommandes() {
        logger.info("GET /commandes - Fetching all commandes");
        List<CommandeDTO> commandes = commandeService.getAllCommandes();
        logger.info("Found {} commandes", commandes.size());
        return ResponseEntity.ok(commandes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CommandeDTO> getCommandeById(@PathVariable Long id) {
        logger.info("GET /commandes/{} - Fetching commande by id", id);
        try {
            CommandeDTO commande = commandeService.getCommandeById(id);
            return ResponseEntity.ok(commande);
        } catch (RuntimeException e) {
            logger.error("Commande not found with id: {}", id);
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<CommandeDTO> createCommande(@RequestBody CommandeDTO commandeDTO) {
        logger.info("POST /commandes - Creating new commande: {}", commandeDTO);
        try {
            CommandeDTO createdCommande = commandeService.createCommande(commandeDTO);
            logger.info("Commande created successfully with id: {}", createdCommande.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCommande);
        } catch (Exception e) {
            logger.error("Error creating commande: ", e);
            throw e;
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CommandeDTO> updateCommande(@PathVariable Long id, @RequestBody CommandeDTO commandeDTO) {
        logger.info("PUT /commandes/{} - Updating commande", id);
        try {
            CommandeDTO updatedCommande = commandeService.updateCommande(id, commandeDTO);
            logger.info("Commande updated successfully");
            return ResponseEntity.ok(updatedCommande);
        } catch (RuntimeException e) {
            logger.error("Error updating commande with id: {}", id, e);
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommande(@PathVariable Long id) {
        logger.info("DELETE /commandes/{} - Deleting commande", id);
        try {
            commandeService.deleteCommande(id);
            logger.info("Commande deleted successfully");
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            logger.error("Error deleting commande with id: {}", id, e);
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{id}/qrcode")
    public ResponseEntity<byte[]> getQRCodeImage(@PathVariable Long id) {
        logger.info("GET /commandes/{}/qrcode - Fetching QR code image", id);
        try {
            CommandeDTO commande = commandeService.getCommandeById(id);
            
            if (commande.getQrCode() == null || commande.getQrCode().isEmpty()) {
                logger.warn("No QR code found for commande id: {}", id);
                return ResponseEntity.notFound().build();
            }
            
            // Decode Base64 to bytes
            byte[] qrCodeBytes = java.util.Base64.getDecoder().decode(commande.getQrCode());
            
            return ResponseEntity.ok()
                    .header("Content-Type", "image/png")
                    .header("Content-Disposition", "inline; filename=qrcode-" + id + ".png")
                    .body(qrCodeBytes);
        } catch (RuntimeException e) {
            logger.error("Error fetching QR code for commande id: {}", id, e);
            return ResponseEntity.notFound().build();
        }
    }
}
