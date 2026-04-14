-- ============================================================
-- order-service database initialization
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
    id               BIGSERIAL      PRIMARY KEY,
    user_id          VARCHAR(36)    NOT NULL,
    client_name      VARCHAR(100)   NOT NULL,
    restaurant_id    VARCHAR(36)    NOT NULL,
    restaurant_name  VARCHAR(255)   NOT NULL,
    delivery_address VARCHAR(500)   NOT NULL,
    status           VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
    total_amount     DECIMAL(10,2)  NOT NULL,
    promo_code       VARCHAR(50),
    discount         DECIMAL(10,2)  DEFAULT 0,
    qr_code          TEXT,
    created_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id              BIGSERIAL      PRIMARY KEY,
    order_id        BIGINT         NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id    VARCHAR(36)    NOT NULL,
    menu_item_name  VARCHAR(255)   NOT NULL,
    quantity        INTEGER        NOT NULL,
    unit_price      DECIMAL(10,2)  NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_user       ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_restaurant ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_order_status     ON orders(status);

-- Seed: quelques commandes de démonstration
INSERT INTO orders (user_id, client_name, restaurant_id, restaurant_name, delivery_address, status, total_amount, created_at, updated_at)
VALUES
    ('user-client-001', 'Sophie Martin', 'rest-001', 'Le Bistrot Parisien', '15 Rue de la Paix, 75002 Paris', 'DELIVERED', 29.90, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
    ('user-client-001', 'Sophie Martin', 'rest-002', 'Sushi Master', '15 Rue de la Paix, 75002 Paris', 'ON_THE_WAY', 25.90, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes')
ON CONFLICT DO NOTHING;

INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, unit_price)
SELECT o.id, 'menu-001', 'Soupe à l''oignon gratinée', 1, 8.50
FROM orders o WHERE o.client_name = 'Sophie Martin' AND o.status = 'DELIVERED'
LIMIT 1;

INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, unit_price)
SELECT o.id, 'menu-003', 'Bœuf Bourguignon', 1, 18.90
FROM orders o WHERE o.client_name = 'Sophie Martin' AND o.status = 'DELIVERED'
LIMIT 1;
