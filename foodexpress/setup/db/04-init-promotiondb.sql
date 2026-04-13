-- ============================================================
-- promotion-service database initialization
-- ============================================================

CREATE TABLE IF NOT EXISTS promotions (
    id               VARCHAR(36)    PRIMARY KEY,
    title            VARCHAR(255)   NOT NULL,
    description      TEXT,
    code             VARCHAR(50)    UNIQUE,
    type             VARCHAR(30)    NOT NULL,
    discount_percent INTEGER,
    discount_amount  DECIMAL(10,2),
    min_order_amount DECIMAL(10,2),
    restaurant_id    VARCHAR(36),
    image_url        VARCHAR(500),
    valid_from       DATE           NOT NULL,
    valid_until      DATE           NOT NULL,
    active           BOOLEAN        NOT NULL DEFAULT TRUE,
    usage_limit      INTEGER        NOT NULL DEFAULT 1000,
    usage_count      INTEGER        NOT NULL DEFAULT 0,
    created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_promo_code   ON promotions(code);
CREATE INDEX IF NOT EXISTS idx_promo_active ON promotions(active, valid_from, valid_until);

-- ── Seed promotions ────────────────────────────────────────

INSERT INTO promotions (id, title, description, code, type, discount_percent, min_order_amount, image_url, valid_from, valid_until, active, usage_limit)
VALUES
(
    'promo-001',
    '-20% sur votre première commande',
    'Utilisez le code BIENVENUE20 lors de votre première commande',
    'BIENVENUE20',
    'PERCENTAGE',
    20,
    0.00,
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
    CURRENT_DATE,
    '2026-12-31',
    TRUE,
    10000
),
(
    'promo-002',
    'Livraison gratuite dès 25€',
    'Commandez pour 25€ minimum et profitez de la livraison offerte',
    'LIVRAISON0',
    'FREE_DELIVERY',
    NULL,
    25.00,
    'https://images.unsplash.com/photo-1526367790999-0150786686a2?w=800&h=400&fit=crop',
    CURRENT_DATE,
    '2026-12-31',
    TRUE,
    5000
),
(
    'promo-003',
    '1 pizza achetée = 1 offerte',
    'Valable uniquement chez Pizza Napoli le weekend',
    NULL,
    'BUY_ONE_GET_ONE',
    NULL,
    20.00,
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=400&fit=crop',
    CURRENT_DATE,
    '2026-12-31',
    TRUE,
    500
),
(
    'promo-004',
    '-5€ sur votre commande',
    'Réduction immédiate de 5€ sans minimum d''achat',
    'MOINS5',
    'FIXED_AMOUNT',
    NULL,
    0.00,
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=400&fit=crop',
    CURRENT_DATE,
    '2026-06-30',
    TRUE,
    2000
)
ON CONFLICT (id) DO NOTHING;
