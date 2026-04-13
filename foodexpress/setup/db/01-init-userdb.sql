-- ============================================================
-- user-service database initialization
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id           VARCHAR(36)  PRIMARY KEY,
    email        VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    first_name   VARCHAR(100) NOT NULL,
    last_name    VARCHAR(100) NOT NULL,
    phone        VARCHAR(20),
    avatar_url   VARCHAR(500),
    role         VARCHAR(20)  NOT NULL DEFAULT 'CLIENT',
    enabled      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS addresses (
    id          VARCHAR(36)  PRIMARY KEY,
    user_id     VARCHAR(36)  NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label       VARCHAR(50)  NOT NULL,
    street      VARCHAR(255) NOT NULL,
    city        VARCHAR(100),
    postal_code VARCHAR(10),
    country     VARCHAR(50)  DEFAULT 'France',
    is_default  BOOLEAN      DEFAULT FALSE
);

-- Seed: admin user (password = admin123 bcrypt)
INSERT INTO users (id, email, password, first_name, last_name, phone, role, enabled)
VALUES (
    'user-admin-001',
    'admin@foodexpress.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Admin', 'FoodExpress', '+33 1 00 00 00 00', 'ADMIN', TRUE
) ON CONFLICT (email) DO NOTHING;

-- Seed: client
INSERT INTO users (id, email, password, first_name, last_name, phone, role, enabled)
VALUES (
    'user-client-001',
    'client@foodexpress.com',
    '$2a$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B9tDUem',
    'Sophie', 'Martin', '+33 6 12 34 56 78', 'CLIENT', TRUE
) ON CONFLICT (email) DO NOTHING;

-- Seed: restaurateur
INSERT INTO users (id, email, password, first_name, last_name, phone, role, enabled)
VALUES (
    'user-resto-001',
    'resto@foodexpress.com',
    '$2a$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B9tDUem',
    'Marc', 'Dupont', '+33 6 98 76 54 32', 'RESTAURATEUR', TRUE
) ON CONFLICT (email) DO NOTHING;

-- Seed: livreur
INSERT INTO users (id, email, password, first_name, last_name, phone, role, enabled)
VALUES (
    'user-livreur-001',
    'livreur@foodexpress.com',
    '$2a$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B9tDUem',
    'Thomas', 'Dubois', '+33 6 55 44 33 22', 'LIVREUR', TRUE
) ON CONFLICT (email) DO NOTHING;

-- Addresses for client
INSERT INTO addresses (id, user_id, label, street, city, postal_code, is_default)
VALUES
    ('addr-001', 'user-client-001', 'Maison', '15 Rue de la Paix', 'Paris', '75002', TRUE),
    ('addr-002', 'user-client-001', 'Bureau', '42 Avenue des Champs-Élysées', 'Paris', '75008', FALSE)
ON CONFLICT DO NOTHING;
