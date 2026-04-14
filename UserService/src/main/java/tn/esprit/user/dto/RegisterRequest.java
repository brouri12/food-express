package tn.esprit.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import tn.esprit.user.entity.UserRole;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private UserRole role;
    private String nom;
    private String prenom;
    private String telephone;
    private String specialite;
    private Integer experience;
    private String disponibilite;
    private LocalDate date_naissance;
    private String niveau_actuel;
    private String statut_etudiant;
    private String poste;
}
