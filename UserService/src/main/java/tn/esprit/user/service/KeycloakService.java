package tn.esprit.user.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tn.esprit.user.dto.RegisterRequest;

import jakarta.ws.rs.core.Response;
import java.util.Collections;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class KeycloakService {

    private final Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    public String createKeycloakUser(RegisterRequest request) {
        RealmResource realmResource = keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();

        UserRepresentation user = new UserRepresentation();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getPrenom());
        user.setLastName(request.getNom());
        user.setEnabled(true);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setTemporary(false);
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(request.getPassword());
        user.setCredentials(Collections.singletonList(credential));

        Response response = usersResource.create(user);
        log.info("Keycloak user creation response: {}", response.getStatus());

        if (response.getStatus() == 201) {
            String locationHeader = response.getLocation().toString();
            String keycloakId = locationHeader.substring(locationHeader.lastIndexOf('/') + 1);
            assignRoleToUser(realmResource, keycloakId, request.getRole().name());
            return keycloakId;
        }
        throw new RuntimeException("Failed to create Keycloak user, status: " + response.getStatus());
    }

    private void assignRoleToUser(RealmResource realmResource, String userId, String roleName) {
        RoleRepresentation role = realmResource.roles().get(roleName.toLowerCase()).toRepresentation();
        realmResource.users().get(userId).roles().realmLevel()
                .add(List.of(role));
        log.info("Assigned role {} to user {}", roleName, userId);
    }

    public void deleteKeycloakUser(String keycloakId) {
        keycloak.realm(realm).users().get(keycloakId).remove();
        log.info("Deleted Keycloak user: {}", keycloakId);
    }

    public void updateKeycloakUserPassword(String keycloakId, String newPassword) {
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setTemporary(false);
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(newPassword);
        keycloak.realm(realm).users().get(keycloakId).resetPassword(credential);
        log.info("Updated password for Keycloak user: {}", keycloakId);
    }
}
