package tn.esprit.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String nom;
    private String prenom;
    private String telephone;
    private String specialite;
    private Integer experience;
    private String disponibilite;
    private String niveau_actuel;
    private String statut_etudiant;
    private String poste;
    private String email;
}
