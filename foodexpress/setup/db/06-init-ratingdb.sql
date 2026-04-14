-- ============================================================
-- rating-service database initialization
-- ============================================================

CREATE TABLE IF NOT EXISTS ratings (
    id              BIGSERIAL      PRIMARY KEY,
    restaurant_id   VARCHAR(36)    NOT NULL,
    menu_item_id    VARCHAR(36),
    user_id         VARCHAR(100)   NOT NULL,
    note            INTEGER        NOT NULL CHECK (note >= 1 AND note <= 5),
    commentaire     VARCHAR(500),
    date_creation   TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, restaurant_id)
);

CREATE INDEX IF NOT EXISTS idx_rating_restaurant ON ratings(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_rating_user       ON ratings(user_id);

-- Seed: quelques avis de démonstration
INSERT INTO ratings (restaurant_id, user_id, note, commentaire, date_creation)
VALUES
    ('rest-001', 'user-client-001', 5, 'Excellent ! Le bœuf bourguignon était délicieux.', NOW() - INTERVAL '2 days'),
    ('rest-001', 'user-resto-001',  4, 'Très bon restaurant, juste un peu cher.', NOW() - INTERVAL '1 day'),
    ('rest-002', 'user-client-001', 5, 'Les meilleurs sushis de Paris !', NOW() - INTERVAL '3 days'),
    ('rest-003', 'user-livreur-001',4, 'Pizza croustillante, livraison rapide.', NOW() - INTERVAL '5 days')
ON CONFLICT (user_id, restaurant_id) DO NOTHING;
