package com.example.commandes.service;

import com.example.commandes.dto.CommandeDTO;
import com.example.commandes.entity.Commande;
import com.example.commandes.repository.CommandeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommandeService {
    
    @Autowired
    private CommandeRepository commandeRepository;
    
    @Autowired
    private QRCodeService qrCodeService;
    
    public List<CommandeDTO> getAllCommandes() {
        return commandeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public CommandeDTO getCommandeById(Long id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande not found with id: " + id));
        return convertToDTO(commande);
    }
    
    public CommandeDTO createCommande(CommandeDTO commandeDTO) {
        Commande commande = convertToEntity(commandeDTO);
        if (commande.getStatus() == null || commande.getStatus().isEmpty()) {
            commande.setStatus("PENDING");
        }
        
        // Save first to get the ID
        Commande savedCommande = commandeRepository.save(commande);
        
        // Generate QR code with order details
        String qrCode = qrCodeService.generateCommandeQRCode(
            savedCommande.getId(),
            savedCommande.getClientName(),
            savedCommande.getProduct(),
            savedCommande.getQuantity(),
            savedCommande.getPrice()
        );
        
        // Update with QR code
        savedCommande.setQrCode(qrCode);
        savedCommande = commandeRepository.save(savedCommande);
        
        return convertToDTO(savedCommande);
    }
    
    public CommandeDTO updateCommande(Long id, CommandeDTO commandeDTO) {
        Commande existingCommande = commandeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commande not found with id: " + id));
        
        existingCommande.setClientName(commandeDTO.getClientName());
        existingCommande.setProduct(commandeDTO.getProduct());
        existingCommande.setQuantity(commandeDTO.getQuantity());
        existingCommande.setPrice(commandeDTO.getPrice());
        existingCommande.setStatus(commandeDTO.getStatus());
        
        Commande updatedCommande = commandeRepository.save(existingCommande);
        return convertToDTO(updatedCommande);
    }
    
    public void deleteCommande(Long id) {
        if (!commandeRepository.existsById(id)) {
            throw new RuntimeException("Commande not found with id: " + id);
        }
        commandeRepository.deleteById(id);
    }
    
    private CommandeDTO convertToDTO(Commande commande) {
        return new CommandeDTO(
                commande.getId(),
                commande.getClientName(),
                commande.getProduct(),
                commande.getQuantity(),
                commande.getPrice(),
                commande.getStatus(),
                commande.getQrCode()
        );
    }
    
    private Commande convertToEntity(CommandeDTO dto) {
        return new Commande(
                dto.getId(),
                dto.getClientName(),
                dto.getProduct(),
                dto.getQuantity(),
                dto.getPrice(),
                dto.getStatus(),
                dto.getQrCode()
        );
    }
}
