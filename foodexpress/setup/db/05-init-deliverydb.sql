-- ============================================================
-- delivery-service database initialization
-- ============================================================

CREATE TABLE IF NOT EXISTS deliveries (
    id               VARCHAR(36)    PRIMARY KEY,
    order_id         VARCHAR(36)    NOT NULL UNIQUE,
    driver_id        VARCHAR(36),
    driver_name      VARCHAR(100),
    driver_phone     VARCHAR(20),
    customer_id      VARCHAR(36)    NOT NULL,
    restaurant_id    VARCHAR(36)    NOT NULL,
    delivery_address VARCHAR(500)   NOT NULL,
    restaurant_lat   DOUBLE PRECISION,
    restaurant_lng   DOUBLE PRECISION,
    delivery_lat     DOUBLE PRECISION,
    delivery_lng     DOUBLE PRECISION,
    current_lat      DOUBLE PRECISION,
    current_lng      DOUBLE PRECISION,
    delivery_fee     DECIMAL(10,2)  NOT NULL,
    estimated_minutes INTEGER,
    status           VARCHAR(20)    NOT NULL DEFAULT 'PENDING',
    picked_up_at     TIMESTAMP,
    delivered_at     TIMESTAMP,
    created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_delivery_order    ON deliveries(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_driver   ON deliveries(driver_id);
CREATE INDEX IF NOT EXISTS idx_delivery_customer ON deliveries(customer_id);
CREATE INDEX IF NOT EXISTS idx_delivery_status   ON deliveries(status);

-- Seed: une livraison de démo
INSERT INTO deliveries (id, order_id, driver_id, driver_name, driver_phone, customer_id, restaurant_id,
    delivery_address, restaurant_lat, restaurant_lng, delivery_lat, delivery_lng,
    delivery_fee, estimated_minutes, status)
VALUES (
    'delivery-demo-001',
    'order-demo-001',
    'user-livreur-001',
    'Thomas Dubois',
    '+33 6 55 44 33 22',
    'user-client-001',
    'rest-002',
    '15 Rue de la Paix, 75002 Paris',
    48.8606, 2.3376,
    48.8566, 2.3522,
    3.00, 15, 'ON_THE_WAY'
) ON CONFLICT (id) DO NOTHING;
