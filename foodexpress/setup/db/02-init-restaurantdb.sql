-- ============================================================
-- restaurant-service database initialization
-- ============================================================

CREATE TABLE IF NOT EXISTS restaurants (
    id                  VARCHAR(36)    PRIMARY KEY,
    name                VARCHAR(255)   NOT NULL,
    description         TEXT,
    owner_id            VARCHAR(36)    NOT NULL,
    image_url           VARCHAR(500),
    address             VARCHAR(255),
    city                VARCHAR(100),
    phone               VARCHAR(20),
    latitude            DOUBLE PRECISION,
    longitude           DOUBLE PRECISION,
    delivery_fee        DECIMAL(10,2)  NOT NULL DEFAULT 2.50,
    min_order           INTEGER        NOT NULL DEFAULT 15,
    delivery_time_range VARCHAR(20)    DEFAULT '25-35',
    rating              DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    rating_count        INTEGER        NOT NULL DEFAULT 0,
    active              BOOLEAN        NOT NULL DEFAULT TRUE,
    promoted            BOOLEAN        NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurant_categories (
    restaurant_id VARCHAR(36)  NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    category      VARCHAR(100) NOT NULL
);

-- ── Seed data ──────────────────────────────────────────────

INSERT INTO restaurants (id, name, description, owner_id, image_url, address, city, latitude, longitude, delivery_fee, min_order, delivery_time_range, rating, rating_count, active, promoted)
VALUES
(
    'rest-001', 'Le Bistrot Parisien',
    'Cuisine française authentique avec des produits frais du marché',
    'user-resto-001',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop',
    '12 Rue de Rivoli', 'Paris', 48.8566, 2.3522,
    2.50, 15, '25-35', 4.8, 1250, TRUE, TRUE
),
(
    'rest-002', 'Sushi Master',
    'Les meilleurs sushi de Paris, préparés par des maîtres japonais',
    'user-resto-001',
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&h=400&fit=crop',
    '8 Rue du Temple', 'Paris', 48.8606, 2.3376,
    3.00, 20, '30-40', 4.9, 890, TRUE, FALSE
),
(
    'rest-003', 'Pizza Napoli',
    'Pizzas artisanales cuites au feu de bois, recettes napolitaines',
    'user-resto-001',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop',
    '5 Avenue de la République', 'Paris', 48.8584, 2.2945,
    1.99, 12, '20-30', 4.6, 2100, TRUE, TRUE
),
(
    'rest-004', 'Le Burger King',
    'Burgers gourmands et généreux, viande 100% française',
    'user-resto-001',
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop',
    '22 Boulevard Haussmann', 'Paris', 48.8738, 2.2950,
    1.50, 10, '15-25', 4.5, 3200, TRUE, FALSE
),
(
    'rest-005', 'Saigon Street',
    'Cuisine vietnamienne traditionnelle, pho et banh mi maison',
    'user-resto-001',
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=400&fit=crop',
    '18 Rue de Belleville', 'Paris', 48.8499, 2.3629,
    2.00, 15, '25-35', 4.7, 670, TRUE, FALSE
),
(
    'rest-006', 'Taj Mahal',
    'Spécialités indiennes épicées et savoureuses, curry et tandoori',
    'user-resto-001',
    'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop',
    '3 Rue de la Roquette', 'Paris', 48.8411, 2.3522,
    2.50, 18, '30-40', 4.4, 980, TRUE, TRUE
)
ON CONFLICT (id) DO NOTHING;

-- Categories
INSERT INTO restaurant_categories (restaurant_id, category) VALUES
    ('rest-001', 'Française'), ('rest-001', 'Bistrot'),
    ('rest-002', 'Japonaise'), ('rest-002', 'Sushi'),
    ('rest-003', 'Italienne'), ('rest-003', 'Pizza'),
    ('rest-004', 'Américaine'), ('rest-004', 'Burgers'),
    ('rest-005', 'Vietnamienne'), ('rest-005', 'Asiatique'),
    ('rest-006', 'Indienne'), ('rest-006', 'Curry')
ON CONFLICT DO NOTHING;
