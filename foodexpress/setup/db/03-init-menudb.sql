-- ============================================================
-- menu-service database initialization
-- ============================================================

CREATE TABLE IF NOT EXISTS menu_items (
    id            VARCHAR(36)    PRIMARY KEY,
    restaurant_id VARCHAR(36)    NOT NULL,
    name          VARCHAR(255)   NOT NULL,
    description   TEXT,
    price         DECIMAL(10,2)  NOT NULL,
    image_url     VARCHAR(500),
    category      VARCHAR(100)   NOT NULL,
    popular       BOOLEAN        NOT NULL DEFAULT FALSE,
    vegetarian    BOOLEAN        NOT NULL DEFAULT FALSE,
    vegan         BOOLEAN        NOT NULL DEFAULT FALSE,
    gluten_free   BOOLEAN        NOT NULL DEFAULT FALSE,
    available     BOOLEAN        NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_menu_restaurant ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_category   ON menu_items(category);

-- ── Bistrot Parisien (rest-001) ────────────────────────────

INSERT INTO menu_items (id, restaurant_id, name, description, price, image_url, category, popular, vegetarian, available) VALUES
('menu-001', 'rest-001', 'Soupe à l''oignon gratinée',
 'Soupe traditionnelle française avec croûtons et fromage fondu',
 8.50, 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=200&fit=crop',
 'Entrées', TRUE, TRUE, TRUE),

('menu-002', 'rest-001', 'Escargots de Bourgogne',
 '6 escargots au beurre persillé, servis dans leur coquille',
 12.00, 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=300&h=200&fit=crop',
 'Entrées', FALSE, FALSE, TRUE),

('menu-003', 'rest-001', 'Bœuf Bourguignon',
 'Bœuf mijoté au vin rouge avec légumes et pommes de terre',
 18.90, 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=300&h=200&fit=crop',
 'Plats', TRUE, FALSE, TRUE),

('menu-004', 'rest-001', 'Coq au vin',
 'Poulet fermier mijoté dans une sauce au vin rouge avec champignons',
 16.50, 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=300&h=200&fit=crop',
 'Plats', FALSE, FALSE, TRUE),

('menu-005', 'rest-001', 'Crème Brûlée',
 'Crème onctueuse à la vanille de Madagascar, caramélisée à la flamme',
 7.50, 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&h=200&fit=crop',
 'Desserts', TRUE, TRUE, TRUE)

ON CONFLICT (id) DO NOTHING;

-- ── Sushi Master (rest-002) ────────────────────────────────

INSERT INTO menu_items (id, restaurant_id, name, description, price, image_url, category, popular, vegetarian, available) VALUES
('menu-006', 'rest-002', 'Assortiment Sushi 12 pièces',
 'Saumon, thon, daurade, crevette — sélection du chef',
 22.90, 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=300&h=200&fit=crop',
 'Sushi', TRUE, FALSE, TRUE),

('menu-007', 'rest-002', 'Maki Saumon Avocat',
 '8 pièces de maki au saumon frais et avocat crémeux',
 9.90, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&h=200&fit=crop',
 'Maki', TRUE, FALSE, TRUE),

('menu-008', 'rest-002', 'Sashimi Saumon',
 '12 tranches de saumon frais, sauce soja et wasabi',
 18.90, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&h=200&fit=crop',
 'Sashimi', FALSE, FALSE, TRUE),

('menu-009', 'rest-002', 'Edamame',
 'Fèves de soja vapeur légèrement salées',
 4.50, 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=300&h=200&fit=crop',
 'Entrées', FALSE, TRUE, TRUE)

ON CONFLICT (id) DO NOTHING;

-- ── Pizza Napoli (rest-003) ────────────────────────────────

INSERT INTO menu_items (id, restaurant_id, name, description, price, image_url, category, popular, vegetarian, available) VALUES
('menu-010', 'rest-003', 'Pizza Margherita',
 'Tomate San Marzano, mozzarella fior di latte, basilic frais',
 11.90, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop',
 'Pizzas', TRUE, TRUE, TRUE),

('menu-011', 'rest-003', 'Pizza Quattro Formaggi',
 'Mozzarella, gorgonzola, parmesan, pecorino',
 14.90, 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&h=200&fit=crop',
 'Pizzas', TRUE, TRUE, TRUE),

('menu-012', 'rest-003', 'Pizza Diavola',
 'Tomate, mozzarella, salami piquant, piment',
 13.90, 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&h=200&fit=crop',
 'Pizzas', FALSE, FALSE, TRUE),

('menu-013', 'rest-003', 'Tiramisu',
 'Tiramisu maison au mascarpone et café espresso',
 6.50, 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300&h=200&fit=crop',
 'Desserts', TRUE, TRUE, TRUE)

ON CONFLICT (id) DO NOTHING;

-- ── Le Burger King (rest-004) ──────────────────────────────

INSERT INTO menu_items (id, restaurant_id, name, description, price, image_url, category, popular, vegetarian, available) VALUES
('menu-014', 'rest-004', 'Classic Burger',
 'Steak haché 180g, cheddar, salade, tomate, cornichons',
 12.90, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop',
 'Burgers', TRUE, FALSE, TRUE),

('menu-015', 'rest-004', 'Double Cheese',
 'Double steak, double cheddar, sauce maison',
 15.90, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop',
 'Burgers', TRUE, FALSE, TRUE),

('menu-016', 'rest-004', 'Veggie Burger',
 'Galette de légumes, avocat, roquette, sauce yaourt',
 11.90, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop',
 'Burgers', FALSE, TRUE, TRUE),

('menu-017', 'rest-004', 'Frites Maison',
 'Frites fraîches coupées à la main, sel de Guérande',
 4.50, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop',
 'Accompagnements', TRUE, TRUE, TRUE)

ON CONFLICT (id) DO NOTHING;
