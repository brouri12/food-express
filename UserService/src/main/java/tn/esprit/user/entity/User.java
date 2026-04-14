package tn.esprit.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_user;

    @Column(unique = true)
    private String keycloak_id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    private Boolean enabled = true;

    private LocalDateTime date_creation;

    private LocalDateTime last_login;

    private String nom;

    private String prenom;

    private String telephone;

    private String specialite;

    private Integer experience;

    private String disponibilite;

    private String niveau_actuel;

    private String statut_etudiant;

    private String poste;
}
